import ProjectWindowView from './ProjectWindowView';
import EventEmitter from "../../../../helpers/eventEmitter/eventEmitter";
import * as webix from 'webix';
import {$$} from 'webix';
import Employee from "../../../models/entities/employee";
import projectModel from "../../../models/projectModel";
import taskModel from "../../../models/taskModel";
import Task from "../../../models/entities/task";
import TaskKanban from "../../../models/entities/taskKanban";
import Store from "../../../../helpers/store";
import ProjectListEmployeeView from "./ProjectListEmployeeView";
import EmployeeKanban from "../../../models/entities/employeeKanban";
import RulesHandler from "../kanbanRules/rulesHandler";
import NewTaskList from "../kanbanRules/statuses/NewTaskList";
import AppointedTaskList from "../kanbanRules/statuses/AppointedTaskList";
import WorkTaskList from "../kanbanRules/statuses/WorkTaskList";
import DoneTaskList from "../kanbanRules/statuses/DoneTaskList";
import ConsensusTaskList from "../kanbanRules/statuses/ConsensusTaskList";
import Project from "../../../models/entities/project";
import ProjectListNewEmployeeView from "./ProjectListNewEmployeeView";
import SettingsProject from "../../../models/interfaces/settingsProject";
import employeeModel from "../../../models/employeeModel";

export class CProjectWindow {
    private view: any;
    private eventEmitter: EventEmitter;
    // Записываем сотрудника которого хотим добавить глобально
    private employeeAddProject: Employee;

    public init(): void {
        // инициализация используемых представлений
        this.view = {
            projectView: webix.ui.portlet
        };

        // Инициализация событий
        this.eventEmitter = EventEmitter.getInstance();
    }

    public config(): object {
        // определение popup для списка пользователей в проекте
        webix.ui(ProjectListEmployeeView());
        webix.ui(ProjectListNewEmployeeView());

        return ProjectWindowView();
    }

    public attachEvents(): void {
        this.view = {
            projectView: $$('projectView'),
            kanbanProject: $$('kanbanProject'),
            kanbanHeader: $$('kanbanHeader'),
            editorComboExecutorKanban: $$('editorComboExecutorKanban'),
            employeeList: {
                // Управление текущими сотрудниками
                employeeListManager: $$('employeeListManager'),
                showListEmployeesProjectBtn: $$('showListEmployeesProjectBtn'),
                projectListEmployeeView: $$('projectListEmployeeView'), // popup
                searchProjectEmployeeUnitList: $$('searchProjectEmployeeUnitList'), // search data
                projectEmployeeUnitList: $$('projectEmployeeUnitList'), // data
                addListEmployeeProjectBtn: $$('addListEmployeeProjectBtn'),
                // Управление новыми сотрудниками
                projectListNewEmployeeView: $$('projectListNewEmployeeView'),
                searchProjectNewEmployeeUnitList: $$('searchProjectNewEmployeeUnitList'),
                projectNewEmployeeUnitList: $$('projectNewEmployeeUnitList'),
                addProjectNewEmployee: $$('addProjectNewEmployee')
            },
            settingsProject: $$('settingsProject'),
            projectForm: {
                editProjectWindowForm: $$('editProjectWindowForm'),
                saveEditProjectWindowBtn: $$('saveEditProjectWindowBtn'),
                deleteEditProjectWindowBtn: $$('deleteEditProjectWindowBtn'),
            }
        };

        // Переопределение имен En в Rus у элементов kanban и message
        webix.i18n.locales["ru-RU"].kanban = {
            "copy": "Копировать",
            "dnd": "Бросайте файлы сюда",
            "remove": "Удалить",
            "save": "Сохранить",
            "confirm": "Вы собираетесь навсегда удалить эту карточку. Вы уверены?",
            "editor": {
                "add": "Добавить карточку",
                "assign": "Назначить",
                "attachments": "Вложения",
                "color": "Цвет",
                "head": "Редактор",
                "status": "Статус",
                "tags": "Метки",
                "text": "Текст",
                "upload": "Загрузить",
                "edit": "Редактировать"
            },
            "menu": {
                "copy": "Копировать",
                "edit": "Редактировать",
                "remove": "Удалить"
            }
        };
        webix.i18n.locales["ru-RU"].message = {
            ok: "OK",
            cancel: "Отмена"
        };
        webix.i18n.setLocale("ru-RU");

        // Событие перемещения карточек
        this.view.kanbanProject.attachEvent(
            "onBeforeStatusChange",
            (itemId: string, status: string): boolean => {
                // получаем текущую карточку
                const taskKanban: TaskKanban = this.view.kanbanProject.getItem(itemId);

                // Правила перемещения карточек между списками
                const check = new RulesHandler(
                    new NewTaskList(itemId, status, taskKanban),
                    new AppointedTaskList(itemId, status, taskKanban),
                    new WorkTaskList(itemId, status, taskKanban),
                    new DoneTaskList(itemId, status, taskKanban),
                    new ConsensusTaskList(itemId, status, taskKanban),
                ).checkDragTask();

                // Если вернет true отправляем изменения в БД
                if (check) {
                    // Меняем статус (состояние в БД) на новый
                    taskKanban.status = status;
                    this.createOrUpdate(taskKanban);
                }

                return check;
            });

        // Срабатывает после открытия окна Editor и устанавливает значение текущего у задачи executor если есть
        this.view.kanbanProject.attachEvent(
            "onAfterEditorShow",
            (editor: object, taskKanban: TaskKanban): void => {
                CProjectWindow.setExecutorTask(this.view.editorComboExecutorKanban, taskKanban);
            });

        // До добавления новой задачи зададим default поля для TaskKanban
        this.view.kanbanHeader.attachEvent(
            "onBeforeCardAdd",
            (taskKanban: TaskKanban): void => {
                // Получим из хранилища текущего сотрудника и запишем его как автора задачи
                taskKanban.author = Store.getItemInStorage('currentEmployee').login;
                // Также внесем полностью автора в спец поле
                taskKanban._author = Store.getItemInStorage('currentEmployee');
                // Запишем в новую задачу текущий проект
                taskKanban._project = Store.getItemInStorage('currentProject');
                taskKanban.createTime = new Date().toLocaleString();
            });

        // Добавление новой задачи в kanban
        this.view.kanbanProject.attachEvent("onAfterAdd", (id: string | number): void => {
            this.view.kanbanProject.showEditor(this.view.kanbanProject.getItem(id));
        });

        // Валидация данных в edit kanban и отправка данных на сервер
        this.view.kanbanProject.attachEvent(
            "onBeforeEditorAction",
            (action: string, editor: any, taskKanban: TaskKanban): boolean => {
                //Проверка на remove операцию для удаления карточки задачи
                if (action === "remove") {
                    return true;
                }

                // Получим bool значения из выбранного действия пользователя и валидации формы
                const validate = !(action === "save" && !editor.getForm().validate());
                if (validate) {
                    // Получим id webix и найдем исполнителя который указан в Edit в поле combo
                    // Далее запишем его в специальное свойство TaskKanban
                    taskKanban._executor = this.view.kanbanProject.getUsers().getItem(taskKanban.executor);

                    // Вызовем метод для обновления или сохранения данных в БД
                    this.createOrUpdate(taskKanban);
                    return validate
                }

                // Вернем false если не одно из условий не прошло
                return validate;
            }
        );

        // Обновления данных в kanban после удаления
        this.view.kanbanProject.attachEvent("onBeforeDelete", (id: string | number): void => {
            // Получаем ID задачи соответствующий Task ID в БД
            const ID = this.view.kanbanProject.getItem(id).ID;

            // Удаляем задачу из БД
            CProjectWindow.deleteTaskById(ID)
                .then(() => {
                    webix.message("Задача удалена", 'success');

                    // Обновление kanban UI
                    this.view.kanbanProject.refresh();
                })
                .catch(e => (
                    webix.message("Ошибка при удалении", 'error'),
                        console.error(e)
                ));
        });

        // Срабатывает после закрытия редактора Edit kanban
        this.view.kanbanProject.getEditor().attachEvent("onHide", (): void => {
            // Удаляет пустой TaskKanban после закрытия окна редактора
            this.view.kanbanProject.find((taskKanban: TaskKanban) => {
                // Проверка на основное свойство это имя если пустое значит удаляем задачу
                if (taskKanban.text === "") {
                    // id - добавлен будет самим webix,
                    // но компилятор ts в данный момент его не видит так как в описании сущности его нет
                    // @ts-ignore
                    this.view.kanbanProject.remove(taskKanban.id);
                }
            });

            // Отчистить введенные данные после закрытия Edit
            this.view.kanbanProject.getEditor().getForm().clearValidation();
        });

        // Поиск в списке пользователей проекта
        this.view.employeeList.searchProjectEmployeeUnitList.attachEvent(
            "onTimedKeyPress",
            (): void => {
                CProjectWindow.searchList(
                    "value",
                    this.view.employeeList.searchProjectEmployeeUnitList,
                    this.view.employeeList.projectEmployeeUnitList
                );
            }
        );

        // Показать окно для добавления новых сотрудников
        this.view.employeeList.addListEmployeeProjectBtn.attachEvent("onItemClick", (): void => {
            this.view.employeeList.projectListNewEmployeeView.show();
        });

        // Получаем по клику сотрудника для добавления из списка
        this.view.employeeList.projectNewEmployeeUnitList.attachEvent("onItemClick", (id: string): void => {
            this.employeeAddProject = this.view.employeeList.projectNewEmployeeUnitList.getItem(id);
        });

        // Кнопка добавления сотрудника на проект
        this.view.employeeList.addProjectNewEmployee.attachEvent("onItemClick", (): void => {
            if (this.employeeAddProject != null) {
                // Формируем правильного сотрудника
                const employee: Employee = new Employee(
                    this.employeeAddProject.ID,
                    this.employeeAddProject.lastname,
                    this.employeeAddProject.firstname,
                    this.employeeAddProject.middlename,
                    this.employeeAddProject.email,
                    this.employeeAddProject.login,
                    this.employeeAddProject.avatar,
                    this.employeeAddProject.lastIn.toString(),
                    this.employeeAddProject.online
                );

                // Удаляем элемент из списка и обновляем список
                // @ts-ignore
                this.view.employeeList.projectNewEmployeeUnitList.remove(this.employeeAddProject['id']);
                this.view.employeeList.projectNewEmployeeUnitList.refresh();
                this.addNewEmployeeInProject(employee);
            } else {
                webix.message('Сначала нужно выделить сотрудника!', 'error');
            }
        });

        // Поиск в списке всех сотрудников
        this.view.employeeList.searchProjectNewEmployeeUnitList.attachEvent(
            "onTimedKeyPress",
            (): void => {
                CProjectWindow.searchList(
                    "value",
                    this.view.employeeList.searchProjectNewEmployeeUnitList,
                    this.view.employeeList.projectNewEmployeeUnitList
                );
            }
        );

        // Сохранить новые настройки проекта
        this.view.projectForm.saveEditProjectWindowBtn.attachEvent("onItemClick", (): void => {
            this.setCurrentProject();
        });

        // Удаление проекта
        this.view.projectForm.deleteEditProjectWindowBtn.attachEvent("onItemClick", (): void => {
            // Получаем из текущего проекта ID
            const project: Project = Store.getItemInStorage('currentProject');

            // Удаляем проект
            this.deleteProjectById(project.ID);
        });

        // Подписка на событие показа и сокрытие компонента
        this.eventEmitter.on('hideBodyViews', this.hide, this);
        this.eventEmitter.on('showProjectView', this.show, this);

        // Подписка на событие показа и сокрытие Kanban
        this.eventEmitter.on('showKanban', this.showKanban, this);
        this.eventEmitter.on('hideKanbanProject', this.hideKanban, this);

        // Подписка на событие показа и сокрытие настройки
        this.eventEmitter.on('showSettingsProject', this.showSettingsProject, this);
        this.eventEmitter.on('hideKanbanProject', this.hideSettingsProject, this);

        // События отвечающие за обращения к backend и получения данных
        // получение задач
        this.eventEmitter.on('showProjectView', this.getTasksProjectById, this);
        // получение сотрудников по текущему проекту
        this.eventEmitter.on('showProjectView', this.getProjectEmployeesById, this);
        // получение всех сотрудников
        this.eventEmitter.on('showProjectView', this.getEmployeesAll, this);
        // Получение информации о текущем проекте для настроек
        this.eventEmitter.on('showProjectView', this.getCurrentProject, this);

        this.hide();
    }

    // Метод поиска в unitlist
    private static searchList(key: string, search: webix.ui.search, unitList: webix.ui.unitlist): void {
        // Получаем значение поиска
        const value: string = search.getValue();

        // Получаем текущего сотрудника и сравниваем его полученным из поиска
        unitList.filter((employee: any): boolean => {
            return employee[key].toLowerCase().indexOf(value.toLowerCase()) !== -1;
        });
    }

    // Получаем текущие настройки проекта
    private getCurrentProject(): void {
        const project: Project = Store.getItemInStorage('currentProject');

        this.view.projectForm.editProjectWindowForm.setValues({
            "nameProject": project.name,
            "descriptionProject": project.description
        });
    }

    // Устанавливаем новые настройки текущего проекта
    private async setCurrentProject(): Promise<any> {
        // Получение данных с формы
        const currentSettingsProject: SettingsProject = this.view.projectForm.editProjectWindowForm.getValues();

        // TODO: По возможности добавить в проект паттерн строитель для всех сущностей
        // Преобразование данных с формы
        const project: Project = new Project(
            Store.getItemInStorage('currentProject').ID,
            currentSettingsProject.nameProject,
            currentSettingsProject.descriptionProject,
            Store.getItemInStorage('currentProject').teamLead,
            new Date().toJSON(),
            []
        );

        // Проверяем правильность формы и обновляем текущий проект
        if (this.view.projectForm.editProjectWindowForm.validate()) {
            try {
                // Отправка данных в БД
                await CProjectWindow.updateProject(project);
                // Вывод сообщения об успехе
                webix.message('Проект обновлен', 'success');
            } catch (e) {
                webix.message('Не удалось обновить проект', 'error');
                console.error(e);
            }
        } else {
            webix.message('Заполните пожалуйста все данные!', 'error');
        }
    }

    // AttachEmployee метод добавления сотрудника на проект
    private async addNewEmployeeInProject(employee: Employee): Promise<any> {
        try {
            // Отправляем данные в БД
            await projectModel
                .addNewEmployeeInProject(Store.getItemInStorage(
                    'currentProject').ID,
                    employee
                );

            // Обновления списка сотрудников
            await this.getProjectEmployeesById();

            webix.message('Сотрудник добавлен в проект', 'success');
        } catch (e) {
            console.error(e);
            webix.message('Не удалось добавить сотрудника!', 'error');
        }
    }

    // Update изменение проекта
    private static async updateProject(project: Project): Promise<any> {
        return await projectModel.updateProject(project);
    }

    // Delete удаление проекта
    private async deleteProjectById(id: number): Promise<any> {
        try {
            // Удаляем проект
            await projectModel.deleteProjectById(id);

            // Отчищаем хранилище
            Store.setItemInStorage('currentProject', null);

            // Выходим на главную страницу
            this.eventEmitter.emit('hideBodyViews');
            this.eventEmitter.emit('showMainPageView');
            // Делаем вкладку проект недоступной
            this.eventEmitter.emit('onProjectToolbarNavigation');

            webix.message('Проект удален!', 'success');
        } catch (e) {
            webix.message('Невозможно удалить проект!', 'error');
            console.error(e);
        }
    }

    // Получение ID выбранной задачи
    private getSelectTaskIdKanban(): void {
        const taskSelect: Task = Store.getItemInStorage('taskSelect');

        if (taskSelect != null) {
            const taskIdSelect: number | string = this.view.kanbanProject
                .find((arr: Array<TaskKanban>): Array<TaskKanban> => {
                    return arr;
                })
                .filter((t: TaskKanban) => t.ID == taskSelect.ID)[0]['id'];

            // Выделяем выбранную задачу
            this.view.kanbanProject.select(taskIdSelect);
            // После удаляем его из хранилища
            Store.setItemInStorage('taskSelect', null);
        }
    }

    // Добавляет или обновляет задачу в зависимости от наличия задачи в БД
    private async createOrUpdate(taskKanban: TaskKanban): Promise<any> {
        // Получаем задачу
        const task: Task = await CProjectWindow.getTaskById(taskKanban.ID);

        // Превращаем в обычный task
        const updateTask: Task = TaskKanban.getTask(taskKanban);

        // Проверка на наличие задачи в БД
        if (task.ID != 0) {
            // Если задача есть делаем update операцию
            await CProjectWindow.updateTask(updateTask);
        } else {
            // Иначе добавляем новую задачу в БД (create)
            // Записываем всю информацию об авторе
            updateTask.author = Store.getItemInStorage('currentEmployee');
            // отправляем задачу на бэк
            await CProjectWindow.createNewTask(updateTask);
        }

        // Обновляем окно с задачами
        this.eventEmitter.emit('showProjectView');
    }

    // GetByID получение задачи по id
    private static async getTaskById(id: number): Promise<any> {
        // Получаем задачу
        return await taskModel.getTaskById(id);
    }

    // GetTasks получение всех задач по проекту id
    private async getTasksProjectById(): Promise<any> {
        // Получаем массив задач
        const tasks: Array<Task> = await projectModel
            .getTasksProjectById(Store.getItemInStorage('currentProject').ID);

        // Проверка на наличие задач
        if (tasks) {
            // Преобразуем их в специальные задачи kanban
            const taskKanban: Array<TaskKanban> = TaskKanban.getTasksKanban(tasks);

            // Передаем их в отображение
            CProjectWindow.refreshView(this.view.kanbanProject, taskKanban);

            // Выделяет выбранную задачу пользователя если она есть
            this.getSelectTaskIdKanban();
        } else {
            // Говорим пользователю что в проекте пока что нет задач
            webix.message('Список задач пустой', 'info');
            // Отчищаем предыдущий список из задач
            CProjectWindow.refreshView(this.view.kanbanProject, []);
        }
    }

    // Метод для загрузки сотрудников в список пользователей проекта
    private async getProjectEmployeesById(): Promise<any> {
        // Получаем массив сотрудников по проекту
        const employees: Array<Employee> = await projectModel
            .getProjectEmployeesById(Store.getItemInStorage('currentProject').ID);

        // Проверка на наличие сотрудников в списке
        if (employees) {
            // Преобразуем их в специальных сотрудников kanban
            const employeesKanban: Array<EmployeeKanban> = EmployeeKanban.getEmployeesKanban(employees);

            // Передаем их в отображение
            CProjectWindow.refreshView(this.view.employeeList.projectEmployeeUnitList, employeesKanban);
            // kanban usersList
            CProjectWindow.refreshKanbanUsers(this.view.kanbanProject, this.view.editorComboExecutorKanban, employeesKanban);
        } else {
            // Отчищаем предыдущий список из сотрудников
            CProjectWindow.refreshView(this.view.employeeList.projectEmployeeUnitList, []);
            CProjectWindow.refreshKanbanUsers(this.view.kanbanProject, this.view.editorComboExecutorKanban, []);
        }
    }

    // Метод для получения всех пользователей в список добавления пользователей на проект
    private async getEmployeesAll(): Promise<any> {
        // Получаем массив всех сотрудников
        const employees: Array<Employee> = await employeeModel.getEmployeesAll();

        // Получаем массив сотрудников по проекту
        let employeesProject: Array<Employee> = await projectModel
            .getProjectEmployeesById(Store.getItemInStorage('currentProject').ID);
        // Если сотрудников нет в БД, ставим пустой массив
        if (employeesProject == null) {
            employeesProject = [];
        }

        // Отфильтровываем сотрудников которые уже есть в проекте
        const sortEmployees: Array<Employee> = employees.filter(e => {
            if (employeesProject.find(ep => ep.ID === e.ID)) {
                return;
            }
            return e;
        });

        if (sortEmployees.length) {
            // Передаем их в отображение
            CProjectWindow.refreshView(
                this.view.employeeList.projectNewEmployeeUnitList,
                EmployeeKanban.getEmployeesKanban(sortEmployees)
            );
        } else {
            CProjectWindow.refreshView(this.view.employeeList.projectNewEmployeeUnitList, []);
        }
    }

    // Create создание задачи
    private static async createNewTask(task: Task): Promise<any> {
        await taskModel.createNewTask(task);
    }

    // Update изменение задачи
    private static async updateTask(task: Task): Promise<any> {
        await taskModel.updateTask(task);
    }

    // Delete удаление задачи
    private static async deleteTaskById(id: number): Promise<any> {
        return await taskModel.deleteTaskById(id);
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

    // Метод для передачи в kanban usersList
    private static refreshKanbanUsers(kanban: webix.ui.kanban, combo: any, employeesKanban: Array<EmployeeKanban>): void {
        // Отчищаем всех пользователей перед добавлением новых в users kanban
        kanban.getUsers().clearAll();
        combo.getList().clearAll();

        // проверяем массив на пустоту и записываем новые значения если он не пустой
        if (employeesKanban.length) {
            for (const employeeKanban of employeesKanban) {
                kanban.getUsers().add(employeeKanban);
                combo.getList().add(employeeKanban);
            }
        }

        // Обновляем компоненты
        kanban.refresh();
        combo.refresh();
    }

    // Метод для установки пользователей в списке combo
    private static setExecutorTask(combo: webix.ui.combo, taskKanban: TaskKanban) {
        // Получаем список данных из combo элемента Edit kanban
        // @ts-ignore
        const listSelect = combo.getList().data.pull;

        // устанавливаем значение в select combo соответствующее исполнителю (executor)
        for (const key in listSelect) {
            if (listSelect[key]['ID'] == taskKanban.executor) {
                combo.setValue(listSelect[key]['id'])
            }
        }
    }

    // Отобразить окно с kanban
    private showKanban(): void {
        this.view.kanbanProject.show();
        this.view.employeeList.employeeListManager.show();
    }

    // Скрыть окно с kanban
    private hideKanban(): void {
        this.view.kanbanProject.hide();
        this.view.employeeList.employeeListManager.hide();
    }

    // Показать настройки проекта
    private showSettingsProject(): void {
        this.view.settingsProject.show();
    }

    // Скрыть настройки проекта
    private hideSettingsProject(): void {
        this.view.settingsProject.hide();
    }

    // метод отображения окна
    private show(): void {
        this.view.projectView.show();
    }

    // метод сокрытия окна
    private hide(): void {
        this.view.projectView.hide();
    }
}
