import HttpRequestResponse from "../../helpers/xmlHttpRequest/httpRequestResponse";
import Employee from "./entities/employee";

class EmployeeModel extends HttpRequestResponse {
    private static instance: EmployeeModel;

    private constructor() {
        super();
    }

    // Singleton
    public static getInstance(): EmployeeModel {
        return !EmployeeModel.instance
            ? (EmployeeModel.instance = new EmployeeModel())
            : EmployeeModel.instance;
    }

    // GetAll получение всех сотрудников
    public getEmployeesAll(): Promise<any> {
        return super.get(`${process.env.URL}/employee/all`);
    }

    // GetByID получение сотрудника по id
    public getEmployeeById(id: number): Promise<any> {
        return super.get(`${process.env.URL}/employee/${id}`);
    }

    // GetProjects получение по id сотрудника всех его проектов
    public getEmployeeProjectsById(id: number): Promise<any> {
        return super.get(`${process.env.URL}/employee/${id}/projects`);
    }

    // Get employee tasks by id - получить все задачи сотрудника по id
    public getEmployeeTasksById(id: number): Promise<any> {
        return super.get(`${process.env.URL}/employee/${id}/tasks`);
    }

    // GetTeamLeadProjects получение по ID создателя(проекта) всех проектов
    public getTeamLeadProjectsById(id: number): Promise<any> {
        return super.get(`${process.env.URL}/employee/${id}/projects/teamlead`);
    }

    // Create создание сотрудника
    public createNewEmployee(employee: Employee): Promise<any> {
        return super.post(`${process.env.URL}/employee/create`, employee);
    }

    // UpdateEmployee изменение сотрудника
    public updateEmployee (employee: Employee): Promise<any> {
        return super.patch(`${process.env.URL}/employee/update`, employee);
    }

    // DeleteEmployee удаление сотрудника
    public deleteEmployeeById (id: number): Promise<any> {
        return super.patch(`${process.env.URL}/employee/${id}`);
    }

}

export default EmployeeModel.getInstance();