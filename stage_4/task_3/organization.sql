/*---3---*/
/*1 выбрать всех сотрудников с их должностью, используя JOIN*/
SELECT te.pk_id, te.c_lastname, te.c_firstname, te.c_middlename, te.c_salary, te.c_email, rp.c_name as c_position
FROM partition.t_employees te
JOIN partition.ref_positions rp ON te.fk_position = rp.pk_id;

/*2 выбрать ФИО и почту всех сотрудников и клиентов, используя UNION*/
SELECT te.c_lastname, te.c_firstname, te.c_middlename, te.c_email
FROM partition.t_employees te
UNION SELECT tc.c_lastname, tc.c_firstname, tc.c_middlename, tc.c_email
FROM partition.t_clients tc;

/*3 выбрать минимальную, максимальную и среднюю зарплату сотрудников.
    Для минимальной и максимальной зп вывести ФИО сотрудников*/
SELECT '', '', '',
       avg(cast(te.c_salary as numeric))
FROM partition.t_employees te
UNION
SELECT tc.c_lastname, tc.c_firstname, tc.c_middlename, cast(tc.c_salary as numeric)
FROM partition.t_employees tc
WHERE cast(tc.c_salary as numeric) = (SELECT max(cast(c_salary as numeric)) FROM partition.t_employees)
UNION
SELECT tc.c_lastname, tc.c_firstname, tc.c_middlename, cast(tc.c_salary as numeric)
FROM partition.t_employees tc
WHERE cast(tc.c_salary as numeric) = (SELECT min(cast(c_salary as numeric)) FROM partition.t_employees);
