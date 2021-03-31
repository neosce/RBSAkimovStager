package mappers

import (
	"backend/app/models/entities"
	"database/sql"
	"github.com/revel/revel"
)

type StateDBType struct {
	Pk_id int64 // идентификатор
	C_name string // название состояния
}

// MState маппер состояний задач
type MState struct {
	db *sql.DB
}

// Init
func (m *MState) Init(db *sql.DB) {
	m.db = db
}

// ToType функция преобразования типа бд к типу сущности
func (dbt *StateDBType) ToType() (s *entities.State, err error) {
	s = new(entities.State)

	s.ID = dbt.Pk_id
	s.Name = dbt.C_name

	return
}

// FromType функция преобразования типа бд из типа сущности
func (_ *StateDBType) FromType(s *entities.State) (dbt *StateDBType, err error) {
	dbt = &StateDBType{
		Pk_id:  s.ID,
		C_name: s.Name,
	}

	return
}

// SelectAll получение всех состояний
func (m *MState) SelectAll() (sdbts []*StateDBType, err error) {
	var (
		query string    // строка запроса
		rows  *sql.Rows // выборка данных
	)

	// запрос
	query = `
		SELECT
			pk_id,
			c_name
		FROM "manager".ref_states
		ORDER BY pk_id;	
	`

	// выполнение запроса
	rows, err = m.db.Query(query)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MState.SelectAll : m.db.query, %s\n", err)
		return
	}

	// обработка строк выборки
	for rows.Next() {
		// создание экземпляра сущности для считывания строки выборки
		sdbt := new(StateDBType)

		// считывание строки выборки
		err = rows.Scan(&sdbt.Pk_id, &sdbt.C_name)
		if err != nil {
			revel.AppLog.Errorf("MState.SelectAll : rows.Scan, %s\n", err)
			continue
		}

		// добавление сущности в массив
		sdbts = append(sdbts, sdbt)
	}

	return
}

// StateNameByID получение состояния по id
func (m *MState) StateNameByID(id int64) (stateName string, err error) {
	var (
		query string   // строка запроса
		row   *sql.Row // выборка данных
	)

	// запрос
	query = `
		SELECT
			c_name
		FROM "manager".ref_states
		WHERE pk_id = $1
		ORDER BY pk_id;
	`

	// выполнение запроса
	row = m.db.QueryRow(query, id)

	// считывание строки выборки
	err = row.Scan(&stateName)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MState.StateNameByID : row.Scan, %s\n", err)
		return
	}

	return
}

// IDByStateName получение id по состоянию
func (m *MState) IDByStateName(stateName string) (id int64, err error) {
	var (
		query string   // строка запроса
		row   *sql.Row // выборка данных
	)

	// запрос
	query = `
		SELECT
			pk_id
		FROM "manager".ref_states
		WHERE c_name = $1
		ORDER BY pk_id;
	`

	// выполнение запроса
	row = m.db.QueryRow(query, stateName)

	// считывание строки выборки
	err = row.Scan(&id)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MState.IDByStateName : row.Scan, %s\n", err)
		return
	}

	return
}
