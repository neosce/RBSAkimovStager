package mappers

import (
	"backend/app/models/entities"
	"database/sql"
	"github.com/revel/revel"
	"time"
)

// TaskDBType тип сущности "Задача" бд
type TaskDBType struct {
	Pk_id         int64
	Fk_projects   int64
	Fk_author     int64
	Fk_executor   sql.NullInt64
	Fk_states     int64
	Fk_status     int64
	C_name        string
	C_description string
	C_plain_hour  int64
	C_actual_hour int64
	C_create_time time.Time
}

// ToType функция преобразования типа бд к типу сущности
func (dbt *TaskDBType) ToType() (t *entities.Task, err error) {
	t = new(entities.Task)

	t.ID = dbt.Pk_id
	t.Name = dbt.C_name
	t.Description = dbt.C_description
	t.PlanHour = dbt.C_plain_hour
	t.ActualHour = dbt.C_actual_hour
	t.CreateTime = dbt.C_create_time

	return
}

// FromType функция преобразования типа сущности к типу бд допускается, что dbt is nil
func (_ *TaskDBType) FromType(t entities.Task) (dbt *TaskDBType, err error) {
	dbt = &TaskDBType{
		Pk_id:         t.ID,
		Fk_author:     t.Author.ID,
		Fk_projects:   t.Projects.ID,
		C_name:        t.Name,
		C_description: t.Description,
		C_plain_hour:  t.PlanHour,
		C_actual_hour: t.ActualHour,
		C_create_time: t.CreateTime,
	}

	return
}

// MTask маппер задач
type MTask struct {
	db *sql.DB
}

// Init
func (m *MTask) Init(db *sql.DB) {
	m.db = db
}

// SelectAll получение всех задач
func (m *MTask) SelectAll() (ts []*TaskDBType, err error) {
	var (
		query string    // строка запроса
		rows  *sql.Rows // выборка данных
	)

	// запрос
	query = `
		SELECT 
			pk_id,
			fk_author,
			fk_executor,
			fk_projects,
			fk_states,
			fk_status,
			c_name,
			c_actual_hour,
			c_create_time,
			c_description,
			c_plan_hour
		FROM "manager".t_tasks
		ORDER BY pk_id;
	`

	// выполнение запроса
	rows, err = m.db.Query(query)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MTask.SelectAll : m.db.query, %s\n", err)
		return
	}

	// обработка строк выборки
	for rows.Next() {
		// создание экземпляра сущности для считывания строки выборки
		t := new(TaskDBType)

		// считывание строки выборки
		err = rows.Scan(
			&t.Pk_id,
			&t.Fk_author,
			&t.Fk_executor,
			&t.Fk_projects,
			&t.Fk_states,
			&t.Fk_status,
			&t.C_name,
			&t.C_actual_hour,
			&t.C_create_time,
			&t.C_description,
			&t.C_plain_hour)
		if err != nil {
			revel.AppLog.Errorf("MTask.SelectAll : rows.Scan, %s\n", err)
			continue
		}

		// добавление сущности в массив
		ts = append(ts, t)
	}

	return
}

// SelectByID получение задач по ID
func (m *MTask) SelectByID(id int64) (t *TaskDBType, err error) {
	var (
		query string   // строка запроса
		row   *sql.Row // выборка данных
	)

	t = new(TaskDBType)

	// запрос
	query = `
		SELECT 
			pk_id,
			fk_author,
			fk_executor,
			fk_projects,
			fk_states,
			fk_status,
			c_name,
			c_actual_hour,
			c_create_time,
			c_description,
			c_plan_hour
		FROM "manager".t_tasks
		WHERE pk_id = $1
		ORDER BY pk_id;
	`

	// выполнение запроса
	row = m.db.QueryRow(query, id)

	// считывание строки выборки
	err = row.Scan(
		&t.Pk_id,
		&t.Fk_author,
		&t.Fk_executor,
		&t.Fk_projects,
		&t.Fk_states,
		&t.Fk_status,
		&t.C_name,
		&t.C_actual_hour,
		&t.C_create_time,
		&t.C_description,
		&t.C_plain_hour)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MTask.SelectByID : row.Scan, %s\n", err)
		return
	}

	return
}

// SelectProjectByID получение задач по проекту ID
func (m *MTask) SelectProjectByID(id int64) (ts []*TaskDBType, err error) {
	var (
		query string    // строка запроса
		rows  *sql.Rows // выборка данных
	)

	// запрос
	query = `
		SELECT 
			pk_id,
			fk_author,
			fk_executor,
			fk_projects,
			fk_states,
			fk_status,
			c_name,
			c_actual_hour,
			c_create_time,
			c_description,
			c_plan_hour
		FROM "manager".t_tasks
		WHERE fk_projects = $1
		ORDER BY pk_id;
	`

	// выполнение запроса
	rows, err = m.db.Query(query, id)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MTask.SelectProjectByID : m.db.query, %s\n", err)
		return
	}

	// обработка строк выборки
	for rows.Next() {
		// создание экземпляра сущности для считывания строки выборки
		t := new(TaskDBType)

		// считывание строки выборки
		err = rows.Scan(
			&t.Pk_id,
			&t.Fk_author,
			&t.Fk_executor,
			&t.Fk_projects,
			&t.Fk_states,
			&t.Fk_status,
			&t.C_name,
			&t.C_actual_hour,
			&t.C_create_time,
			&t.C_description,
			&t.C_plain_hour,
		)
		if err != nil {
			revel.AppLog.Errorf("MTask.SelectProjectByID : rows.Scan, %s\n", err)
			continue
		}

		// добавление сущности в массив
		ts = append(ts, t)
	}

	return
}

// SelectTaskByID получение всех задач сотрудника по ID
func (m *MTask) SelectTaskByID(id int64) (ts []*TaskDBType, err error) {
	var (
		query string    // строка запроса
		rows  *sql.Rows // выборка данных
	)

	// запрос
	query = `
		SELECT 
			pk_id,
			fk_author,
			fk_executor,
			fk_projects,
			fk_states,
			fk_status,
			c_name,
			c_actual_hour,
			c_create_time,
			c_description,
			c_plan_hour
		FROM "manager".t_tasks
		WHERE fk_executor = $1
		ORDER BY pk_id;
	`

	// выполнение запроса
	rows, err = m.db.Query(query, id)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MTask.SelectTaskByID : m.db.query, %s\n", err)
		return
	}

	// обработка строк выборки
	for rows.Next() {
		// создание экземпляра сущности для считывания строки выборки
		t := new(TaskDBType)

		// считывание строки выборки
		err = rows.Scan(
			&t.Pk_id,
			&t.Fk_author,
			&t.Fk_executor,
			&t.Fk_projects,
			&t.Fk_states,
			&t.Fk_status,
			&t.C_name,
			&t.C_actual_hour,
			&t.C_create_time,
			&t.C_description,
			&t.C_plain_hour,
		)
		if err != nil {
			revel.AppLog.Errorf("MTask.SelectTaskByID : rows.Scan, %s\n", err)
			continue
		}

		// добавление сущности в массив
		ts = append(ts, t)
	}

	return
}

// Insert добавление задачи
func (m *MTask) Insert(task *TaskDBType) (id int64, err error) {
	var (
		query string   // строка запроса
		row   *sql.Row // выборка данных
	)

	revel.AppLog.Debugf("MTask.Insert, task: %+v\n", task)

	// запрос
	query = `
		INSERT INTO "manager".t_tasks(
			fk_author,
			fk_projects,
			fk_states,
			fk_status,
			c_name,
			c_actual_hour,
			c_description,
			c_plan_hour,
		    c_create_time
		)
		values(
			$1,
			$2,
			$3,
			$4,
			$5,
			$6,
			$7,
			$8,
			current_timestamp
		)
		returning pk_id;
	`

	// выполнение запроса
	row = m.db.QueryRow(query,
		task.Fk_author,
		task.Fk_projects,
		task.Fk_states,
		task.Fk_status,
		task.C_name,
		task.C_actual_hour,
		task.C_description,
		task.C_plain_hour,
	)

	// считывание id
	err = row.Scan(&id)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MTask.Insert : row.Scan, %s\n", err)
		return
	}

	return
}

// Insert добавление задачи с исполнителем
func (m *MTask) InsertWithExecutor(task *TaskDBType) (id int64, err error) {
	var (
		query string   // строка запроса
		row   *sql.Row // выборка данных
	)

	revel.AppLog.Debugf("MTask.Insert, task: %+v\n", task)

	// запрос
	query = `
		INSERT INTO "manager".t_tasks(
			fk_author,
		    fk_executor,                          
			fk_projects,
			fk_states,
			fk_status,
			c_name,
			c_actual_hour,
			c_description,
			c_plan_hour,
		    c_create_time
		)
		values(
			$1,
			$2,
			$3,
			$4,
			$5,
			$6,
			$7,
			$8,
		    $9,   
			current_timestamp
		)
		returning pk_id;
	`

	// выполнение запроса
	row = m.db.QueryRow(query,
		task.Fk_author,
		task.Fk_executor,
		task.Fk_projects,
		task.Fk_states,
		task.Fk_status,
		task.C_name,
		task.C_actual_hour,
		task.C_description,
		task.C_plain_hour,
	)

	// считывание id
	err = row.Scan(&id)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MTask.Insert : row.Scan, %s\n", err)
		return
	}

	return
}

// Update изменение задачи
func (m *MTask) Update(task *TaskDBType) (err error) {
	var (
		query string // строка запроса
	)

	revel.AppLog.Debugf("MBook.Update, task: %+v\n", task)

	// запрос
	query = `
		UPDATE "manager".t_tasks
			SET 
			    fk_author = $2,
				fk_projects = $3,
				fk_states = $4,
				fk_status = $5,
				c_name = $6,
				c_actual_hour = $7,
				c_description = $8,
				c_plan_hour = $9
		WHERE pk_id = $1;
	`

	// выполнение запроса
	_, err = m.db.Exec(query,
		task.Pk_id,
		task.Fk_author,
		task.Fk_projects,
		task.Fk_states,
		task.Fk_status,
		task.C_name,
		task.C_actual_hour,
		task.C_description,
		task.C_plain_hour,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MTask.Update : m.db.Exec, %s\n", err)
		return
	}

	return
}

// Update изменение задачи с исполнителем
func (m *MTask) UpdateWithExecutor(task *TaskDBType) (err error) {
	var (
		query string // строка запроса
	)

	revel.AppLog.Debugf("MBook.Update, task: %+v\n", task)

	// запрос
	query = `
		UPDATE "manager".t_tasks
			SET 
			    fk_author = $2,
				fk_executor = $3,
				fk_projects = $4,
				fk_states = $5,
				fk_status = $6,
				c_name = $7,
				c_actual_hour = $8,
				c_description = $9,
				c_plan_hour = $10
		WHERE pk_id = $1;
	`

	// выполнение запроса
	_, err = m.db.Exec(query,
		task.Pk_id,
		task.Fk_author,
		task.Fk_executor.Int64,
		task.Fk_projects,
		task.Fk_states,
		task.Fk_status,
		task.C_name,
		task.C_actual_hour,
		task.C_description,
		task.C_plain_hour,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MTask.Update : m.db.Exec, %s\n", err)
		return
	}

	return
}

// Delete удаление задачи
func (m *MTask) Delete(id int64) (err error) {
	var (
		query string // строка запроса
	)

	revel.AppLog.Debugf("MTask.Delete, id: %+v\n", id)

	// запрос
	query = `
		DELETE FROM "manager".t_tasks
		WHERE pk_id = $1;
	`

	// выполнение запроса
	_, err = m.db.Exec(query, id)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MTask.Delete : m.db.Exec, %s\n", err)
		return
	}

	return
}
