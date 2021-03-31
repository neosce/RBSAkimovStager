package entities

import "time"

type Project struct {
	ID          int64     `json:"ID"` // идентификатор
	Name        string    `json:"name"`
	Description string    `json:"description"`
	TeamLead    *Employee `json:"teamLead"`
	CreateTime  time.Time `json:"createTime"`
}
