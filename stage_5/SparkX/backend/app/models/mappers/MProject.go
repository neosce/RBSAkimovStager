package mappers

import (
	"backend/app/models/entities"
	"database/sql"
	"fmt"
	"github.com/revel/revel"
	"time"
)

// ProjectDBType тип сущности "Проект" бд
type ProjectDBType struct {
	Pk_id         int64
	Fk_team_lead  int64
	C_name        string
	C_description string
	C_create_time time.Time
}

// MProject маппер проект
type MProject struct {
	db *sql.DB
}

// Init
func (m *MProject) Init(db *sql.DB) {
	m.db = db
}

// ToType функция преобразования типа бд к типу сущности
func (dbt *ProjectDBType) ToType() (t *entities.Project, err error) {
	t = new(entities.Project)

	t.ID = dbt.Pk_id
	t.Name = dbt.C_name
	t.Description = dbt.C_description
	t.CreateTime = dbt.C_create_time

	return
}

// FromType функция преобразования типа бд из типа сущности
func (_ *ProjectDBType) FromType(e entities.Project) (dbt *ProjectDBType, err error) {
	dbt = &ProjectDBType{
		Pk_id:         e.ID,
		C_name:        e.Name,
		Fk_team_lead:  e.TeamLead.ID,
		C_description: e.Description,
		C_create_time: e.CreateTime,
	}

	return
}

// SelectAll получение всех проектов
func (m *MProject) SelectAll() (pdbts []*ProjectDBType, err error) {
	var (
		query string    // строка запроса
		rows  *sql.Rows // выборка данных
	)

	// запрос
	query = `
		SELECT
			pk_id,
			fk_team_lead,
		    c_name,
		    c_description,
		    c_create_time
		FROM "manager".t_projects
		ORDER BY pk_id;	
	`

	// выполнение запроса
	rows, err = m.db.Query(query)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MProject.SelectAll : m.db.query, %s\n", err)
		return
	}

	// обработка строк выборки
	for rows.Next() {
		// создание экземпляра сущности для считывания строки выборки
		pdbt := new(ProjectDBType)

		// считывание строки выборки
		err = rows.Scan(
			&pdbt.Pk_id,
			&pdbt.Fk_team_lead,
			&pdbt.C_name,
			&pdbt.C_description,
			&pdbt.C_create_time,
		)
		if err != nil {
			revel.AppLog.Errorf("MProject.SelectAll : rows.Scan, %s\n", err)
			continue
		}

		// добавление сущности в массив
		pdbts = append(pdbts, pdbt)
	}

	return
}

// SelectByID получение проекта по ID
func (m *MProject) SelectByID(id int64) (p *ProjectDBType, err error) {
	var (
		query string   // строка запроса
		row   *sql.Row // выборка данных
	)

	p = new(ProjectDBType)

	// запрос
	query = `
		SELECT 
			pk_id,
			fk_team_lead,
		    c_name,
		    c_description,
		    c_create_time
		FROM "manager".t_projects
		WHERE pk_id = $1
		ORDER BY pk_id;
	`

	// выполнение запроса
	row = m.db.QueryRow(query, id)

	// считывание строки выборки
	err = row.Scan(
		&p.Pk_id,
		&p.Fk_team_lead,
		&p.C_name,
		&p.C_description,
		&p.C_create_time,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MProject.SelectByID : row.Scan, %s\n", err)
		return
	}

	return
}

// SelectEmployeeByID получние по ID проекта всех сотрудников
func (m *MProject) SelectEmployeeByID(id int64) (es []*EmployeeDBType, err error) {
	var (
		query string    // строка запроса
		rows  *sql.Rows // Выборка данных
	)

	// запрос
	query = `
	SELECT
		t_employees.pk_id,
    	t_employees.c_lastname,
    	t_employees.c_firstname,
    	t_employees.c_middlename,
    	t_employees.c_email,
    	t_employees.c_login,
    	t_employees.c_avatar,
    	t_employees.c_online,
    	t_employees.c_last_in
	FROM manager.t_employees
	JOIN manager.toc_users_projects
	ON manager.t_employees.pk_id = manager.toc_users_projects.fk_users
	WHERE manager.toc_users_projects.fk_projects = $1
	ORDER BY manager.t_employees.pk_id;
	`

	// выполнение запроса
	rows, err = m.db.Query(query, id)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MEmployee.SelectAll : m.db.query, %s\n", err)
		return
	}

	// обработка строк выборки
	for rows.Next() {
		// создание экземпляра сущности для считывания строки выборки
		e := new(EmployeeDBType)

		// считывание строки выборки
		err = rows.Scan(
			&e.Pk_id,
			&e.C_lastname,
			&e.C_firstname,
			&e.C_middlename,
			&e.C_email,
			&e.C_login,
			&e.C_avatar,
			&e.C_online,
			&e.C_last_in,
		)
		if err != nil {
			revel.AppLog.Errorf("MEmployee.SelectAll : m.db.query, %s\n", err)
			continue
		}

		fmt.Println(e)

		// добавление сущности в массив
		es = append(es, e)
	}

	return
}

// Insert добавление проекта
func (m *MProject) Insert(project *ProjectDBType) (id int64, err error) {
	var (
		query string   // строка запроса
		row   *sql.Row // выборка данных
	)

	revel.AppLog.Debugf("MProject.Insert, task: %+v\n", project)

	// запрос
	query = `
		INSERT INTO "manager".t_projects(
			fk_team_lead,
		    c_name,
		    c_description,
		    c_create_time
		)
		values(
			$1,
			$2,
			$3,
			current_timestamp
		)
		returning pk_id;
	`

	// выполнение запроса
	row = m.db.QueryRow(query,
		&project.Fk_team_lead,
		&project.C_name,
		&project.C_description,
	)

	// считывание id
	err = row.Scan(&id)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MProject.Insert : row.Scan, %s\n", err)
		return
	}

	return
}

// InsertEmployee добавление сотрудника на проект
func (m *MProject) InsertEmployee(idProject int64, idEmployee int64) (id int64, err error) {
	var (
		query string   // строка запроса
		row   *sql.Row // выборка данных
	)

	// запрос
	query = `
		INSERT INTO "manager".toc_users_projects(
			fk_users,
			fk_projects
		)
		values(
			$1,
			$2
		)
		returning pk_id;
	`

	// выполнение запроса
	row = m.db.QueryRow(query,
		idEmployee,
		idProject,
	)

	// считывание id
	err = row.Scan(&id)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MProject.Insert : row.Scan, %s\n", err)
		return
	}

	return
}

// Update изменение проекта
func (m *MProject) Update(project *ProjectDBType) (err error) {
	var (
		query string // строка запроса
	)

	revel.AppLog.Debugf("MProject.Update, project: %+v\n", project)

	// запрос
	query = `
		UPDATE "manager".t_projects
		    SET
		    	c_name = $2,
		    	c_description = $3
		WHERE pk_id = $1;
	`

	// выполнение запроса
	_, err = m.db.Exec(query,
		project.Pk_id,
		project.C_name,
		project.C_description,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MProject.Update : m.db.Exec, %s\n", err)
		return
	}

	return
}

// Delete удаление проекта
func (m *MProject) Delete(id int64) (err error) {
	var (
		queryDelTasks   string // строка запроса удаления всех задач принадлежащих проекту
		queryDelProject string // строка запроса удаления проекта
	)

	// запрос
	queryDelTasks = `
		DELETE FROM "manager".t_tasks
		    WHERE fk_projects = $1;
	`

	// выполнение запроса
	_, err = m.db.Exec(queryDelTasks, id)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MProject.Delete(Tasks) : m.db.Exec, %s\n", err)
		return
	}

	// запрос
	queryDelProject = `
		DELETE FROM "manager".t_projects
			WHERE pk_id = $1;
	`

	// выполнение запроса
	_, err = m.db.Exec(queryDelProject, id)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MProject.Delete(Project) : m.db.Exec, %s\n", err)
		return
	}

	return
}
