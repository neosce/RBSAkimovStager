package entities

import "time"

// Employee структура сущности сотрудника
type Employee struct {
	ID         int64      `json:"ID"`         // идентификатор
	Lastname   string     `json:"lastname"`   // фамилия
	Firstname  string     `json:"firstname"`  // имя
	Middlename string     `json:"middlename"` // отчество
	Email      string     `json:"email"`      // почтовый адрес
	Login      string     `json:"login"`      // логин
	Password   string     `json:"password"`   // пароль
	Avatar     string     `json:"avatar"`     // аватар
	Online     bool       `json:"online"`     // онлайн
	LastIn     *time.Time `json:"lastIn"`     // последнее время входа
}
