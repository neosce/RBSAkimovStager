CREATE DATABASE "taskManager";
\c taskManager;

CREATE SCHEMA "manager"
    CREATE TABLE t_employees (
        pk_id serial PRIMARY KEY,
        c_lastname   varchar not null,
        c_firstname  varchar not null,
        c_middlename varchar,
        c_email varchar not null,
        c_login    varchar not null,
        c_password bytea not null,
        c_avatar bytea,
        c_last_in  timestamp default current_timestamp not null,
        c_online bool default false not null /* ? */
    )
    CREATE TABLE t_projects (
        pk_id serial PRIMARY KEY,
        fk_team_lead int REFERENCES t_employees (pk_id) not null,
        c_name varchar                                  not null,
        c_description varchar                           not null default '',
        c_create_time timestamp default current_timestamp not null
    )
    CREATE TABLE toc_users_projects (
        pk_id serial,
        fk_users int REFERENCES t_employees (pk_id)   not null,
        fk_projects int REFERENCES t_projects (pk_id) not null
    )
    CREATE TABLE "ref_statuses" (
        pk_id serial PRIMARY KEY,
        c_name varchar not null
    )
    CREATE TABLE "ref_states" (
        pk_id serial PRIMARY KEY,
        c_name varchar not null
    )
    CREATE TABLE t_tasks (
        pk_id serial PRIMARY KEY,
        fk_projects int REFERENCES t_projects (pk_id)     not null,
        fk_author int REFERENCES t_employees (pk_id)      not null,
        fk_executor int REFERENCES t_employees (pk_id),
        fk_states int REFERENCES ref_states(pk_id),
        fk_status int REFERENCES ref_statuses(pk_id),
        c_name varchar                                    not null,
        c_description varchar,
        c_plan_hour int,
        c_actual_hour int,
        c_create_time timestamp default current_timestamp not null
    );

/* Employees */
COMMENT ON COLUMN manager.t_employees.c_lastname is 'фамилия сотрудника';
COMMENT ON COLUMN manager.t_employees.c_firstname is 'имя сотрудника';
COMMENT ON COLUMN manager.t_employees.c_middlename is 'отчество сотрудника';
COMMENT ON COLUMN manager.t_employees.c_email is 'электронная почта';
COMMENT ON COLUMN manager.t_employees.c_login is 'логин для входа';
COMMENT ON COLUMN manager.t_employees.c_password is 'пароль';
COMMENT ON COLUMN manager.t_employees.c_avatar is 'фотография пользователя';
COMMENT ON COLUMN manager.t_employees.c_last_in is 'время последнего входа';
COMMENT ON COLUMN manager.t_employees.c_online is 'находится ли сотрудник в сети в данный момент';

/* Users-Projects */
COMMENT ON COLUMN manager.toc_users_projects.fk_users is 'внешний ключ на сотрудника в проекте';
COMMENT ON COLUMN manager.toc_users_projects.fk_projects is 'внешний ключ на проект для сотрудника';

/* Projects */
COMMENT ON COLUMN manager.t_projects.c_name is 'название проекта';
COMMENT ON COLUMN manager.t_projects.c_description is 'описание проекта';
COMMENT ON COLUMN manager.t_projects.fk_team_lead is 'внешний ключ на тим лида(создателя) проекта';
COMMENT ON COLUMN manager.t_projects.c_create_time is 'дата создания проекта';

/* Statuses */
COMMENT ON COLUMN manager.ref_statuses.c_name is 'название статуса срочности выполнения: Обычная(common), Срочная(urgent), Очень срочная(very_urgent)';

/* States */
COMMENT ON COLUMN manager.ref_states.c_name is 'название состояния задачи в данный момент: Список задач(Создана)(create), Назначено(assigned), В процессе(in process), Выполненные(complete), Согласование(discussion)';

/* Tasks */
COMMENT ON COLUMN manager.t_tasks.fk_projects is 'внешний ключ на проект к которому принадлежит задача';
COMMENT ON COLUMN manager.t_tasks.c_name is 'название задачи';
COMMENT ON COLUMN manager.t_tasks.fk_author is 'внешний ключ на создателя задачи';
COMMENT ON COLUMN manager.t_tasks.fk_executor is 'исполнитель задачи';
COMMENT ON COLUMN manager.t_tasks.c_description is 'описание задачи';
COMMENT ON COLUMN manager.t_tasks.c_plan_hour is 'время за которое необходимо выполнить задачу';
COMMENT ON COLUMN manager.t_tasks.c_actual_hour is 'время на за которое задача была фактически выполнена';
COMMENT ON COLUMN manager.t_tasks.c_create_time is 'время создания задачи';
COMMENT ON COLUMN manager.t_tasks.fk_states is 'внешний ключ на состояние';
COMMENT ON COLUMN manager.t_tasks.fk_status is 'внешний ключ на статус';


