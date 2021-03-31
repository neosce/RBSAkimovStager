import Employee from "./employee";

export default class EmployeeKanban {
    public ID: number;
    public value: string;
    public lastname: string;
    public firstname: string;
    public middlename: string;
    public email: string;
    public login: string;
    public image: string;
    public lastIn: string;
    public online: boolean;

    constructor(
        id: number,
        lastname: string,
        firstname: string,
        middlename: string,
        email: string,
        login: string,
        avatar: string,
        lastIn: string,
        online: boolean
    ) {
        this.ID = id;
        this.value = `${lastname} ${firstname} ${middlename}`;
        this.lastname = lastname;
        this.firstname = firstname;
        this.middlename = middlename;
        this.email = email;
        this.login = login;
        this.image = avatar;
        this.lastIn = lastIn;
        this.online = online;
    }

    // Преобразование массива сотрудников в массив для kanban
    public static getEmployeesKanban(employees: Array<Employee>): Array<EmployeeKanban> {
        const employeeKanban: Array<EmployeeKanban> = [];

        for (const employee of employees) {
            employeeKanban.push(new EmployeeKanban(
                employee.ID,
                employee.lastname,
                employee.firstname,
                employee.middlename,
                employee.email,
                employee.login,
                employee.avatar,
                employee.lastIn.toLocaleString(),
                employee.online
            ));
        }

        return employeeKanban;
    }

    // Возвращает обычный Employee
    public static getEmployee(employeeKanban: EmployeeKanban): Employee {
        return new Employee(
            employeeKanban.ID,
            employeeKanban.lastname,
            employeeKanban.firstname,
            employeeKanban.middlename,
            employeeKanban.email,
            employeeKanban.login,
            employeeKanban.image,
            employeeKanban.lastIn,
            employeeKanban.online
        );
    }
}