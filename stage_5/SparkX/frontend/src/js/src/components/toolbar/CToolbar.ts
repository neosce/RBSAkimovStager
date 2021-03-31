import Employee from "../../models/entities/employee";
import ToolbarView from "./ToolbarView";
import PopupView from "./PopupView";
import * as webix from "webix";
import {$$} from "webix";
import EventEmitter from "../../../helpers/eventEmitter/eventEmitter";
import authModel from "../../models/authModel";
import Store from "../../../helpers/store";

// Навигация по окнам приложения
enum ToolbarNavigation {
    Main = "1",
    Project = "2",
    Employee = "3",
}

export default class CToolbar {
    private view: any; // быстрый доступ к представлениям компонента
    private currentEmployee: Employee; // сотрудник, соответствующий текущему пользователю
    private onLogout: Function; // callback функция при логауте пользователя
    private eventEmitter: EventEmitter;

    // метод инициализации компонента
    public init(onLogout: Function): void {
        this.onLogout = onLogout;

        this.eventEmitter = EventEmitter.getInstance();
    }

    // метод получения webix конфигурации компонента
    public config(buttonMenu: Object): Object {
        webix.ui(PopupView());

        return ToolbarView(buttonMenu);
    }

    // метод инициализации обработчиков событий компонента
    public attachEvents(): void {
        // инициализация используемых представлений
        this.view = {
            menuHeader: $$('menuHeader'),
            logoutBtn: $$('logoutBtn'),
            userInfoLabel: $$('userInfoLabel'),
            userAvatar: $$('userAvatar'),
            userLabel: $$('userLabel'),
            toolbar: {
                main: $$('ToolbarMain'),
                project: $$('ToolbarProject'),
                employees: $$('ToolbarEmployees'),
            },
            popup: {
                popupToolbar: $$('popupToolbar'),
            }
        };

        this.view.userAvatar.attachEvent('onItemClick', () => {
            $$('popupToolbar').show();
        });

        this.view.menuHeader.attachEvent('onMenuItemClick', (id: string) => {
            switch (id) {
                case ToolbarNavigation.Main:
                    this.eventEmitter.emit('hideBodyViews');
                    this.eventEmitter.emit('showMainPageView');
                    //this.view.menuHeader.addCss(id, "webix_selected");
                    //this.view.menuHeader.select(id);
                    //console.log(this.view.menuHeader.isSelected())
                    break;
                case ToolbarNavigation.Project:
                    this.eventEmitter.emit('hideBodyViews');
                    this.eventEmitter.emit('showProjectView');
                    break;
                case ToolbarNavigation.Employee:
                    this.eventEmitter.emit('hideBodyViews');
                    this.eventEmitter.emit('showEmployeeView');
                    break;
                default:
                    break;
            }
        });

        // выход
        this.view.logoutBtn.attachEvent('onItemClick', () => {
            this.onLogout();
        })

        // Создание события доступа к странице проект
        this.eventEmitter.on('onProjectToolbarNavigation', this.setProjectToolbarNavigation, this);
    }

    // функция обновления информации о текущем пользователе
    private refreshEmployeeLabel(employee: Employee): void {
        // Обновляет подпись пользователя
        this.view.userLabel.define('label', employee.login);
        this.view.userLabel.refresh();

        // Обновляет меню пользователя
        this.view.userInfoLabel.setValue(Employee.fullName(employee));
        this.view.userInfoLabel.refresh();

        // Обновляет аватар пользователя
        this.view.userAvatar.define('template', `<image class="mainphoto" src="${employee.avatar}">`);
        this.view.userAvatar.refresh();

        this.setProjectToolbarNavigation();
    }

    // Установка доступа к странице проект
    private setProjectToolbarNavigation(): void {
        // Если хранилище не пустое, то разблокируем элемент иначе блок
        Store.getItemInStorage('currentProject') != null
            ? this.view.menuHeader.enableItem(ToolbarNavigation.Project)
            : this.view.menuHeader.disableItem(ToolbarNavigation.Project);
    }

    // Получаем информацию о текущем пользователе
    public async getCurrentEmployee(): Promise<any> {
        // отложенное обновление информации о пользователе
        const employee = await authModel.getCurrentEmployee();

        if (!employee) {
            webix.message('Не удалось получить сотрудника!', 'error');
            return;
        }

        // Для удобного доступа к текущему сотруднику из других компонентов сохраним его в localstorage
        Store.setItemInStorage('currentEmployee', employee);

        this.currentEmployee = employee;
        this.refreshEmployeeLabel(this.currentEmployee);
    }
}