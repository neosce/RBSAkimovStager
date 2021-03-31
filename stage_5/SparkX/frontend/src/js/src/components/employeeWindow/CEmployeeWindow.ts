import EmployeeWindowView from './EmployeeWindowView';
import EventEmitter from "../../../helpers/eventEmitter/eventEmitter";
import { $$ } from 'webix';
import Employee from "../../models/entities/employee";
import employeeModel from "../../models/employeeModel";

export class CEmployeeWindow {
    private view: any;
    private eventEmitter: EventEmitter;

    init() {
        this.view = {
            employeeView: String
        };
        this.eventEmitter = EventEmitter.getInstance();
    }

    config(): Object {
        return EmployeeWindowView();
    }

    attachEvents() {
        this.view = {
            employeeView: $$('employeeView'),
            dataTable: {
                listEmployeeDataTable: $$('listEmployeeDataTable'),
            },
        };



        this.eventEmitter.on('hideBodyViews', this.hide, this);
        this.eventEmitter.on('showEmployeeView', this.show, this);
        this.eventEmitter.on('showEmployeeView', this.getEmployeesAll, this);

        this.hide();
    }

    // GetAll получение всех сотрудников
    private async getEmployeesAll(): Promise<any> {
        // Получаем массив всех сотрудников
        const employees: Array<Employee> = await employeeModel.getEmployeesAll();

        // Если сотрудники есть отображаем их в таблице
        if (employees.length) {
            CEmployeeWindow.refreshView(this.view.dataTable.listEmployeeDataTable, employees);
        }
    }

    // метод для обновления виджетов webix
    private static refreshView(view: any, data: Array<any>): void {
        // если данных нет, то загружаем пустой массив
        if (data == null) {
            data = [];
        }
        view.clearAll();
        view.parse(data);
    }

    // метод отображения окна
    private show() {
        this.view.employeeView.show();
    }

    // метод сокрытия окна
    private hide() {
        this.view.employeeView.hide();
    }
}