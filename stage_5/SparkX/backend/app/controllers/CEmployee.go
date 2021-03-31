package controllers

import (
	"backend/app/helpers"
	"backend/app/models/entities"
	"backend/app/models/providers/employee_provider"
	"encoding/json"
	"fmt"
	"github.com/revel/revel"
	"io/ioutil"
)

// CEmployee
type CEmployee struct {
	*revel.Controller
	provider *employee_provider.PEmployee
}

// Init интерцептор контроллера CEmployee
func (c *CEmployee) Init() revel.Result {
	var (
		cache helpers.ICache // экземпляр кэша
		err error // ошибка в ходе выполнения функции
	)

	// инициализация кэша
	cache, err = helpers.GetCache()
	if err != nil {
		revel.AppLog.Errorf("CEmployee.Init : helpers.GetCache, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	// получение токена клиента
	token, err := helpers.GetToken(c.Controller)
	if err != nil {
		revel.AppLog.Errorf("CAuth.Check : helpers.GetToken, %s\n", err)
		return c.Redirect((*CError).Unauthorized)
	}

	// проверка токена
	if isExist := cache.TokenIsActual(token); !isExist {
		return c.Redirect((*CError).Unauthorized)
	}

	// инициализация провайдера
	c.provider = new(employee_provider.PEmployee)
	err = c.provider.Init()
	if err != nil {
		revel.AppLog.Errorf("CEmployee.Init : c.provider.Init, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	return nil
}

// Destroy контроллера CEmployee
func (c *CEmployee) Destroy() {
	c.Controller.Destroy()

	// удаление ссылки на провайдер
	c.provider = nil
}

// ConvertRequestBodyToEmployee метод получения сущности из body
func (c *CEmployee) ConvertRequestBodyToEmployee() (e *entities.Employee, err error) {
	var (
		rawRequest []byte // байтовое представление тела запроса
	)

	// получение тела запроса
	rawRequest, err = ioutil.ReadAll(c.Request.GetBody())
	if err != nil {
		revel.AppLog.Errorf("CEmployee.ConvertRequestBodyToEmployee : ioutil.ReadAll, %s\n", err)
		return
	}

	fmt.Printf("%+v\n", c.Request)

	// преобразование тела запроса в структуру сущности
	err = json.Unmarshal(rawRequest, &e)
	if err != nil {
		revel.AppLog.Errorf("CEmployee.ConvertRequestBodyToEmployee : json.Unmarshal, %s\n", err)
		return
	}

	revel.AppLog.Debugf("CEmployee.ConvertRequestBodyToEmployee, employees: %+v\n", e)

	return
}

// GetAll получение всех сотрудников
func (c *CEmployee) GetAll() revel.Result {
	// получение отрудников
	employees, err := c.provider.GetEmployees()
	if err != nil {
		revel.AppLog.Errorf("CEmployee.GetAll : c.provider.GetEmployees, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}
	revel.AppLog.Debugf("CEmployee.GetAll, employees: %+v\n", employees)

	// рендер положительного результата
	return c.RenderJSON(Success(employees))
}

// GetByID получение сотрудника по id
func (c *CEmployee) GetByID(id int64) revel.Result {
	// получение сотрудника
	employee, err := c.provider.GetEmployeeByID(id)
	if err != nil {
		revel.AppLog.Errorf("CEmployee.GetByID : c.provider.GetEmployeeByID, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	// рендер положительного результата
	return c.RenderJSON(Success(employee))
}

// GetTasks получения всех задач сотрудника по его id
func (c *CEmployee) GetTasks(id int64) revel.Result {
	// получение задач
	tasks, err := c.provider.GetEmployeeTasksByID(id)
	if err != nil {
		revel.AppLog.Errorf("CEmployee.GetTasks : c.provider.GetEmployeeTasksByID, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}
	revel.AppLog.Debugf("CEmployee.GetTasks, tasks: %+v\n", tasks)

	// рендер положительного результата
	return c.RenderJSON(Success(tasks))
}

// GetProjects получение по id сотрудника всех проектов
func (c *CEmployee) GetProjects(id int64) revel.Result {
	// получение проектов
	projects, err := c.provider.GetProjectByID(id)
	if err != nil {
		revel.AppLog.Errorf("CEmployee.GetProjects : c.provider.GetEmployees, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}
	revel.AppLog.Debugf("CEmployee.GetProjects, projects: %+v\n", projects)

	// рендер положительного результата
	return c.RenderJSON(Success(projects))
}

// GetTeamLeadProjects получение по ID создателя(проекта) всех проектов
func (c *CEmployee) GetTeamLeadProjects(id int64) revel.Result {
	// получение проектов
	projects, err := c.provider.GetTeamLeadByID(id)
	if err != nil {
		revel.AppLog.Errorf("CEmployee.GetTeamLeadByID : c.provider.GetTeamLeadByID, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}
	revel.AppLog.Debugf("CEmployee.GetTeamLeadByID, projects: %+v\n", projects)

	// рендер положительного результата
	return c.RenderJSON(Success(projects))
}

// Create создание сотрудника
func (c *CEmployee) Create() revel.Result {
	var (
		employee *entities.Employee // экземпляр сущности для создания
		err      error              // ошибка в ходе выполнения функции
	)

	// формирование сущности для создания
	employee, err = c.ConvertRequestBodyToEmployee()
	if err != nil {
		revel.AppLog.Errorf("CEmployee.Create : c.ConvertRequestBodyToEmployee, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	// создание сущности
	employee, err = c.provider.CreateEmployee(employee)
	if err != nil {
		revel.AppLog.Errorf("CEmployee.Create : c.provider.CreateEmployee, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}
	revel.AppLog.Debugf("CEmployee.Create, employee: %+v\n", employee)

	// рендер положительного результата
	return c.RenderJSON(Success(employee))
}

// UpdateEmployee изменение сотрудника
func (c *CEmployee) Update() revel.Result {
	var (
		employee *entities.Employee // экземпляр сущности для обновления
		err      error              // ошибка в ходе выполнения функции
	)

	// формирование сущности для обновления из post параметров
	employee, err = c.ConvertRequestBodyToEmployee()
	if err != nil {
		revel.AppLog.Errorf("CEmployee.Update : c.ConvertRequestBodyToEmployee, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	// обновление сущности
	employee, err = c.provider.UpdateEmployee(employee)
	if err != nil {
		revel.AppLog.Errorf("CEmployee.Update : c.provider.UpdateEmployee, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}
	revel.AppLog.Debugf("CEmployee.Update, employee: %+v\n", employee)

	// рендер положительного результата
	return c.RenderJSON(Success(employee))
}

// DeleteEmployee удаление сотрудника
func (c *CEmployee) Delete(id int64) revel.Result {
	var (
		employee *entities.Employee // экземпляр сущности для удаления
		err      error              // ошибка в ходе выполнения функции
	)

	// удаление сущности
	err = c.provider.DeleteEmployee(id)
	if err != nil {
		revel.AppLog.Errorf("CEmployee.Delete : c.provider.DeleteEmployee, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}
	revel.AppLog.Debugf("CEmployee.Delete , employee: %+v\n", employee)

	// рендер положительного результата
	return c.RenderJSON(Success(nil))
}
