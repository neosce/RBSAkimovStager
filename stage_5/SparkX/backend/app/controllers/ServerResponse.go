package controllers

import "github.com/revel/revel"

// перечисление статусов ответа сервера
const (
	RESPONSE_STATUS_SUCCESS ResponseStatus = "success"
	RESPONSE_STATUS_FAILED  ResponseStatus = "failed"
)

type ResponseStatus string

type ServerResponse struct {
	Status       ResponseStatus `json:"status"`
	ErrorMessage string         `json:"error"`
	Data         interface{}    `json:"data"`
}

// Success получение структуры ответа при успешном запросе
func Success(data interface{}) (res ServerResponse) {
	res.Status = RESPONSE_STATUS_SUCCESS
	res.Data = data

	revel.AppLog.Debugf("Success, response: %+v\n", res)
	revel.AppLog.Debugf("Success, data: %+v\n", data)

	return res
}

// Failed получение структуры ответа при неудачном запросе
func Failed(err string) (res ServerResponse) {
	res.Status = RESPONSE_STATUS_FAILED
	res.ErrorMessage = err

	revel.AppLog.Debugf("Success, response: %+v\n", res)
	revel.AppLog.Debugf("Success, data: %+v\n", err)

	return res
}
