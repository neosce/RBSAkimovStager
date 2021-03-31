import Employee from './employee';
import Task from "./task";

export default class Project {
    public ID: number;
    public name: string;
    public description: string;
    public teamLead: Employee;
    public createTime: Date;
    public tasks: Array<Task>;

    constructor(
        id: number,
        name: string,
        description: string,
        teamLead: Employee,
        createTime: string,
        tasks: Array<Task>
    ) {
        this.ID = id;
        this.name = name;
        this.description = description;
        this.teamLead = teamLead;
        this.createTime = new Date(createTime);
        this.tasks = tasks;
    }
}