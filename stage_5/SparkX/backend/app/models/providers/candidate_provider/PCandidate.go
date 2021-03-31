package candidate_provider

import (
	"backend/app/helpers"
	"backend/app/models/entities"
	"backend/app/models/mappers"
	"database/sql"
	"errors"
	"github.com/revel/revel"
)

// PUser провайдер контроллера пользователей
type PCandidate struct {
	employeeMapper *mappers.MEmployee
}

// Init
func (p *PCandidate) Init() (err error) {
	var db *sql.DB // экземпляр подключения к бд

	// получение экземпляра подключения к бд
	db, err = helpers.GetDBConnection()
	if err != nil {
		revel.AppLog.Errorf("PCandidate.Init : helpers.GetDBConnection, %s\n", err)
		return err
	}

	// инициализация маппера пользователей
	p.employeeMapper = new(mappers.MEmployee)
	p.employeeMapper.Init(db)

	return
}

// Validate метод
func (p *PCandidate) Validate(candidate *entities.Candidate) (flag bool, err error) {
	var (
		edbt *mappers.EmployeeDBType
	)

	// проверка существования пользователя
	edbt, err = p.employeeMapper.SelectUserByLogin(candidate.Login)
	if err != nil {
		revel.AppLog.Errorf("PCandidate.Validate : p.employeeMapper.SelectUserByLogin, %s\n", err)
		return
	}
	if edbt == nil {
		revel.AppLog.Debugf("PCandidate.Validate : p.employeeMapper.SelectUserByLogin, udbt not found\n")
		return false, nil
	}

	// проверка пароля пользователя
	flag = helpers.CompareHash(edbt.C_password, candidate.Password)
	if !flag {
		revel.AppLog.Errorf("PCandidate.Validate : helpers.CompareHash, %s\n", err)
		return
	}

	return
}

// GetEmployee метод
func (p *PCandidate) GetEmployee(candidate *entities.Candidate) (e *entities.Employee, err error) {
	var (
		edbt *mappers.EmployeeDBType
	)

	// проверка существования пользователя
	edbt, err = p.employeeMapper.SelectUserByLogin(candidate.Login)
	if err != nil {
		revel.AppLog.Errorf("PCandidate.AttachEmployee : p.employeeMapper.SelectUserByLogin, %s\n", err)
		return
	}

	// преобразования типа бд к типу сущности
	e, err = edbt.ToType()
	if err != nil {
		revel.AppLog.Errorf("PCandidate.AttachEmployee : p.employeeMapper.SelectByID, %s\n", err)
		return
	}

	return
}

// CreateEmployee метод создания сотрудника
func (p *PCandidate) CreateEmployee(employee *entities.Employee) (e *entities.Employee, err error) {
	var (
		edbt *mappers.EmployeeDBType
	)

	employeeSearch, err := p.employeeMapper.SelectUserByLogin(employee.Login)
	if err != nil {
		revel.AppLog.Errorf("PEmployee.GetEmployeeByLogin : edbt.FromType, %s\n", err)
		return
	}

	revel.AppLog.Infof("EEEEEEEMPLOYEEEEEEE\n", employeeSearch)

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
