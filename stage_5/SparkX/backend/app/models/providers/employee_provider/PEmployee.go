package employee_provider

import (
	"backend/app/helpers"
	"backend/app/models/entities"
	"backend/app/models/mappers"
	"database/sql"
	"errors"
	"github.com/revel/revel"
)

// PEmployee провайдер контроллера сотрудников
type PEmployee struct {
	employeeMapper        *mappers.MEmployee
	employeeTaskMapper    *mappers.MTask
	employeeProjectMapper *mappers.MProject
	employeeStateMapper   *mappers.MState
	employeeStatusMapper  *mappers.MStatus
}

// Init
func (p *PEmployee) Init() (err error) {
	var db *sql.DB // экземпляр подключения к бд

	// получение экземпляра подключения к бд
	db, err = helpers.GetDBConnection()
	if err != nil {
		revel.AppLog.Errorf("PEmployee.Init : helpers.GetDBConnection, %s\n", err)
		return err
	}

	// инициализация маппера сотрудников
	p.employeeMapper = new(mappers.MEmployee)
	p.employeeMapper.Init(db)

	// инициализация маппера задач
	p.employeeTaskMapper = new(mappers.MTask)
	p.employeeTaskMapper.Init(db)

	// инициализация маппера проектов
	p.employeeProjectMapper = new(mappers.MProject)
	p.employeeProjectMapper.Init(db)

	// инициализация маппера состояний
	p.employeeStateMapper = new(mappers.MState)
	p.employeeStateMapper.Init(db)

	// инициализация маппера статусов
	p.employeeStatusMapper = new(mappers.MStatus)
	p.employeeStatusMapper.Init(db)

	return
}

// GetEmployees метод получения сотрудников
func (p *PEmployee) GetEmployees() (es []*entities.Employee, err error) {
	var (
		edbts []*mappers.EmployeeDBType
		e     *entities.Employee
	)
	// получение данных сотрудников
	edbts, err = p.employeeMapper.SelectAll()
	if err != nil {
		revel.AppLog.Errorf("PEmployee.GetEmployees : p.employeeMapper.SelectAll, %s\n", err)
		return
	}

	for _, edbt := range edbts {
		// преобразование к типу сущности
		e, err = edbt.ToType()
		if err != nil {
			revel.AppLog.Errorf("PEmployee.GetEmployees : edbt.ToType, %s\n", err)
			return
		}

		es = append(es, e)
	}

	return
}

// GetEmployeeByID метод получения сотрудника по id
func (p *PEmployee) GetEmployeeByID(id int64) (e *entities.Employee, err error) {
	var (
		edbt *mappers.EmployeeDBType
	)

	// получение данных сотрудника
	edbt, err = p.employeeMapper.SelectByID(id)
	if err != nil {
		revel.AppLog.Errorf("PEmployee.GetEmployeeByID : p.employeeMapper.SelectByID, %s\n", err)
		return
	}

	// преобразование типа бд к типу сущности
	e, err = edbt.ToType()
	if err != nil {
		revel.AppLog.Errorf("PEmployee.GetEmployeeByID : edbt.ToType, %s\n", err)
		return
	}

	return
}

// GetEmployeeByLogin метод получения сотрудника по Login
func (p *PEmployee) GetEmployeeByLogin(login string) (e *entities.Employee, err error) {
	var (
		edbt *mappers.EmployeeDBType
	)

	// получение данных сотрудника
	edbt, err = p.employeeMapper.SelectUserByLogin(login)
	if err != nil {
		revel.AppLog.Errorf("PEmployee.GetEmployeeByLogin : p.employeeMapper.SelectUserByLogin, %s\n", err)
		return
	}

	// преобразование типа бд к типу сущности
	if edbt == nil {
		return
	}
	e, err = edbt.ToType()
	if err != nil {
		revel.AppLog.Errorf("PEmployee.GetEmployeeByLogin : edbt.ToType, %s\n", err)
		return
	}

	return
}

// GetEmployeeTasksByID метод получения всех задач сотрудника по его id
func (p *PEmployee) GetEmployeeTasksByID(id int64) (ts []*entities.Task, err error) {
	var (
		tdbts []*mappers.TaskDBType
		et    *entities.Task
	)

	// получение данных проектов
	tdbts, err = p.employeeTaskMapper.SelectTaskByID(id)
	if err != nil {
		revel.AppLog.Errorf("PEmployee.GetEmployeeTasksByID : p.employeeTaskMapper.SelectTaskByID, %s\n", err)
		return
	}

	for _, tdbt := range tdbts {
		var (
			eadbt *mappers.EmployeeDBType
			eedbt *mappers.EmployeeDBType
			pdbt  *mappers.ProjectDBType
			se    string
			ss    string
		)

		// получение значения создателя по ключу
		eadbt, err = p.employeeMapper.SelectByID(tdbt.Fk_author)
		if err != nil {
			revel.AppLog.Errorf("PEmployee.GetEmployeeTasksByID : p.employeeMapper.SelectByID, %s\n", err)
			return
		}
		// получение значения исполнителя по ключу
		eedbt, err = p.employeeMapper.SelectByID(tdbt.Fk_executor.Int64)
		if err != nil {
			revel.AppLog.Errorf("PEmployee.GetEmployeeTasksByID : p.employeeMapper.SelectByID, %s\n", err)
			return
		}
		// получение значения проекта по ключу
		pdbt, err = p.employeeProjectMapper.SelectByID(tdbt.Fk_projects)
		if err != nil {
			revel.AppLog.Errorf("PEmployee.GetEmployeeTasksByID : p.employeeProjectMapper.SelectByID, %s\n", err)
			return
		}
		// получение значения состояния по ключу
		se, err = p.employeeStateMapper.StateNameByID(tdbt.Fk_states)
		if err != nil {
			revel.AppLog.Errorf("PEmployee.GetEmployeeTasksByID : p.employeeStateMapper.StateNameByID, %s\n", err)
			return
		}
		// получение значения статуса по ключу
		ss, err = p.employeeStatusMapper.StatusNameByID(tdbt.Fk_status)
		if err != nil {
			revel.AppLog.Errorf("PEmployee.GetEmployeeTasksByID : p.employeeStatusMapper.StatusNameByID, %s\n", err)
			return
		}

		// преобразование задачи к типу сущности
		et, err = tdbt.ToType()
		if err != nil {
			revel.AppLog.Errorf("PEmployee.GetEmployeeTasksByID : tdbt.ToType, %s\n", err)
			return
		}

		// преобразование создателя к типу сущности
		et.Author = new(entities.Employee)
		et.Author, err = eadbt.ToType()
		if err != nil {
			revel.AppLog.Errorf("PEmployee.GetEmployeeTasksByID : eadbt.ToType, %s\n", err)
			return
		}
		// преобразование исполнителя к типу сущности
		et.Executor = new(entities.Employee)
		et.Executor, err = eedbt.ToType()
		if err != nil {
			revel.AppLog.Errorf("PEmployee.GetEmployeeTasksByID : eedbt.ToType, %s\n", err)
			return
		}
		// преобразование проекта к типу сущности
		et.Projects = new(entities.Project)
		et.Projects, err = pdbt.ToType()
		if err != nil {
			revel.AppLog.Errorf("PEmployee.GetEmployeeTasksByID : pdbt.ToType, %s\n", err)
			return
		}
		et.States = se
		et.Status = ss

		ts = append(ts, et)
	}

	return
}

// GetProjectByID получние по id сотрудника всех проектов
func (p *PEmployee) GetProjectByID(id int64) (ps []*entities.Project, err error) {
	var (
		pdbts []*mappers.ProjectDBType
		pe     *entities.Project
	)
	// получение данных сотрудников
	pdbts, err = p.employeeMapper.SelectProjectByID(id)
	if err != nil {
		revel.AppLog.Errorf("PEmployee.GetProjectByID : p.employeeMapper.SelectProjectByID, %s\n", err)
		return
	}

	for _, pdbt := range pdbts {
		// преобразование к типу сущности
		pe, err = pdbt.ToType()
		if err != nil {
			revel.AppLog.Errorf("PEmployee.GetProjectByID : pdbt.ToType, %s\n", err)
			return
		}

		ps = append(ps, pe)
	}

	return
}

// GetTeamLeadByID получние по ID создателя(проекта) всех проектов
func (p *PEmployee) GetTeamLeadByID(id int64) (ps []*entities.Project, err error) {
	var (
		pdbts []*mappers.ProjectDBType
		pe     *entities.Project
	)

	// получение данных сотрудников
	pdbts, err = p.employeeMapper.SelectTeamLeadByID(id)
	if err != nil {
		revel.AppLog.Errorf("PEmployee.GetTeamLeadByID : p.employeeMapper.SelectTeamLeadByID, %s\n", err)
		return
	}

	for _, pdbt := range pdbts {
		var edbt *mappers.EmployeeDBType

		// получение значения создателя по ключу
		edbt, err = p.employeeMapper.SelectByID(pdbt.Fk_team_lead)
		if err != nil {
			revel.AppLog.Errorf("PEmployee.GetTeamLeadByID : p.employeeMapper.SelectByID, %s\n", err)
			return
		}

		// преобразование к типу сущности
		pe, err = pdbt.ToType()
		if err != nil {
			revel.AppLog.Errorf("PEmployee.GetTeamLeadByID : pdbt.ToType, %s\n", err)
			return
		}

		// преобразование создателя к типу сущности
		pe.TeamLead = new(entities.Employee)
		pe.TeamLead, err = edbt.ToType()
		if err != nil {
			revel.AppLog.Errorf("PEmployee.GetTeamLeadByID : edbt.ToType, %s\n", err)
			return
		}

		ps = append(ps, pe)
	}

	return
}

// CreateEmployee метод создания сотрудника
func (p *PEmployee) CreateEmployee(employee *entities.Employee) (e *entities.Employee, err error) {
	var (
		edbt *mappers.EmployeeDBType
	)

	employeeSearch, err := p.GetEmployeeByLogin(employee.Login)
	if err != nil {
		revel.AppLog.Errorf("PEmployee.GetEmployeeByLogin : edbt.FromType, %s\n", err)
		return
	}

	if employeeSearch != nil {
		err = errors.New("Пользователь уже существует")
		revel.AppLog.Errorf("PEmployee.GetEmployeeByLogin : edbt.FromType \n", err)
		return nil, err
	}

	// инициализация структур бд из струткур сущности
	edbt, err = edbt.FromType(*employee)
	if err != nil {
		revel.AppLog.Errorf("PEmployee.CreateEmployee : edbt.FromType, %s\n", err)
		return
	}

	edbt.C_password = helpers.GetHash(edbt.C_password)
	employee.Password = edbt.C_password

	// добавление сотрудника
	employee.ID, err = p.employeeMapper.Insert(edbt)
	if err != nil {
		revel.AppLog.Errorf("PEmployee.CreateEmployee : p.employeeMapper.Create, %s\n", err)
		return
	}

	return employee, nil
}

// UpdateEmployee метод обновления сотрудника
func (p *PEmployee) UpdateEmployee(employee *entities.Employee) (e *entities.Employee, err error) {
	var (
		edbt *mappers.EmployeeDBType
		//employeeOld *entities.Employee
	)

	//employeeOld, err = p.GetEmployeeByID(employee.ID)

	// TODO: Проверка всех сущностей на nil (для смены пароля нужен отдельный route)
	/*re := reflect.ValueOf(employee)
	for i:=0; i < re.NumField(); i++ {

	}*/

	// инициализация структуры бд из структуры сущности
	edbt, err = edbt.FromType(*employee)
	if err != nil {
		revel.AppLog.Errorf("PEmployee.UpdateEmployee : edbt.FromType, %s\n", err)
		return
	}

	// обновление сотрудника
	err = p.employeeMapper.Update(edbt)
	if err != nil {
		revel.AppLog.Errorf("PEmployee.UpdateEmployee : p.employeeMapper.Update, %s\n", err)
		return
	}

	return employee, nil
}

// DeleteEmployee метод удаления сотрудника
func (p *PEmployee) DeleteEmployee(id int64) (err error) {
	// удаление сотрудника
	err = p.employeeMapper.Delete(id)
	if err != nil {
		revel.AppLog.Errorf("PEmployee.DeleteEmployee : p.employeeMapper.Delete, %s\n", err)
		return
	}

	return
}
