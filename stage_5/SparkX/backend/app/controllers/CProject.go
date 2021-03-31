package controllers

import (
	"backend/app/helpers"
	"backend/app/models/entities"
	"backend/app/models/providers/project_provider"
	"encoding/json"
	"fmt"
	"github.com/revel/revel"
	"io/ioutil"
)

// CProject
type CProject struct {
	*revel.Controller
	provider *project_provider.PProject
}

// Init интерцептор контроллера CProject
func (c *CProject) Init() revel.Result {
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
	c.provider = new(project_provider.PProject)
	err = c.provider.Init()
	if err != nil {
		revel.AppLog.Errorf("CProject.Init : c.provider.Init, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	return nil
}

// Destroy контроллера CProject
func (c *CProject) Destroy() {
	c.Controller.Destroy()

	// удаление ссылки на провайдер
	c.provider = nil
}

// ConvertRequestBodyToProject метод получения сущности body
func (c *CProject) ConvertRequestBodyToProject() (e *entities.Project, err error) {
	var (
		rawRequest []byte // байтовое представление тела запроса
	)

	// получение тела запроса
	rawRequest, err = ioutil.ReadAll(c.Request.GetBody())
	if err != nil {
		revel.AppLog.Errorf("CProject.ConvertRequestBodyToProject : ioutil.ReadAll, %s\n", err)
		return
	}

	fmt.Printf("%+v\n", c.Request)

	// преобразование тела запроса в структуру сущности
	err = json.Unmarshal(rawRequest, &e)
	if err != nil {
		revel.AppLog.Errorf("CProject.ConvertRequestBodyToProject : json.Unmarshal, %s\n", err)
		return
	}

	revel.AppLog.Debugf("CProject.ConvertRequestBodyToProject, projects: %+v\n", e)

	return
}

// ConvertRequestBodyToEmployee метод получения сущности из body
func (c *CProject) ConvertRequestBodyToEmployee() (e *entities.Employee, err error) {
	var (
		rawRequest []byte // байтовое представление тела запроса
	)

	// получение тела запроса
	rawRequest, err = ioutil.ReadAll(c.Request.GetBody())
	if err != nil {
		revel.AppLog.Errorf("CProject.ConvertRequestBodyToEmployee : ioutil.ReadAll, %s\n", err)
		return
	}

	fmt.Printf("%+v\n", c.Request)

	// преобразование тела запроса в структуру сущности
	err = json.Unmarshal(rawRequest, &e)
	if err != nil {
		revel.AppLog.Errorf("CProject.ConvertRequestBodyToEmployee : json.Unmarshal, %s\n", err)
		return
	}

	revel.AppLog.Debugf("CProject.ConvertRequestBodyToEmployee, employees: %+v\n", e)

	return
}

// GetAll получение всех проектов
func (c *CProject) GetAll() revel.Result {
	// получение проектов
	projects, err := c.provider.GetProjects()
	if err != nil {
		revel.AppLog.Errorf("CProject.GetAll : c.provider.GetProjects, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}
	revel.AppLog.Debugf("CProject.GetAll, projects: %+v\n", projects)

	// рендер положительного результата
	return c.RenderJSON(Success(projects))
}

// GetByID получение проекта по id
func (c *CProject) GetByID(id int64) revel.Result {
	// получение проекта
	project, err := c.provider.GetProjectByID(id)
	if err != nil {
		revel.AppLog.Errorf("CProject.GetByID : c.provider.GetProjectByID, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	// рендер положительного результата
	return c.RenderJSON(Success(project))
}

// GetTasks получение задач по проекту id
func (c *CProject) GetTasks(id int64) revel.Result {
	// получение задач
	tasks, err := c.provider.GetProjectTasksByID(id)
	if err != nil {
		revel.AppLog.Errorf("CProject.GetTasks : c.provider.GetProjectTasksByID, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}
	revel.AppLog.Debugf("CProject.GetTasks, tasks: %+v\n", tasks)

	// рендер положительного результата
	return c.RenderJSON(Success(tasks))
}

// GetEmployees получние по ID проекта всех сотрудников
func (c *CProject) GetEmployees(id int64) revel.Result {
	// получение сотрудников
	tasks, err := c.provider.GetEmployeeByID(id)
	if err != nil {
		revel.AppLog.Errorf("CProject.GetEmployees : c.provider.GetEmployeeByID, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}
	revel.AppLog.Debugf("CProject.GetEmployees, tasks: %+v\n", tasks)

	// рендер положительного результата
	return c.RenderJSON(Success(tasks))
}

// Create создание проекта
func (c *CProject) Create() revel.Result {
	var (
		project *entities.Project // экземпляр сущности для создания
		err     error             // ошибка в ходе выполнения функции
	)

	// формирование сущности для создания из body
	project, err = c.ConvertRequestBodyToProject()
	if err != nil {
		revel.AppLog.Errorf("CProject.Create : c.ConvertRequestBodyToProject, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	// создание сущности
	project, err = c.provider.CreateProject(project)
	if err != nil {
		revel.AppLog.Errorf("CProject.Create : c.provider.CreateProject, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}
	revel.AppLog.Debugf("CProject.Create, project: %+v\n", project)

	// рендер положительного результата
	return c.RenderJSON(Success(project))
}

// AttachEmployee метод добавления сотрудника на проект
func (c *CProject) AttachEmployee(id int64) revel.Result {
	var (
		employee *entities.Employee // экземпляр сущности для создания
		idbd     int64              // ключ записи в базе
		err      error              // ошибка в ходе выполнения функции
	)

	// формирование сущности для создания
	employee, err = c.ConvertRequestBodyToEmployee()
	if err != nil {
		revel.AppLog.Errorf("CEmployee.AttachEmployee : c.ConvertRequestBodyToEmployee, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	// добавление записи
	idbd, err = c.provider.AttachEmployeeToProject(id, employee)
	if err != nil {
		revel.AppLog.Errorf("CEmployee.AttachEmployee : c.provider.AttachEmployeeToProject, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}
	revel.AppLog.Debugf("CEmployee.AttachEmployee, users-employees: %+v\n", idbd)

	// рендер положительного результата
	return c.RenderJSON(Success(idbd))
}

// Update изменение проекта
func (c *CProject) Update() revel.Result {
	var (
		project *entities.Project // экземпляр сущности для обновления
		err     error             // ошибка в ходе выполнения функции
	)

	// формирование сущности для обновления из post параметров
	project, err = c.ConvertRequestBodyToProject()
	if err != nil {
		revel.AppLog.Errorf("CProject.Update : c.ConvertRequestBodyToProject, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	// обновление сущности
	project, err = c.provider.UpdateProject(project)
	if err != nil {
		revel.AppLog.Errorf("CProject.Update : c.provider.UpdateEmployee, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}
	revel.AppLog.Debugf("CProject.Update, project: %+v\n", project)

	// рендер положительного результата
	return c.RenderJSON(Success(project))
}

// Delete удаление проекта
func (c *CProject) Delete(id int64) revel.Result {
	var (
		project *entities.Project // экземпляр сущности для удаления
		err     error             // ошибка в ходе выполнения функции
	)

	// удаление сущности
	err = c.provider.DeleteProject(id)
	if err != nil {
		revel.AppLog.Errorf("CProject.Delete : c.provider.DeleteProject, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}
	revel.AppLog.Debugf("CProject.Delete , project: %+v\n", project)

	// рендер положительного результата
	return c.RenderJSON(Success(nil))
}
