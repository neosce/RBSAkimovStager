package controllers

import (
	"backend/app/helpers"
	"backend/app/models/entities"
	"backend/app/models/providers/candidate_provider"
	"encoding/json"
	"fmt"
	"github.com/revel/revel"
	"io/ioutil"
	"net/http"
)

// CAuth
type CAuth struct {
	*revel.Controller
	provider *candidate_provider.PCandidate
	cache    helpers.ICache
}

// Init интерцептор контроллера CAuth
func (c *CAuth) Init() revel.Result {
	var (
		err error // ошибка в ходе выполнения функции
	)

	// инициализация провайдера
	c.provider = new(candidate_provider.PCandidate)
	err = c.provider.Init()
	if err != nil {
		revel.AppLog.Errorf("CAuth.Init : c.provider.Init, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	// инициализация кэша
	c.cache, err = helpers.GetCache()
	if err != nil {
		revel.AppLog.Errorf("CAuth.Init : helpers.GetCache, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	return nil
}

// Destroy контроллера CAuth
func (c *CAuth) Destroy() {
	c.Controller.Destroy()

	// удаление ссылки на провайдер
	c.provider = nil
}

// ConvertRequestBodyToCandidate метод получения сущности из post параметров
func (c *CAuth) ConvertRequestBodyToCandidate() (ce *entities.Candidate, err error) {
	var (
		rawRequest []byte // байтовое представление тела запроса
	)

	// получение тела запроса
	rawRequest, err = ioutil.ReadAll(c.Request.GetBody())
	if err != nil {
		revel.AppLog.Errorf("CAuth.ConvertRequestBodyToCandidate : ioutil.ReadAll, %s\n", err)
		return
	}

	// преобразование тела запроса в структуру сущности
	err = json.Unmarshal(rawRequest, &ce)
	if err != nil {
		revel.AppLog.Errorf("CAuth.ConvertRequestBodyToCandidate : json.Unmarshal, %s\n", err)
		return
	}

	return
}

// ConvertRequestBodyToEmployee метод получения сущности из body
func (c *CAuth) ConvertRequestBodyToEmployee() (e *entities.Employee, err error) {
	var (
		rawRequest []byte // байтовое представление тела запроса
	)

	// получение тела запроса
	rawRequest, err = ioutil.ReadAll(c.Request.GetBody())
	if err != nil {
		revel.AppLog.Errorf("CAuth.ConvertRequestBodyToEmployee : ioutil.ReadAll, %s\n", err)
		return
	}

	fmt.Printf("%+v\n", c.Request)

	// преобразование тела запроса в структуру сущности
	err = json.Unmarshal(rawRequest, &e)
	if err != nil {
		revel.AppLog.Errorf("CAuth.ConvertRequestBodyToEmployee : json.Unmarshal, %s\n", err)
		return
	}

	revel.AppLog.Debugf("CAuth.ConvertRequestBodyToEmployee, employees: %+v\n", e)

	return
}

// Login авторизация пользователя
func (c *CAuth) Login() revel.Result {
	var (
		ce      *entities.Candidate
		e		*entities.Employee
		isValid bool
		err     error
	)

	// получение кандидата из post параметров
	ce, err = c.ConvertRequestBodyToCandidate()
	if err != nil {
		return c.RenderJSON(Failed(err.Error()))
	}

	// валиадция пользователя
	isValid, err = c.provider.Validate(ce)
	if err != nil {
		revel.AppLog.Errorf("CAuth.Login : c.provider.Validate, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	// получение сотрудника
	e, err = c.provider.GetEmployee(ce)
	if err != nil {
		return c.RenderJSON(Failed(err.Error()))
	}

	if isValid {
		// создание токена
		token, err := helpers.GenerateToken()
		if err != nil {
			revel.AppLog.Errorf("CAuth.Login : helpers.GenerateToken, %s\n", err)
			return c.RenderJSON(Failed(err.Error()))
		}

		// установка токена в cache сервера
		err = c.cache.Set(token, e)
		if err != nil {
			revel.AppLog.Errorf("CAuth.Login : c.cache.Set, %s\n", err)
			return c.RenderJSON(Failed(err.Error()))
		}

		// установка токена в cookies клиента
		c.SetCookie(&http.Cookie{Name: "auth-token", Value: token, Domain: c.Request.Host, Path: "/"})
	} else {
		return c.RenderJSON(Success("Пользователь не прошел валидацию"))
	}

	return c.RenderJSON(Success(true))
}

// Logout
func (c *CAuth) Logout() revel.Result {
	// получение токена клиента
	token, err := helpers.GetToken(c.Controller)
	if err != nil {
		revel.AppLog.Errorf("CAuth.Check : helpers.GetToken, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	// удаление токена
	err = c.cache.Delete(token)
	if err != nil {
		revel.AppLog.Errorf("CAuth.Logout : c.cache.Delete, %s\n", err)
	}

	return c.Redirect((*CIndex).Index)
}

// Check проверка авторизован ли пользователь
func (c *CAuth) Check() revel.Result {
	// получение токена клиента
	token, err := helpers.GetToken(c.Controller)
	if err != nil {
		revel.AppLog.Errorf("CAuth.Check : helpers.GetToken, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	// проверка токена
	if isExist := c.cache.TokenIsActual(token); !isExist {
		return c.RenderJSON(Success(false))
	}

	return c.RenderJSON(Success(true))
}

// GetCurrentEmployee
func (c *CAuth) GetCurrentEmployee() revel.Result {
	// получение токена клиента
	token, err := helpers.GetToken(c.Controller)
	if err != nil {
		revel.AppLog.Errorf("CAuth.Check : helpers.GetToken, %s\n", err)
		return c.Redirect((*CError).Unauthorized)
	}

	// проверка токена
	if isExist := c.cache.TokenIsActual(token); !isExist {
		return c.Redirect((*CError).Unauthorized)
	}

	// получение токена сервера для пользователя
	e, err := c.cache.Get(token)
	if err != nil {
		revel.AppLog.Errorf("CAuth.Check : c.cache.Get, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	return c.RenderJSON(Success(e))
}

// Registration
func (c *CAuth) Registration() revel.Result {
	var (
		employee *entities.Employee // экземпляр сущности для создания
		err      error              // ошибка в ходе выполнения функции
	)

	// формирование сущности для создания
	employee, err = c.ConvertRequestBodyToEmployee()
	if err != nil {
		revel.AppLog.Errorf("CAuth.Create : c.ConvertRequestBodyToEmployee, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	// создание сущности
	employee, err = c.provider.CreateEmployee(employee)
	if err != nil {
		revel.AppLog.Errorf("CAuth.Create : c.provider.CreateEmployee, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}
	revel.AppLog.Debugf("CAuth.Create, employee: %+v\n", employee)

	// рендер положительного результата
	return c.RenderJSON(Success(employee))
}
