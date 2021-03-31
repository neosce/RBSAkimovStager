package mappers

import (
	"backend/app/models/entities"
	"database/sql"
	"fmt"
	"github.com/revel/revel"
	"time"
	//_"tmp"
)

// EmployeeDBType тип сущности "сотрудник" бд
type EmployeeDBType struct {
	Pk_id        int64     // идентификатор
	C_lastname   string    // фамилия
	C_firstname  string    // имя
	C_middlename string    // отчество
	C_email      string    // почтовый адрес
	C_login      string    // логин
	C_password   string    // пароль
	C_avatar     string    // аватар
	C_online     bool      // налаичие пользователя в сети
	C_last_in    time.Time // время последнего входа
}

// MEmployee маппер сотрудников
type MEmployee struct {
	db *sql.DB
}

func (m *MEmployee) Init(db *sql.DB) {
	m.db = db
}

// ToType функция преобразования типа бд к типу сущности
func (dbt *EmployeeDBType) ToType() (e *entities.Employee, err error) {
	e = new(entities.Employee)

	e.ID = dbt.Pk_id
	e.Lastname = dbt.C_lastname
	e.Firstname = dbt.C_firstname
	e.Middlename = dbt.C_middlename
	e.Email = dbt.C_email
	e.Login = dbt.C_login
	e.Password = dbt.C_password
	e.Avatar = dbt.C_avatar
	e.Online = dbt.C_online
	e.LastIn = &dbt.C_last_in

	return
}

// FromType функция преобразования типа сущности к типу бд, допускается, что dbt is nil
func (_ *EmployeeDBType) FromType(e entities.Employee) (dbt *EmployeeDBType, err error) {
	dbt = &EmployeeDBType{
		Pk_id:        e.ID,
		C_lastname:   e.Lastname,
		C_firstname:  e.Firstname,
		C_middlename: e.Middlename,
		C_email:      e.Email,
		C_login:      e.Login,
		C_password:   e.Password,
		C_avatar:     e.Avatar,
		C_online:     e.Online,
		C_last_in:    *e.LastIn,
	}

	return
}

// SelectAll получение всех сотрудников
func (m *MEmployee) SelectAll() (es []*EmployeeDBType, err error) {
	var (
		query string    // строка запроса
		rows  *sql.Rows // Выборка данных
	)

	// запрос
	query = `
	SELECT
		pk_id,
    	c_lastname,
    	c_firstname,
    	c_middlename,
    	c_email,
    	c_login,
    	c_avatar,
    	c_online,
    	c_last_in
	FROM manager.t_employees
	ORDER BY pk_id
	`

	// выполнение запроса
	rows, err = m.db.Query(query)
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

// SelectByIDWithPassword получение сотрудника по ID с паролем
func (m *MEmployee) SelectByIDWithPassword(id int64) (e *EmployeeDBType, err error) {
	var (
		query string
		row   *sql.Row
	)

	e = new(EmployeeDBType)

	// запрос
	query = `
	SELECT
       	pk_id,
    	c_lastname,
    	c_firstname,
    	c_middlename,
    	c_email,
    	c_login,
    	c_password,
    	c_avatar,
    	c_online,
    	c_last_in
	FROM manager.t_employees
	WHERE Pk_id = $1
	ORDER BY pk_id
	`

	// выполнение запроса
	row = m.db.QueryRow(query, id)

	// считывание строки выборки
	err = row.Scan(
		&e.Pk_id,
		&e.C_lastname,
		&e.C_firstname,
		&e.C_middlename,
		&e.C_email,
		&e.C_login,
		&e.C_password,
		&e.C_avatar,
		&e.C_online,
		&e.C_last_in,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MEmployee.SelectByIDWithPassword : row.Scan, %s\n", err)
		return
	}

	return
}

// SelectByID получение сотрудника по ID
func (m *MEmployee) SelectByID(id int64) (e *EmployeeDBType, err error) {
	var (
		query string
		row   *sql.Row
	)

	e = new(EmployeeDBType)

	// запрос
	query = `
	SELECT
       	pk_id,
    	c_lastname,
    	c_firstname,
    	c_middlename,
    	c_email,
    	c_login,
    	c_avatar,
    	c_online,
    	c_last_in
	FROM manager.t_employees
	WHERE Pk_id = $1
	ORDER BY pk_id
	`

	// выполнение запроса
	row = m.db.QueryRow(query, id)

	// считывание строки выборки
	err = row.Scan(
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
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MEmployee.SelectByID : row.Scan, %s\n", err)
		return
	}

	return
}

// SelectUserByLogin получение пользователя по логину
func (m *MEmployee) SelectUserByLogin(login string) (e *EmployeeDBType, err error) {
	var (
		query string   // строка запроса
		row   *sql.Row // выборка данных
	)

	e = new(EmployeeDBType)

	// запрос
	query = `
	SELECT
       	pk_id,
    	c_lastname,
    	c_firstname,
    	c_middlename,
    	c_email,
    	c_login,
    	c_password,
    	c_avatar,
    	c_online,
    	c_last_in
	FROM manager.t_employees
	WHERE c_login = $1
	ORDER BY pk_id
	`

	// выполнение запроса
	row = m.db.QueryRow(query, login)

	// считывание строки выборки
	err = row.Scan(
		&e.Pk_id,
		&e.C_lastname,
		&e.C_firstname,
		&e.C_middlename,
		&e.C_email,
		&e.C_login,
		&e.C_password,
		&e.C_avatar,
		&e.C_online,
		&e.C_last_in,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return nil, err
		}

		revel.AppLog.Errorf("MEmployee.SelectUserByLogin : row.Scan, %s\n", err)
		return
	}

	return
}

// SelectProjectByID получение по ID сотрудника всех проектов
func (m *MEmployee) SelectProjectByID(id int64) (psdbt []*ProjectDBType, err error) {
	var (
		query string    // строка запроса
		rows  *sql.Rows // выборка данных
	)

	// запрос
	query = `
		SELECT
   			t_projects.pk_id,
    		t_projects.fk_team_lead,
    		t_projects.c_name,
    		t_projects.c_description,
    		t_projects.c_create_time
		FROM manager.t_projects
		JOIN manager.toc_users_projects
		ON t_projects.pk_id = toc_users_projects.fk_projects
		WHERE manager.toc_users_projects.fk_users = $1
		ORDER BY t_projects.pk_id;
	`

	// выполнение запроса
	rows, err = m.db.Query(query, id)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MProject.SelectProjectByID : m.db.query, %s\n", err)
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
			revel.AppLog.Errorf("MProject.SelectProjectByID : rows.Scan, %s\n", err)
			continue
		}

		// добавление сущности в массив
		psdbt = append(psdbt, pdbt)
	}

	return
}

// SelectTeamLeadByID получение по ID создателя(проекта) всех проектов
func (m *MEmployee) SelectTeamLeadByID(id int64) (psdbt []*ProjectDBType, err error) {
	var (
		query string    // строка запроса
		rows  *sql.Rows // выборка данных
	)

	// запрос
	query = `
		SELECT
   			t_projects.pk_id,
    		t_projects.fk_team_lead,
    		t_projects.c_name,
    		t_projects.c_description,
    		t_projects.c_create_time
		FROM manager.t_projects
		WHERE manager.t_projects.fk_team_lead = $1
		ORDER BY t_projects.pk_id;
	`

	// выполнение запроса
	rows, err = m.db.Query(query, id)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MProject.SelectProjectByID : m.db.query, %s\n", err)
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
			revel.AppLog.Errorf("MProject.SelectProjectByID : rows.Scan, %s\n", err)
			continue
		}

		// добавление сущности в массив
		psdbt = append(psdbt, pdbt)
	}

	return
}

// Insert добавление сотрудника
func (m *MEmployee) Insert(edbt *EmployeeDBType) (id int64, err error) {
	var (
		query string   // строка запроса
		row   *sql.Row // выборка данных
	)

	// запрос
	query = `
	INSERT INTO "manager".t_employees(
		c_lastname,
    	c_firstname,
    	c_middlename,
    	c_email,
    	c_login,
    	c_password,
    	c_avatar,
    	c_online,
    	c_last_in
	)
	VALUES (
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
	returning pk_id
	`

	// выполнение запроса
	row = m.db.QueryRow(query,
		edbt.C_lastname,
		edbt.C_firstname,
		edbt.C_middlename,
		edbt.C_email,
		edbt.C_login,
		[]byte(edbt.C_password),
		[]byte(edbt.C_avatar),
		edbt.C_online,
	)

	// считывание id
	err = row.Scan(&id)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MEmployee.Insert : row.Scan, %s\n", err)
		return
	}

	return
}

// Update изменение сотрудника
func (m *MEmployee) Update(edbt *EmployeeDBType) (err error) {
	var (
		query string // строка запроса
	)

	revel.AppLog.Debugf("MEmployee.Update, edbt: %+v\n", edbt)

	// запрос
	query = `
		UPDATE "manager".t_employees
		SET 
			c_lastname = $2,
    		c_firstname = $3,
    		c_middlename = $4,
    		c_email = $5,
    		c_login = $6,
    		c_avatar = $7
		WHERE pk_id = $1;
	`

	// выполнение запроса
	_, err = m.db.Exec(query,
		edbt.Pk_id,            // pk_id
		edbt.C_lastname,       // c_lastname
		edbt.C_firstname,      // c_firstname
		edbt.C_middlename,     // c_middlename
		edbt.C_email,          // c_email
		edbt.C_login,          // c_email
		[]byte(edbt.C_avatar), // c_email
	)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MEmployee.Update : m.db.Exec, %s\n", err)
		return
	}

	return
}

// Delete удаление сотрудника
func (m *MEmployee) Delete(id int64) (err error) {
	var (
		query string // строка запроса
	)

	// запрос
	query = `
		DELETE FROM "manager".t_employees
		WHERE pk_id = $1;
	`

	// выполнение запроса
	_, err = m.db.Exec(query, id)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MEmployee.Delete : m.db.Exec, %s\n", err)
		return
	}

	return
}
