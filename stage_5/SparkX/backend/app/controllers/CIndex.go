package controllers

import "github.com/revel/revel"

type CIndex struct {
	*revel.Controller
}

// Init интерцептор контроллера CIndex
func (c CIndex) Init() revel.Result {
	return nil
}

// Возвращает HTML страницу
func (c CIndex) Index() revel.Result {
	return c.Render()
}