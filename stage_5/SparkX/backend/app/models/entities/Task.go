package entities

import "time"

type Task struct {
	ID          int64     `json:"ID"`          // идентификатор
	Author      *Employee `json:"author"`      // Создатель задачи
	Executor    *Employee `json:"executor"`    // Исполнитель задачи
	Projects    *Project  `json:"project"`     // Проект к которому принадлежит задача
	States      string    `json:"states"`      // Состояние задачи
	Status      string    `json:"status"`      // Статус задачи
	Name        string    `json:"name"`        // Название задачи
	Description string    `json:"description"` // Описание задачи
	PlanHour    int64     `json:"planHour"`    // Планируемые часы на задачу
	ActualHour  int64     `json:"actualHour"`  // Актуальное время потраченное на задачу
	CreateTime  time.Time `json:"createTime"`  // Время создания задачи
}
