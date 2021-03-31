package entities

// Candidate структура сущности сотрудника
type Candidate struct {
	Login    string `json:"login"`    // логин
	Password string `json:"password"` // пароль
}
