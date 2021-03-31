import Employee from "./employee";
import Task from "./task";
import {FormatDate} from "../../../helpers/dateFormatter";
import Project from "./project";

// Специальная сущность для преобразования задачи в задачу для kanban
export default class TaskKanban {
    public static Statuses: Object = {
        'Обычная': 1,
        'Срочная': 2,
        'Очень срочная': 3
    };

    // вспомогательные поля для работы с webix
    public _author: Employee;
    public _executor: Employee;
    public _project: Project;

    public ID: number;
    public author: string;
    public executor: string;
    public status: string;
    public color: number;
    public text: string;
    public description: string;
    public planHour: number;
    public actualHour: number;
    public createTime: string;

    constructor(
        id: number,
        author: Employee,
        executor: Employee,
        project: Project,
        states: string,
        status: string,
        name: string,
        description: string,
        planHour: number,
        actualHour: number,
        createTime: string
    ) {
        this.ID = id;
        this.author = Employee.fullName(author);
        this._author = author;
        this.executor = executor.ID == 0 ? "" : executor.ID.toString();
        this._executor = executor;
        this._project = project;
        this.status = states;
        this.color = TaskKanban.getValueObject<Object>(TaskKanban.Statuses, status);
        this.text = name;
        this.description = description;
        this.planHour = planHour;
        this.actualHour = actualHour;
        this.createTime = FormatDate(new Date(createTime)).toLocaleString();
    }

    // Доп метод для правильного отображения Statuses в kanban
    private static getValueObject<T>(s: T, value: string): any {
        for (const i in s) {
            if (i === value) {
                return s[i];
            }
        }

        return 0;
    }

    // Доп метод для правильного отображения Statuses в kanban
    private static getKeyObject(s: any, value: any): any {
        for (const i in s) {
            if (s[i] == value) {
                return i;
            }
        }

        return '';
    }

    // Преобразование массива задач к задачам для kanban
    public static getTasksKanban(tasks: Array<Task>): Array<TaskKanban> {
        const taskKanban: Array<TaskKanban> = [];

        for (const task of tasks) {
            taskKanban.push(new TaskKanban(
                task.ID,
                task.author,
                task.executor,
                task.project,
                task.states,
                task.status,
                task.name,
                task.description,
                task.planHour,
                task.actualHour,
                task.createTime.toLocaleString()
            ));
        }

        return taskKanban;
    }

    // Возвращает обычный Task
    public static getTask(taskKanban: TaskKanban): Task {
        // Стоит учитывать аномалию в виде не совпадения нового ID
        // с ID остальными полям, но для запроса в БД достаточно правильного ID

        // Превращаем из webix obj kanban в Employee (executor)
        if (taskKanban._executor != null) {
            taskKanban._executor = new Employee(
                taskKanban._executor.ID,
                taskKanban._executor.lastname,
                taskKanban._executor.firstname,
                taskKanban._executor.middlename,
                taskKanban._executor.email,
                taskKanban._executor.login,
                taskKanban._executor.avatar,
                taskKanban._executor.lastIn.toLocaleString(),
                taskKanban._executor.online,
            );
        }

        // Превращаем из webix obj kanban в Project
        if (taskKanban._project != null) {
            taskKanban._project = new Project(
                taskKanban._project.ID,
                taskKanban._project.name,
                taskKanban._project.description,
                taskKanban._project.teamLead,
                taskKanban._project.createTime.toLocaleString(),
                taskKanban._project.tasks,
            )
        }

        // Превращаем из webix obj kanban в Employee (author)
        if (taskKanban._author) {
            taskKanban._author = new Employee(
                taskKanban._author.ID,
                taskKanban._author.lastname,
                taskKanban._author.firstname,
                taskKanban._author.middlename,
                taskKanban._author.email,
                taskKanban._author.login,
                taskKanban._author.avatar,
                taskKanban._author.lastIn.toLocaleString(),
                taskKanban._author.online,
            );
        }

        // Удаление webix id иначе БД иначе бд начинает считывать его
        // @ts-ignore
        //delete taskKanban._project['id'];

        return new Task(
            taskKanban.ID,
            taskKanban._author,
            taskKanban._executor,
            taskKanban._project,
            taskKanban.status,
            TaskKanban.getKeyObject(TaskKanban.Statuses, taskKanban.color),
            taskKanban.text,
            taskKanban.description,
            taskKanban.planHour,
            taskKanban.actualHour,
            taskKanban.createTime
        );
    }
}