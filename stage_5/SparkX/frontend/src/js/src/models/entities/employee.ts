import EmployeeKanban from "./employeeKanban";

export default class Employee {
    public ID: number;
    public lastname: string;
    public firstname: string;
    public middlename: string;
    public email: string;
    public login: string;
    public avatar: string;
    public lastIn: Date;
    public online: boolean;
    public password: string;

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
        this.lastname = lastname;
        this.firstname = firstname;
        this.middlename = middlename;
        this.email = email;
        this.login = login;
        this.avatar = avatar;
        this.lastIn = new Date(lastIn);
        this.online = online;
    }

    public static fullName(employee: Employee | EmployeeKanban): string {
        return `${employee.lastname} ${employee.firstname} ${employee.middlename}`;
    }
}