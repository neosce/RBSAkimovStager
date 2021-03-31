/*---1---*/
CREATE DATABASE "rbsMisha";
\c rbsMisha;

/*Созадние Схем и таблиц*/
CREATE SCHEMA partition
    CREATE TABLE t_employees
    (
        pk_id        serial,
        c_lastname   varchar not null,
        c_firstname  varchar not null,
        c_middlename varchar,
        c_salary     money not null,
        c_email      varchar,
        c_position   varchar not null
    )
    CREATE TABLE t_clients
    (
        pk_id        serial,
        c_lastname   varchar not null,
        c_firstname  varchar not null,
        c_middlename varchar,
        c_email      varchar
    );
CREATE SCHEMA auth
    CREATE TABLE t_user
    (
        pk_id      serial,
        c_login    varchar not null,
        c_password bytea not null,
        c_last_in  timestamp
    );

/*Вставка данных в таблицы*/
/*Таблица t_employees: */
INSERT INTO partition.t_employees (c_lastname, c_firstname, c_middlename, c_salary, c_email, c_position)
VALUES ('Воронина', 'Карина', 'Егоровна', cast(cast(floor(random() * (52455 - 3350 + 1)) + 10 as varchar) as money), 'Egorovna@email.ru', 'Developer'),
       ('Сорокин', 'Максим', 'Алексеевич', cast(cast(floor(random() * (52455 - 3350 + 1)) + 10 as varchar) as money), 'Alekseevich@email.ru', 'Developer'),
       ('Павловский', 'Михаил', 'Александрович', cast(cast(floor(random() * (52455 - 3350 + 1)) + 10 as varchar) as money), 'Aleksandrovich@email.ru', 'Testing'),
       ('Гончарова', 'Елизавета', 'Львовна', cast(cast(floor(random() * (52455 - 3350 + 1)) + 10 as varchar) as money), 'vovna@email.ru', 'UI/UX'),
       ('Калашникова', 'Маргарита', 'Львовна', cast(cast(floor(random() * (52455 - 3350 + 1)) + 10 as varchar) as money), 'lvovna@email.ru', 'Developer'),
       ('Федотов', 'Роман', 'Максимович', cast(cast(floor(random() * (52455 - 3350 + 1)) + 10 as varchar) as money), 'Maksimovich@email.ru', 'HR'),
       ('Лаврова', 'Варвара', 'Константиновна', cast(cast(floor(random() * (52455 - 3350 + 1)) + 10 as varchar) as money), 'Konstantinovna@email.ru', 'HR'),
       ('Беляева', 'Виктория', 'Александровна', cast(cast(floor(random() * (52455 - 3350 + 1)) + 10 as varchar) as money), 'Aleksandrovna@email.ru', 'Manager project'),
       ('Щербакова', 'Ангелина', 'Руслановна', cast(cast(floor(random() * (52455 - 3350 + 1)) + 10 as varchar) as money), 'Ruslanovna@email.ru', 'Team lead'),
       ('Степанов', 'Денис', 'Ярославович', cast(cast(floor(random() * (52455 - 3350 + 1)) + 10 as varchar) as money), 'YAroslavovich@email.ru', 'Manager project');

/*Таблица t_clients: */
INSERT INTO partition.t_clients (c_lastname, c_firstname, c_middlename, c_email)
VALUES ('Туманова', 'Мия', 'Михайловна', 'Mihajlovna@email.ru'),
       ('Власов', 'Антон', 'Андреевич', 'Andreevich@email.ru'),
       ('Тихомиров', 'Тимур', 'Арсентьевич', 'Arsentevich@email.ru'),
       ('Калинина', 'Валерия', 'Артёмовна', 'Artyomovna@email.ru'),
       ('Литвинова', 'Валерия', 'Богдановна', 'Bogdanovna@email.ru'),
       ('Киселев', 'Денис', 'Назарович', 'Nazarovich@email.ru'),
       ('Павлова', 'Алиса', 'Артёмовна', 'Artyomovna@email.ru'),
       ('Булатова', 'Мария', 'Петровна', 'Petrovna@email.ru');

/*Таблица t_user: */
INSERT INTO auth.t_user (c_login, c_password, c_last_in)
VALUES ('mihajlovna', '$2y$12$1Ose1cPhd7dRDR0gH8vYy.gGpOTiofmnUAMn1FCmbeOQgU1Zyqe3G ', current_timestamp),
       ('andreevich', '$2y$12$2HHox7Q6zY6xfqanqOJ/8uZlQLmPfm27DPLy4APN.iPEPHIlY7jdi ', current_timestamp),
       ('nazarovich', '$2y$12$gzmSkKGTtikWA2lQkX9K8uMOI96ARzcuX7Sho/Wy/.bVStU9GiWOm ', current_timestamp),
       ('artyomovna', '$2y$12$ZTBhV5xNJ6SvQwYtUztamOuXx9.Y3XdsBHjq3yPe71OF9E5R2yWQW ', current_timestamp),
       ('arsentevich', '$2y$12$pZXC2gXQWXSiLL5OSSSPluGxno7c5ez1JIi9eRAHZJR4l.E6cD4FS ', current_timestamp),
       ('bogdanovna', '$2y$12$ujhw6zZzwHgEvNhfCUK4JOCofdKUra/j4pVfyQeJ8zTB4aqk0sqzC ', current_timestamp),
       ('petrovna', '$2y$12$bvtkj4jGe8SbXwzMLjY7RepIisYHQC5dzMZZQLy3UhkQn9MMP4Izm ', current_timestamp);

