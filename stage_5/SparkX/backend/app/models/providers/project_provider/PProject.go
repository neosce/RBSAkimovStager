package project_provider

import (
	"backend/app/helpers"
	"backend/app/models/entities"
	"backend/app/models/mappers"
	"database/sql"
	"github.com/revel/revel"
)

// PProject провайдер контроллера проектов
type PProject struct {
	projectMapper         *mappers.MProject
	projectEmployeeMapper *mappers.MEmployee
	projectTaskMapper     *mappers.MTask
	projectStateMapper    *mappers.MState
	projectStatusMapper   *mappers.MStatus
}

// Init
func (p *PProject) Init() (err error) {
	var db *sql.DB // экземпляр подключения к бд

	// получение экземпляра подключения к бд
	db, err = helpers.GetDBConnection()
	if err != nil {
		revel.AppLog.Errorf("PProject.Init : helpers.GetDBConnection, %s\n", err)
		return err
	}

	// инициализация маппера проектов
	p.projectMapper = new(mappers.MProject)
	p.projectMapper.Init(db)

	// инициализация маппера сотрудников
	p.projectEmployeeMapper = new(mappers.MEmployee)
	p.projectEmployeeMapper.Init(db)

	// инициализация маппера задач
	p.projectTaskMapper = new(mappers.MTask)
	p.projectTaskMapper.Init(db)

	// инициализация маппера состояний
	p.projectStateMapper = new(mappers.MState)
	p.projectStateMapper.Init(db)

	// инициализация маппера статусов
	p.projectStatusMapper = new(mappers.MStatus)
	p.projectStatusMapper.Init(db)

	return
}

// GetProjects метод получения проектов
func (p *PProject) GetProjects() (ps []*entities.Project, err error) {
	var (
		pdbts []*mappers.ProjectDBType
		ep    *entities.Project
	)

	// получение данных проектов
	pdbts, err = p.projectMapper.SelectAll()
	if err != nil {
		revel.AppLog.Errorf("PProject.GetProjects : p.projectMapper.SelectAll, %s\n", err)
		return
	}

	for _, pdbt := range pdbts {
		var (
			edbt *mappers.EmployeeDBType
		)

		// получение значения сотрудника по ключу
		edbt, err = p.projectEmployeeMapper.SelectByID(pdbt.Fk_team_lead)
		if err != nil {
			revel.AppLog.Errorf("PProject.GetProjects : p.projectEmployeeMapper.SelectByID, %s\n", err)
			return
		}

		// преобразование проекта к типу сущности
		ep, err = pdbt.ToType()
		if err != nil {
			revel.AppLog.Errorf("PProject.GetProjects : pdbt.ToType, %s\n", err)
			return
		}

		// преобразование сотрудника к типу сущности
		ep.TeamLead = new(entities.Employee)
		ep.TeamLead, err = edbt.ToType()
		if err != nil {
			revel.AppLog.Errorf("PProject.GetProjects : edbt.ToType, %s\n", err)
			return
		}

		ps = append(ps, ep)
	}

	return
}

// GetProjectByID метод получения проекта по id
func (p *PProject) GetProjectByID(id int64) (e *entities.Project, err error) {
	var (
		pdbt *mappers.ProjectDBType
		edbt *mappers.EmployeeDBType
	)

	// получение данных проекта
	pdbt, err = p.projectMapper.SelectByID(id)
	if err != nil {
		revel.AppLog.Errorf("PProject.GetProjectByID : p.projectMapper.SelectByID, %s\n", err)
		return
	}

	// получение значения сотрудника по ключу
	edbt, err = p.projectEmployeeMapper.SelectByID(pdbt.Fk_team_lead)
	if err != nil {
		revel.AppLog.Errorf("PProject.GetProjects : p.projectEmployeeMapper.SelectByID, %s\n", err)
		return
	}

	// преобразование типа бд к типу сущности
	e, err = pdbt.ToType()
	if err != nil {
		revel.AppLog.Errorf("PProject.GetProjectByID : pdbt.ToType, %s\n", err)
		return
	}

	// преобразование сотрудника к типу сущности
	e.TeamLead = new(entities.Employee)
	e.TeamLead, err = edbt.ToType()
	if err != nil {
		revel.AppLog.Errorf("PProject.GetProjectByID : edbt.ToType, %s\n", err)
		return
	}

	return
}

// GetProjectByIDTasks метод получения задач по проекту id
func (p *PProject) GetProjectTasksByID(id int64) (ts []*entities.Task, err error) {
	var (
		tdbts []*mappers.TaskDBType
		et    *entities.Task
	)

	// получение данных проектов
	tdbts, err = p.projectTaskMapper.SelectProjectByID(id)
	if err != nil {
		revel.AppLog.Errorf("PProject.GetProjectTasksByID : p.projectTaskMapper.SelectProjectByID, %s\n", err)
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
		eadbt, err = p.projectEmployeeMapper.SelectByID(tdbt.Fk_author)
		if err != nil {
			revel.AppLog.Errorf("PProject.GetProjectTasksByID : p.projectEmployeeMapper.SelectByID, %s\n", err)
			return
		}
		// получение значения исполнителя по ключу
		eedbt, err = p.projectEmployeeMapper.SelectByID(tdbt.Fk_executor.Int64)
		if err != nil {
			revel.AppLog.Errorf("PProject.GetProjectTasksByID : p.projectEmployeeMapper.SelectByID, %s\n", err)
			return
		}
		// получение значения проекта по ключу
		pdbt, err = p.projectMapper.SelectByID(tdbt.Fk_projects)
		if err != nil {
			revel.AppLog.Errorf("PProject.GetProjectTasksByID : p.projectMapper.SelectByID, %s\n", err)
			return
		}
		// получение значения состояния по ключу
		se, err = p.projectStateMapper.StateNameByID(tdbt.Fk_states)
		if err != nil {
			revel.AppLog.Errorf("PProject.GetProjectTasksByID : p.projectStateMapper.StateNameByID, %s\n", err)
			return
		}
		// получение значения статуса по ключу
		ss, err = p.projectStatusMapper.StatusNameByID(tdbt.Fk_status)
		if err != nil {
			revel.AppLog.Errorf("PProject.GetProjectTasksByID : p.projectStatusMapper.StatusNameByID, %s\n", err)
			return
		}

		// преобразование задачи к типу сущности
		et, err = tdbt.ToType()
		if err != nil {
			revel.AppLog.Errorf("PProject.GetProjectTasksByID : tdbt.ToType, %s\n", err)
			return
		}

		// преобразование создателя к типу сущности
		et.Author = new(entities.Employee)
		et.Author, err = eadbt.ToType()
		if err != nil {
			revel.AppLog.Errorf("PProject.GetProjectTasksByID : eadbt.ToType, %s\n", err)
			return
		}
		// преобразование исполнителя к типу сущности
		et.Executor = new(entities.Employee)
		et.Executor, err = eedbt.ToType()
		if err != nil {
			revel.AppLog.Errorf("PProject.GetProjectTasksByID : eedbt.ToType, %s\n", err)
			return
		}
		// преобразование проекта к типу сущности
		et.Projects = new(entities.Project)
		et.Projects, err = pdbt.ToType()
		if err != nil {
			revel.AppLog.Errorf("PProject.GetProjectTasksByID : pdbt.ToType, %s\n", err)
			return
		}
		et.States = se
		et.Status = ss

		ts = append(ts, et)
	}

	return
}

// GetEmployeeByID получние по ID проекта всех сотрудников
func (p *PProject) GetEmployeeByID(id int64) (es []*entities.Employee, err error) {
	var (
		edbts []*mappers.EmployeeDBType
		ep    *entities.Employee
	)

	// получение данных проектов
	edbts, err = p.projectMapper.SelectEmployeeByID(id)
	if err != nil {
		revel.AppLog.Errorf("PProject.GetEmployeeByID : p.projectMapper.SelectEmployeeByID, %s\n", err)
		return
	}

	for _, edbt := range edbts {
		// преобразование проекта к типу сущности
		ep, err = edbt.ToType()
		if err != nil {
			revel.AppLog.Errorf("PProject.GetEmployeeByID : edbt.ToType, %s\n", err)
			return
		}

		es = append(es, ep)
	}

	return
}

// CreateProject метод создания проекта
func (p *PProject) CreateProject(project *entities.Project) (e *entities.Project, err error) {
	var (
		pdbt *mappers.ProjectDBType
	)

	// инициализация структур бд из структур сущности
	pdbt, err = pdbt.FromType(*project)
	if err != nil {
		revel.AppLog.Errorf("PProject.CreateProject : edbt.FromType, %s\n", err)
		return
	}

	// добавление проекта
	project.ID, err = p.projectMapper.Insert(pdbt)
	if err != nil {
		revel.AppLog.Errorf("PProject.CreateProject : p.projectMapper.Create, %s\n", err)
		return
	}

	return project, nil
}

// AttachEmployeeToProject метод добавления сотрудника на проект
func (p *PProject) AttachEmployeeToProject(id int64, employee *entities.Employee) (idUserProject int64, err error) {
	// добавление сотрудника на проект
	idUserProject, err = p.projectMapper.InsertEmployee(id, employee.ID)
	if err != nil {
		revel.AppLog.Errorf("PProject.AttachEmployeeToProject : p.projectMapper.InsertEmployee, %s\n", err)
		return
	}

	return
}

// UpdateProject метод обновления проекта
func (p *PProject) UpdateProject(project *entities.Project) (e *entities.Project, err error) {
	var (
		edbt *mappers.ProjectDBType
	)

	// инициализация структуры бд из структуры сущности
	edbt, err = edbt.FromType(*project)
	if err != nil {
		revel.AppLog.Errorf("PProject.UpdateProject : edbt.FromType, %s\n", err)
		return
	}

	// обновление проекта
	err = p.projectMapper.Update(edbt)
	if err != nil {
		revel.AppLog.Errorf("PProject.UpdateProject : p.projectMapper.Update, %s\n", err)
		return
	}

	return project, nil
}

// DeleteProject метод удаления проекта
func (p *PProject) DeleteProject(id int64) (err error) {
	// удаление проекта
	err = p.projectMapper.Delete(id)
	if err != nil {
		revel.AppLog.Errorf("PProject.DeleteProject : p.projectMapper.Delete, %s\n", err)
		return
	}

	return
}
