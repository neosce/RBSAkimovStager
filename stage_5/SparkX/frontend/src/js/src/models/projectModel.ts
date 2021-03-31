import HttpRequestResponse from "../../helpers/xmlHttpRequest/httpRequestResponse";
import Project from "./entities/project";
import Employee from "./entities/employee";
import Store from "../../helpers/store";

/// ProjectModel класс для работы(CRUD) с данными
class ProjectModel extends HttpRequestResponse {
    private static instance: ProjectModel;

    private constructor() {
        super();
    }

    // Singleton
    public static getInstance(): ProjectModel {
        return !ProjectModel.instance
            ? (ProjectModel.instance = new ProjectModel())
            : ProjectModel.instance;
    }

    // GetAll получение всех проектов
    public getProjectsAll(): Promise<any> {
        return super.get(`${process.env.URL}/project/all`);
    }

    // GetByID получение проекта по id
    public getProjectById(id: number): Promise<any> {
        return super.get(`${process.env.URL}/project/${id}`);
    }

    // GetTasks получение задач по проекту id
    public getTasksProjectById(id: number): Promise<any> {
        return super.get(`${process.env.URL}/project/${id}/tasks`);
    }

    // GetEmployees получение по ID проекта всех сотрудников
    public getProjectEmployeesById(id: number): Promise<any> {
        return super.get(`${process.env.URL}/project/${id}/employees`);
    }

    // Create создание проекта
    public createNewProject(project: Project): Promise<any> {
        return super.post(`${process.env.URL}/project/create`, project);
    }

    // AttachEmployee метод добавления сотрудника на проект
    public addNewEmployeeInProject(id: number, employee: Employee): Promise<any> {
        return super.post(`${process.env.URL}/project/${id}/employee/attach`, employee);
    }

    // Update изменение проекта
    public updateProject(project: Project): Promise<any> {
        return super.patch(`${process.env.URL}/project/update`, project);
    }

    // Delete удаление проекта
    public deleteProjectById(id: number): Promise<any> {
        return super.delete(`${process.env.URL}/project/${id}`);
    }

}

export default ProjectModel.getInstance();
