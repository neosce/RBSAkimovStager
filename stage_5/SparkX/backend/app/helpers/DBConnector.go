package helpers

import (
	"database/sql"
	"errors"
	"fmt"
	_ "github.com/lib/pq"
	"github.com/revel/revel"
)

var (
	ErrFailedConnection error = errors.New("не удалось установить соединение с базой")
	db *sql.DB = nil // экземпляр соединения с базой
)

// GetDBConnection получение экземпляра подключения к БД
func GetDBConnection() (*sql.DB, error){
	// проверка инициализации экземпляра подключения к бд
	if db == nil {
		var (
			dbspec   string // строка подключения к бд
			user     string // имя пользователя субд
			password string // пароль пользователя субд
			ok       bool   // флаг успешности получения настройки
			err      error
		)

		// получение строки подключения из config
		if dbspec, ok = revel.Config.String("db.spec"); !ok {
			err = ErrFailedConnection
			revel.AppLog.Errorf("Не удалось получить строку подключения к бд из файла конфигурации: %v\n", err)
			return nil, err
		}

		// получение пользователя бд из config
		if user, ok = revel.Config.String("db.user"); !ok {
			err = ErrFailedConnection
			revel.AppLog.Errorf("Не удалось получить пользователя из файла конфигурации: %v\n", err)
			return nil, err
		}

		// получение пароля пользователя бд из config
		if password, ok = revel.Config.String("db.password"); !ok {
			err = ErrFailedConnection
			revel.AppLog.Errorf("Не удалось получить пароль из файла конфигурации: %v\n", err)
			return nil, err
		}

		// формирование строки подключения к базе
		connStr := fmt.Sprintf("postgres://%s:%s@%s", user, password, dbspec)
		revel.AppLog.Debugf("postgres://%s:%s@%s", user, password, dbspec)
		// создание соединения бд
		db, err = sql.Open("postgres", connStr)
		if err != nil {
			revel.AppLog.Errorf("Не удалось установить соединение с базой данных: %v\n", err)
			return nil, err
		}

		// проверка соединения
		err = db.Ping()
		if err != nil {
			revel.AppLog.Errorf("Не удалось выполнить тестовое подключение: %v\n", err)
			return nil, err
		}
	}

	return db, nil
}
