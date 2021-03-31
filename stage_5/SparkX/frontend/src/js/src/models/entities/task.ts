import Employee from "./employee";
import Project from "./project";

export default class Task {
    public ID: number;
    public author: Employee;
    public executor: Employee;
    public project: Project;
    public states: string;
    public status: string;
    public name: string;
    public description: string;
    public planHour: number;
    public actualHour: number;
    public createTime: Date;

    constructor(
        id: number,
        author: Employee,
        executor: Employee,
        project: Project,
        states: string,
        status:  string,
        name: string,
        description: string,
        planHour: number,
        actualHour: number,
        createTime: string
    ) {
        this.ID = id;
        this.author = author;
        this.executor = executor;
        this.project = project;
        this.states = states;
        this.status = status;
        this.name = name;
        this.description = description;
        this.planHour = planHour;
        this.actualHour = actualHour;
        this.createTime = new Date(createTime);
    }
}