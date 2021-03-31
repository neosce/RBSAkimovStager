/*---2---*/
/*Добавление комментариев*/
/*Таблица t_user: */
COMMENT ON COLUMN auth.t_user.pk_id is 'уникальный идентификатор';
COMMENT ON COLUMN auth.t_user.c_login is 'логин';
COMMENT ON COLUMN auth.t_user.c_password is 'пароль';
COMMENT ON COLUMN auth.t_user.c_last_in is 'время последнего входа';

/*Таблица t_employees: */
COMMENT ON COLUMN partition.t_employees.pk_id is 'уникальный идентификатор сотрудника';
COMMENT ON COLUMN partition.t_employees.c_lastname is 'фамилия сотрудника';
COMMENT ON COLUMN partition.t_employees.c_firstname is 'имя сотрудника';
COMMENT ON COLUMN partition.t_employees.c_middlename is 'отчество сотрудника';
COMMENT ON COLUMN partition.t_employees.c_email is 'электронная почта';
COMMENT ON COLUMN partition.t_employees.c_position is 'название должности сотрудника';
COMMENT ON COLUMN partition.t_employees.c_salary is 'заработная плата сотрудника';

/*Таблица t_clients: */
COMMENT ON COLUMN partition.t_clients.pk_id is 'уникальный идентификатор клиента';
COMMENT ON COLUMN partition.t_clients.c_lastname is 'фамилия клиента';
COMMENT ON COLUMN partition.t_clients.c_firstname is 'имя клиента';
COMMENT ON COLUMN partition.t_clients.c_middlename is 'отчество клиента';
COMMENT ON COLUMN partition.t_clients.c_email is 'электронная почта';

/*Написать скрипт на добавление таблицы-справочника должностей (ref_positions)*/
CREATE TABLE partition.ref_positions (
    pk_id   serial,
    c_name varchar not null
);
ALTER TABLE partition.ref_positions
    ADD PRIMARY KEY (pk_id);
COMMENT ON COLUMN partition.ref_positions.pk_id is 'уникальный идентификатор должности';
COMMENT ON COLUMN partition.ref_positions.c_name is 'название должности';

/*Заполенние данными ref_positions*/
INSERT INTO partition.ref_positions (c_name)
SELECT DISTINCT te.c_position
FROM partition.t_employees te;

/*написать скрипт на добавление значений внешнего ключа должностей (ref_positions) в таблицу t_employees*/
ALTER TABLE partition.t_employees
ADD COLUMN fk_position int;
COMMENT ON COLUMN partition.t_employees.fk_position is 'внешний ключ на должность сотрудника';
ALTER TABLE partition.t_employees
ADD FOREIGN KEY (fk_position) REFERENCES partition.ref_positions (pk_id);

/*Добавление значений в таблицу t_employees*/
UPDATE partition.t_employees te
SET fk_position = rp.pk_id
FROM partition.ref_positions rp
WHERE te.c_position = rp.c_name;

/*написать скрипт заполнения на основе уникальных значений колонки c_position таблицы t_employees*/
/*Удаление столбца c_position из t_employees*/
ALTER TABLE partition.t_employees
DROP COLUMN c_position;
