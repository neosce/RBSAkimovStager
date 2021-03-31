import EventEmitter from "../../../helpers/eventEmitter/eventEmitter";
import * as webix from 'webix';
import {$$} from 'webix';
import MainPageWindowView from "./MainPageWindowView";
import employeeModel from "../../models/employeeModel";
import Employee from "../../models/entities/employee";
import Project from "../../models/entities/project";
import Task from "../../models/entities/task";
import ModalView from "./ModalView";
import projectModel from "../../models/projectModel";
import Store from "../../../helpers/store";

// Состояния задач
enum States {
    New_1 = 'Новая задача',
    Appointed_2 = 'Назначена',
    Work_3 = 'В процессе',
    Done_4 = 'Выполненные',
    Consensus_5 = 'Согласование',
}

export class CMainPageWindow {
    private view: any;
    private eventEmitter: EventEmitter;

    // метод инициализации компонента
    init(): void {
        this.view = {
            mainPageView: webix.ui.dataview
        };
        this.eventEmitter = EventEmitter.getInstance();
    }

    config(): Object {
        // Конфигурация модального окна для добавления нового проекта
        webix.ui(ModalView());

        // Основная конфигурация
        return MainPageWindowView();
    }

    attachEvents(): void {
        this.view = {
            mainPageView: $$('mainPageView'),
            addProjectBtn: $$('addProjectBtn'),
            modal: {
                addProjectWindowForm: $$('addProjectWindowForm'),
                addProjectModalWindow: $$('addProjectModalWindow'),
                addModalProjectBtn: $$('addModalProjectBtn'),
                addProjectNameWindowForm: $$('addProjectNameWindowForm'),
                addProjectDescriptionWindowForm: $$('addProjectDescriptionWindowForm'),
                closeModalProjectBtn: $$('closeModalProjectBtn'),
            },
            listView: {
                cellsProjectsTeamLead: $$('cellsProjectsTeamLead') as webix.ui.list,
                cellsProjectsParticipant: $$('cellsProjectsParticipant'),
                cellsTasksInWork: $$('cellsTasksInWork'),
                cellsTasksNominated: $$('cellsTasksNominated')
            }
        };

        // Показ модального окна для добавления проекта
        this.view.addProjectBtn.attachEvent('onItemClick', () => {
            this.view.modal.addProjectModalWindow.show();
        });
        // Кнопка отправки данных на сервер для добавления нового проекта
        this.view.modal.addModalProjectBtn.attachEvent('onItemClick', () => {
            // Проверка формы на введенные данные
            if (this.view.modal.addProjectWindowForm.validate()) {
                // Создаем новый проект
                this.createNewProject();
                // Закрываем модальное окно
                this.view.modal.addProjectModalWindow.hide();
                // Очищаем данные формы
                this.view.modal.addProjectWindowForm.clear();
                // Обновляем данные в компонентах
                this.eventEmitter.on('showMainPageView', this.show, this);

                webix.message({type: "success", text: "Проект успешно создан"});
            } else {
                webix.message({type: "error", text: "Заполните данные!"});
            }
        });

        // Кнопка закрытия модального окна для добавления проекта
        this.view.modal.closeModalProjectBtn.attachEvent('onItemClick', () => {
            // Закрываем модальное окно
            this.view.modal.addProjectModalWindow.hide();
            // Очищаем данные формы
            this.view.modal.addProjectWindowForm.clear();
        });

        // Получение проект тимлида по выбранному элементу списка
        this.view.listView.cellsProjectsTeamLead.attachEvent("onSelectChange", (id: string): void => {
            // Получение проекта по выделению
            const projectSelect: Project = this.view.listView.cellsProjectsTeamLead.getSelectedItem();

            // Получение из БД полной информации о проекте с указанным тимлидом
            CMainPageWindow.getProjectById(projectSelect.ID);
        });

        // По двойному клику открываем выбранный проект
        this.view.listView.cellsProjectsTeamLead.attachEvent("onItemDblClick", (): void => {
            // По событию показываем нужное окно
            this.eventEmitter.emit('hideBodyViews');
            this.eventEmitter.emit('showProjectView');
        });

        // Получение проекта участника по выбранному элементу списка
        this.view.listView.cellsProjectsParticipant.attachEvent("onSelectChange", (): void => {
            const projectSelect: Project = this.view.listView.cellsProjectsParticipant.getSelectedItem();

            // Получение из БД полной информации о проекте с указанным тимлидом
            CMainPageWindow.getProjectById(projectSelect.ID);
        });

        // По двойному клику открываем выбранный проект
        this.view.listView.cellsProjectsParticipant.attachEvent("onItemDblClick", (id: string): void => {
            // По событию показываем нужное окно
            this.eventEmitter.emit('hideBodyViews');
            this.eventEmitter.emit('showProjectView');
        });

        // Получение данных о задаче
        this.view.listView.cellsTasksInWork.attachEvent("onSelectChange", (): void => {
            const taskSelect: Task = this.view.listView.cellsTasksInWork.getSelectedItem();

            // Пишем ID элемента выбора соответствующей задачи в kanban
            Store.setItemInStorage('taskSelect', taskSelect);

            // Получение из БД полной информации о проекте с указанным тимлидом
            CMainPageWindow.getProjectById(taskSelect.project.ID);
            webix.message(`Проект по задаче загружен`, 'success');
        });

        // По двойному клику открываем выбранный проект
        this.view.listView.cellsTasksInWork.attachEvent("onItemDblClick", (): void => {
            // По событию показываем нужное окно
            this.eventEmitter.emit('hideBodyViews');
            this.eventEmitter.emit('showProjectView');
        });

        // Получение данных о задаче
        this.view.listView.cellsTasksNominated.attachEvent("onSelectChange", (): void => {
            const taskSelect: Task = this.view.listView.cellsTasksNominated.getSelectedItem();

            // Пишем ID элемента выбора соответствующей задачи в kanban
            Store.setItemInStorage('taskSelect', taskSelect);

            // Получение из БД полной информации о проекте с указанным тимлидом
            CMainPageWindow.getProjectById(taskSelect.project.ID);
            webix.message(`Проект по задаче загружен`, 'success');
        });

        // По двойному клику открываем выбранный проект
        this.view.listView.cellsTasksNominated.attachEvent("onItemDblClick", (id: string): void => {
            // По событию показываем нужное окно
            this.eventEmitter.emit('hideBodyViews');
            this.eventEmitter.emit('showProjectView');
        });

        // События показа главного экрана
        this.eventEmitter.on('hideBodyViews', this.hide, this);
        this.eventEmitter.on('showMainPageView', this.show, this);

        // События отвечающие за обращения к backend и получения данных
        this.eventEmitter.on('showMainPageView', this.getTeamLeadProjects, this);
        this.eventEmitter.on('showMainPageView', this.getEmployeeProjectsById, this);
        this.eventEmitter.on('showMainPageView', this.getEmployeeTasksById, this);

        // Скрываем компонент после инициализации
        this.hide();
    }

    // Create создание проекта
    private async createNewProject(): Promise<any> {
        // получим из хранилища текущего сотрудника
        const currentEmployee: Employee = Store.getItemInStorage('currentEmployee');

        try {
            await projectModel.createNewProject(new Project(
                0,
                this.view.modal.addProjectNameWindowForm.getValue(),
                this.view.modal.addProjectDescriptionWindowForm.getValue(),
                currentEmployee,
                new Date().toJSON(),
                []
            ));

            // Обновляем страницу
            this.eventEmitter.on('showMainPageView', this.show, this);
        } catch (e) {
            console.error(e);
            webix.message('Невозможно создать проект', 'error');
        }
    }

    // GetByID получение проекта по id
    private static async getProjectById(id: number): Promise<any> {
        try {
            // Получение из БД полной информации о проекте с указанным тимлидом
            const project: Project = await projectModel.getProjectById(id);

            // Записываем проект в хранилище (теперь он доступен глобально по всему проекту)
            Store.setItemInStorage('currentProject', project);
            // Разблокируем элемент меню Toolbar'a
            // @ts-ignore
            $$('menuHeader').enableItem("2");
            webix.message(`Проект загружен`, 'success');
        } catch (e) {
            console.error(e);
            webix.message('Возможно проект был удален', 'error');
        }
    }

    // Получение всех проектов тимлида
    private async getTeamLeadProjects(): Promise<any> {
        // Получим из хранилища текущего сотрудника
        const currentEmployee: Employee = Store.getItemInStorage('currentEmployee');

        // Осуществим загрузку данных с БД
        const projects: Array<Project> = await employeeModel.getTeamLeadProjectsById(currentEmployee.ID);

        // Обновим компоненты
        CMainPageWindow.refreshView(this.view.listView.cellsProjectsTeamLead, projects);
    }

    // Получение всех проектов сотрудника как участника
    private async getEmployeeProjectsById(): Promise<any> {
        // Получим из хранилища текущего сотрудника
        const currentEmployee: Employee = Store.getItemInStorage('currentEmployee');
        // TODO: Организовать на бэке получение teamLead'а
        const projects: Array<Project> = await employeeModel.getEmployeeProjectsById(currentEmployee.ID);

        CMainPageWindow.refreshView(this.view.listView.cellsProjectsParticipant, projects);
    }

    // Получение всех задач сотрудника
    private async getEmployeeTasksById(): Promise<any> {
        const tasksInWork: Array<Task> = [];
        const tasksAppointed: Array<Task> = [];

        // Получим из хранилища текущего сотрудника
        const currentEmployee: Employee = Store.getItemInStorage('currentEmployee');

        // Загрузим все его задачи из БД
        const tasks: Array<Task> = await employeeModel.getEmployeeTasksById(currentEmployee.ID);

        // Разбиваем на 2 типа задач назначенные и в процессе
        if (tasks != null) {
            tasksInWork.push(...tasks.filter(t => t.states == States.Work_3));
            tasksAppointed.push(...tasks.filter(t => t.states == States.Appointed_2));
        }

        CMainPageWindow.refreshView(this.view.listView.cellsTasksInWork, tasksInWork);
        CMainPageWindow.refreshView(this.view.listView.cellsTasksNominated, tasksAppointed);
    }

    // Метод для обновления виджетов webix
    private static refreshView(view: any, data: Array<any>): void {
        // если данных нет, то загружаем пустой массив
        if (data == null) {
            data = [];
        }
        view.clearAll();
        view.parse(data);
    }

    // Метод отображения окна
    private show(): void {
        this.view.mainPageView.show();
    }

    // Метод сокрытия окна
    private hide(): void {
        this.view.mainPageView.hide();
    }
}

