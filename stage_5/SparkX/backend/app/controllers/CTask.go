package controllers

import (
	"backend/app/helpers"
	"backend/app/models/entities"
	"backend/app/models/providers/task_provider"
	"encoding/json"
	"fmt"
	"github.com/revel/revel"
	"io/ioutil"
)

// CTask
type CTask struct {
	*revel.Controller
	provider *task_provider.PTask
}

// Init интерцептор контроллера CProject
func (c *CTask) Init() revel.Result {
	var (
		cache helpers.ICache
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
	c.provider = new(task_provider.PTask)
	err = c.provider.Init()
	if err != nil {
		revel.AppLog.Errorf("CProject.Init : c.provider.Init, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	return nil
}

// Destroy контроллера CTask
func (c *CTask) Destroy() {
	c.Controller.Destroy()

	// удаление ссылки на провайдер
	c.provider = nil
}

// ConvertRequestBodyToTask метод получения сущности body
func (c *CTask) ConvertRequestBodyToTask() (e *entities.Task, err error) {
	var (
		rawRequest []byte // байтовое представление тела запроса
	)

	// получение тела запроса
	rawRequest, err = ioutil.ReadAll(c.Request.GetBody())
	if err != nil {
		revel.AppLog.Errorf("CTask.ConvertRequestBodyToTask : ioutil.ReadAll, %s\n", err)
		return
	}

	fmt.Printf("%+v\n", c.Request)

	// преобразование тела запроса в структуру сущности
	err = json.Unmarshal(rawRequest, &e)
	if err != nil {
		revel.AppLog.Errorf("CTask.ConvertRequestBodyToTask : json.Unmarshal, %s\n", err)
		return
	}

	revel.AppLog.Debugf("CTask.ConvertRequestBodyToTask, task: %+v\n", e)

	return
}

// GetAll получение всех задач
func (c *CTask) GetAll() revel.Result {
	// получение задач
	tasks, err := c.provider.GetTasks()
	if err != nil {
		revel.AppLog.Errorf("CTask.GetAll : c.provider.GetTasks, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}
	revel.AppLog.Debugf("CTask.GetAll, tasks: %+v\n", tasks)

	// рендер положительного результата
	return c.RenderJSON(Success(tasks))
}

// GetByID получение задачи по id
func (c *CTask) GetByID(id int64) revel.Result {
	// получение задачи
	task, err := c.provider.GetTaskByID(id)
	if err != nil {
		revel.AppLog.Errorf("CTask.GetByID : c.provider.GetTaskByID, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	// рендер положительного результата
	return c.RenderJSON(Success(task))
}

// Create создание задачи
func (c *CTask) Create() revel.Result {
	var (
		task *entities.Task // экземпляр сущности для создания
		err  error          // ошибка в ходе выполнения функции
	)

	// формирование сущности для создания из body
	task, err = c.ConvertRequestBodyToTask()
	if err != nil {
		revel.AppLog.Errorf("CProject.Create : c.ConvertRequestBodyToProject, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	// создание сущности
	task, err = c.provider.CreateTask(task)
	if err != nil {
		revel.AppLog.Errorf("CProject.Create : c.provider.CreateProject, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}
	revel.AppLog.Debugf("CProject.Create, project: %+v\n", task)

	// рендер положительного результата
	return c.RenderJSON(Success(task))
}

// Update изменение задачи
func (c *CTask) Update() revel.Result {
	var (
		task *entities.Task // экземпляр сущности для обновления
		err  error          // ошибка в ходе выполнения функции
	)

	// формирование сущности для обновления из post параметров
	task, err = c.ConvertRequestBodyToTask()
	if err != nil {
		revel.AppLog.Errorf("CTask.Update : c.ConvertRequestBodyToTask, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	// обновление сущности
	task, err = c.provider.UpdateTask(task)
	if err != nil {
		revel.AppLog.Errorf("CTask.Update : c.provider.UpdateTask, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}
	revel.AppLog.Debugf("CTask.Update, task: %+v\n", task)

	// рендер положительного результата
	return c.RenderJSON(Success(task))
}

// Delete удаление задачи
func (c *CTask) Delete(id int64) revel.Result {
	var (
		task *entities.Task // экземпляр сущности для удаления
		err  error          // ошибка в ходе выполнения функции
	)

	// удаление сущности
	err = c.provider.DeleteTask(id)
	if err != nil {
		revel.AppLog.Errorf("CTask.Delete : c.provider.DeleteTask, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}
	revel.AppLog.Debugf("CTask.Delete , task: %+v\n", task)

	// рендер положительного результата
	return c.RenderJSON(Success(nil))
}
