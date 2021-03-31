import HttpRequestResponse from "../../helpers/xmlHttpRequest/httpRequestResponse";
import Task from "./entities/task";

class TaskModel extends HttpRequestResponse{
    private static instance: TaskModel;

    private constructor() {
        super();
    }

    // Singleton
    public static getInstance(): TaskModel {
        return !TaskModel.instance
            ? (TaskModel.instance = new TaskModel())
            : TaskModel.instance;
    }

    // GetAll получение всех задач
    public getTasksAll(): Promise<any> {
        return super.get(`${process.env.URL}/task/all`);
    }

    // GetByID получение задачи по id
    public getTaskById(id: number): Promise<any> {
        return super.get(`${process.env.URL}/task/${id}`);
    }

    // Create создание задачи
    public createNewTask(task: Task): Promise<any> {
        return super.post(`${process.env.URL}/task/create`, task);
    }

    // Update изменение задачи
    public updateTask(task: Task): Promise<any> {
        return super.patch(`${process.env.URL}/task/update`, task);
    }

    // Delete удаление задачи
    public deleteTaskById(id: number): Promise<any> {
        return super.delete(`${process.env.URL}/task/${id}`);
    }

}

export default TaskModel.getInstance();