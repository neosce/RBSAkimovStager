package mappers

import (
	"backend/app/models/entities"
	"database/sql"
	"github.com/revel/revel"
)

type StatusDBType struct {
	Pk_id int64 // идентификатор
	C_name string // название статуса
}

// MStatus маппер статусов
type MStatus struct {
	db *sql.DB
}

// Init
func (m *MStatus) Init(db *sql.DB) {
	m.db = db
}

// ToType функция преобразования типа бд к типу сущности
func (dbt *StatusDBType) ToType() (s *entities.Status, err error) {
	s = new(entities.Status)

	s.ID = dbt.Pk_id
	s.Name = dbt.C_name

	return
}

// FromType функция преобразования типа бд из типа сущности
func (_ *StatusDBType) FromType(s *entities.Status) (dbt *StatusDBType, err error) {
	dbt = &StatusDBType{
		Pk_id:  s.ID,
		C_name: s.Name,
	}

	return
}

// SelectAll получение всех статусов
func (m *MStatus) SelectAll() (sdbts []*StatusDBType, err error) {
	var (
		query string    // строка запроса
		rows  *sql.Rows // выборка данных
	)

	// запрос
	query = `
		SELECT
			pk_id,
			c_name
		FROM "manager".ref_statuses
		ORDER BY pk_id;	
	`

	// выполнение запроса
	rows, err = m.db.Query(query)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MStatus.SelectAll : m.db.query, %s\n", err)
		return
	}

	// обработка строк выборки
	for rows.Next() {
		// создание экземпляра сущности для считывания строки выборки
		sdbt := new(StatusDBType)

		// считывание строки выборки
		err = rows.Scan(&sdbt.Pk_id, &sdbt.C_name)
		if err != nil {
			revel.AppLog.Errorf("MStatus.SelectAll : rows.Scan, %s\n", err)
			continue
		}

		// добавление сущности в массив
		sdbts = append(sdbts, sdbt)
	}

	return
}

// StatusNameByID получение статуса по id
func (m *MStatus) StatusNameByID(id int64) (statusName string, err error) {
	var (
		query string   // строка запроса
		row   *sql.Row // выборка данных
	)

	// запрос
	query = `
		SELECT
			c_name
		FROM "manager".ref_statuses
		WHERE pk_id = $1
		ORDER BY pk_id;
	`

	// выполнение запроса
	row = m.db.QueryRow(query, id)

	// считывание строки выборки
	err = row.Scan(&statusName)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MStatus.StatusNameByID : row.Scan, %s\n", err)
		return
	}

	return
}

// IDByStatusName получение id по статусу
func (m *MStatus) IDByStatusName(statusName string) (id int64, err error) {
	var (
		query string   // строка запроса
		row   *sql.Row // выборка данных
	)

	// запрос
	query = `
		SELECT
			pk_id
		FROM "manager".ref_statuses
		WHERE c_name = $1
		ORDER BY pk_id;
	`

	// выполнение запроса
	row = m.db.QueryRow(query, statusName)

	// считывание строки выборки
	err = row.Scan(&id)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MStatus.IDByStatusName : row.Scan, %s\n", err)
		return
	}

	return
}
