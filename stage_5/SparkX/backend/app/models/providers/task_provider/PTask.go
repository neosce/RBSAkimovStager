package task_provider

import (
	"backend/app/helpers"
	"backend/app/models/entities"
	"backend/app/models/mappers"
	"database/sql"
	"github.com/revel/revel"
)

// PTask провайдер контроллера задач
type PTask struct {
	taskMapper         *mappers.MTask
	taskEmployeeMapper *mappers.MEmployee
	taskProjectMapper  *mappers.MProject
	taskStateMapper    *mappers.MState
	taskStatusMapper   *mappers.MStatus
}

// Init
func (p *PTask) Init() (err error) {
	var db *sql.DB // экземпляр подключения к бд

	// получение экземпляра подключения к бд
	db, err = helpers.GetDBConnection()
	if err != nil {
		revel.AppLog.Errorf("PProject.Init : helpers.GetDBConnection, %s\n", err)
		return err
	}

	// инициализация маппера задач
	p.taskMapper = new(mappers.MTask)
	p.taskMapper.Init(db)

	// инициализация маппера сотрудников
	p.taskEmployeeMapper = new(mappers.MEmployee)
	p.taskEmployeeMapper.Init(db)

	// инициализация маппера проектов
	p.taskProjectMapper = new(mappers.MProject)
	p.taskProjectMapper.Init(db)

	// инициализация маппера состояний
	p.taskStateMapper = new(mappers.MState)
	p.taskStateMapper.Init(db)

	// инициализация маппера статусов
	p.taskStatusMapper = new(mappers.MStatus)
	p.taskStatusMapper.Init(db)

	return
}

// GetTasks метод получения всех задач
func (p *PTask) GetTasks() (ts []*entities.Task, err error) {
	var (
		tdbts []*mappers.TaskDBType
		et    *entities.Task
	)

	// получение данных проектов
	tdbts, err = p.taskMapper.SelectAll()
	if err != nil {
		revel.AppLog.Errorf("PTask.GetProjects : p.taskMapper.SelectAll, %s\n", err)
		return
	}

	for _, tdbt := range tdbts {
		var (
			eadbt *mappers.EmployeeDBType
			eedbt *mappers.EmployeeDBType
			pdbt  *mappers.ProjectDBType
			se    string
			ss    string
		)

		// получение значения создателя по ключу
		eadbt, err = p.taskEmployeeMapper.SelectByID(tdbt.Fk_author)
		if err != nil {
			revel.AppLog.Errorf("PTask.GetProjects : p.taskEmployeeMapper.SelectByID, %s\n", err)
			return
		}
		// получение значения исполнителя по ключу
		eedbt, err = p.taskEmployeeMapper.SelectByID(tdbt.Fk_executor.Int64)
		if err != nil {
			revel.AppLog.Errorf("PTask.GetProjects : p.taskEmployeeMapper.SelectByID, %s\n", err)
			return
		}
		// получение значения проекта по ключу
		pdbt, err = p.taskProjectMapper.SelectByID(tdbt.Fk_projects)
		if err != nil {
			revel.AppLog.Errorf("PTask.GetProjects : p.taskProjectMapper.SelectByID, %s\n", err)
			return
		}
		// получение значения состояния по ключу
		se, err = p.taskStateMapper.StateNameByID(tdbt.Fk_states)
		if err != nil {
			revel.AppLog.Errorf("PTask.GetProjects : p.taskStateMapper.StateNameByID, %s\n", err)
			return
		}
		// получение значения статуса по ключу
		ss, err = p.taskStatusMapper.StatusNameByID(tdbt.Fk_status)
		if err != nil {
			revel.AppLog.Errorf("PTask.GetProjects : p.taskStatusMapper.StatusNameByID, %s\n", err)
			return
		}

		// преобразование задачи к типу сущности
		et, err = tdbt.ToType()
		if err != nil {
			revel.AppLog.Errorf("PTask.GetProjects : tdbt.ToType, %s\n", err)
			return
		}

		// преобразование создателя к типу сущности
		et.Author = new(entities.Employee)
		et.Author, err = eadbt.ToType()
		if err != nil {
			revel.AppLog.Errorf("PTask.GetProjects : eadbt.ToType, %s\n", err)
			return
		}
		// преобразование исполнителя к типу сущности
		et.Executor = new(entities.Employee)
		et.Executor, err = eedbt.ToType()
		if err != nil {
			revel.AppLog.Errorf("PTask.GetProjects : eedbt.ToType, %s\n", err)
			return
		}
		// преобразование проекта к типу сущности
		et.Projects = new(entities.Project)
		et.Projects, err = pdbt.ToType()
		if err != nil {
			revel.AppLog.Errorf("PTask.GetProjects : pdbt.ToType, %s\n", err)
			return
		}
		et.States = se
		et.Status = ss

		ts = append(ts, et)
	}

	return
}

// GetTaskByID метод получения задачи по id
func (p *PTask) GetTaskByID(id int64) (t *entities.Task, err error) {
	var (
		tdbt  *mappers.TaskDBType
		eadbt *mappers.EmployeeDBType
		eedbt *mappers.EmployeeDBType
		pdbt  *mappers.ProjectDBType
		se    string
		ss    string
	)

	// получение данных проектов
	tdbt, err = p.taskMapper.SelectByID(id)
	if err != nil {
		revel.AppLog.Errorf("PTask.GetProjectByID : p.taskMapper.SelectByID, %s\n", err)
		return
	}

	// получение значения создателя по ключу
	eadbt, err = p.taskEmployeeMapper.SelectByID(tdbt.Fk_author)
	if err != nil {
		revel.AppLog.Errorf("PTask.GetProjectByID : p.taskEmployeeMapper.SelectByID, %s\n", err)
		return
	}
	// получение значения исполнителя по ключу
	eedbt, err = p.taskEmployeeMapper.SelectByID(tdbt.Fk_executor.Int64)
	if err != nil {
		revel.AppLog.Errorf("PTask.GetProjectByID : p.taskEmployeeMapper.SelectByID, %s\n", err)
		return
	}
	// получение значения проекта по ключу
	pdbt, err = p.taskProjectMapper.SelectByID(tdbt.Fk_projects)
	if err != nil {
		revel.AppLog.Errorf("PTask.GetProjectByID : p.taskProjectMapper.SelectByID, %s\n", err)
		return
	}
	// получение значения состояния по ключу
	se, err = p.taskStateMapper.StateNameByID(tdbt.Fk_states)
	if err != nil {
		revel.AppLog.Errorf("PTask.GetProjectByID : p.taskStateMapper.StateNameByID, %s\n", err)
		return
	}
	// получение значения статуса по ключу
	ss, err = p.taskStatusMapper.StatusNameByID(tdbt.Fk_status)
	if err != nil {
		revel.AppLog.Errorf("PTask.GetProjectByID : p.taskStatusMapper.StatusNameByID, %s\n", err)
		return
	}

	// преобразование типа бд к типу сущности
	t, err = tdbt.ToType()
	if err != nil {
		revel.AppLog.Errorf("PProject.GetProjectByID : pdbt.ToType, %s\n", err)
		return
	}

	// преобразование создателя к типу сущности
	t.Author = new(entities.Employee)
	t.Author, err = eadbt.ToType()
	if err != nil {
		revel.AppLog.Errorf("PTask.GetProjectByID : eadbt.ToType, %s\n", err)
		return
	}
	// преобразование исполнителя к типу сущности
	t.Executor = new(entities.Employee)
	t.Executor, err = eedbt.ToType()
	if err != nil {
		revel.AppLog.Errorf("PTask.GetProjectByID : eedbt.ToType, %s\n", err)
		return
	}
	// преобразование проекта к типу сущности
	t.Projects = new(entities.Project)
	t.Projects, err = pdbt.ToType()
	if err != nil {
		revel.AppLog.Errorf("PTask.GetProjectByID : pdbt.ToType, %s\n", err)
		return
	}
	t.States = se
	t.Status = ss

	return
}

// CreateTask метод создания задачи
func (p *PTask) CreateTask(task *entities.Task) (e *entities.Task, err error) {
	var (
		tdbt *mappers.TaskDBType
	)

	// инициализация структур бд из структур сущности
	tdbt, err = tdbt.FromType(*task)
	if err != nil {
		revel.AppLog.Errorf("PProject.CreateTask : edbt.FromType, %s\n", err)
		return
	}

	// получение внешнего ключа на состояние
	tdbt.Fk_states, err = p.taskStateMapper.IDByStateName(task.States)
	if err != nil {
		revel.AppLog.Errorf("PTask.CreateTask : p.taskStateMapper.IDByStateName, %s\n", err)
		return
	}

	// получение внешнего ключа на статус
	tdbt.Fk_status, err = p.taskStatusMapper.IDByStatusName(task.Status)
	if err != nil {
		revel.AppLog.Errorf("PEmployee.UpdateEmployee : p.positionsMapper.IDByPositionName, %s\n", err)
		return
	}

	// Проверка на наличие исполнителя задачи в сущности
	if task.Executor != nil {
		// Задаем исполнителя задачи
		tdbt.Fk_executor.Int64 = task.Executor.ID

		// добавление проекта с исполнителем
		task.ID, err = p.taskMapper.InsertWithExecutor(tdbt)
		if err != nil {
			revel.AppLog.Errorf("PProject.CreateProject : p.projectMapper.Create, %s\n", err)
			return
		}
	} else {
		// добавление проекта
		task.ID, err = p.taskMapper.Insert(tdbt)
		if err != nil {
			revel.AppLog.Errorf("PProject.CreateProject : p.projectMapper.Create, %s\n", err)
			return
		}
	}

	return task, nil
}

// UpdateTask метод обновления задачи
func (p *PTask) UpdateTask(task *entities.Task) (e *entities.Task, err error) {
	var (
		tdbt *mappers.TaskDBType
	)

	// инициализация структуры бд из структуры сущности
	tdbt, err = tdbt.FromType(*task)
	if err != nil {
		revel.AppLog.Errorf("PProject.UpdateProject : edbt.FromType, %s\n", err)
		return
	}

	// получение внешнего ключа на состояние
	tdbt.Fk_states, err = p.taskStateMapper.IDByStateName(task.States)
	if err != nil {
		revel.AppLog.Errorf("PEmployee.UpdateEmployee : p.positionsMapper.IDByPositionName, %s\n", err)
		return
	}

	// получение внешнего ключа на статус
	tdbt.Fk_status, err = p.taskStatusMapper.IDByStatusName(task.Status)
	if err != nil {
		revel.AppLog.Errorf("PEmployee.UpdateEmployee : p.positionsMapper.IDByPositionName, %s\n", err)
		return
	}

	// Проверка на наличие исполнителя задачи в сущности
	if task.Executor != nil {
		// Задаем исполнителя задачи
		tdbt.Fk_executor.Int64 = task.Executor.ID

		// обновление проекта
		err = p.taskMapper.UpdateWithExecutor(tdbt)
		if err != nil {
			revel.AppLog.Errorf("PProject.UpdateProject : p.projectMapper.Update, %s\n", err)
			return
		}
	} else {
		// обновление проекта
		err = p.taskMapper.Update(tdbt)
		if err != nil {
			revel.AppLog.Errorf("PProject.UpdateProject : p.projectMapper.Update, %s\n", err)
			return
		}
	}


	return task, nil
}

// DeleteTask метод удаления задачи
func (p *PTask) DeleteTask(id int64) (err error) {
	// удаление проекта
	err = p.taskMapper.Delete(id)
	if err != nil {
		revel.AppLog.Errorf("PProject.DeleteProject : p.projectMapper.Delete, %s\n", err)
		return
	}

	return
}
