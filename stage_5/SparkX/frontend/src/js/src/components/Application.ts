import MainApplicationView from './ApplicationView';
import {CSidebar} from "./sidebar/CSidebar";
import {CProjectWindow} from './project/projectWindow/CProjectWindow';
import {CLoginWindow} from "./loginWindow/CLoginWindow";
import {CEmployeeWindow} from "./employeeWindow/CEmployeeWindow";
import {CMainPageWindow} from "./mainPageWindow/CMainPageWindow";
import EventEmitter from "../../helpers/eventEmitter/eventEmitter";
import {$$} from 'webix';
import * as webix from 'webix';
import CToolbar from "./toolbar/CToolbar";
import {deleteCookie} from "../../helpers/cookies";
import checkAuth from '../../helpers/checkAuth';
import authModel from "../models/authModel";
import Store from "../../helpers/store";

// главный компонент приложения
export default class Application {
    private view: any;
    private loginWindow: CLoginWindow;
    private projectWindow: CProjectWindow;
    private toolbarView: CToolbar;
    private sidebarView: CSidebar;
    private employeeWindow: CEmployeeWindow;
    private mainPageWindow: CMainPageWindow;
    private eventEmitter: EventEmitter;

    // метод инициализации главного компонента
    init(): void {
        //this.view; // быстрый доступ к объектам представлений
        this.loginWindow = new CLoginWindow; // окно авторизации в приложение
        this.mainPageWindow = new CMainPageWindow;
        this.sidebarView = new CSidebar;
        this.projectWindow = new CProjectWindow;
        this.employeeWindow = new CEmployeeWindow;
        this.toolbarView = new CToolbar;

        this.eventEmitter = EventEmitter.getInstance();

        // инициализация компонента авторизации в приложение
        this.loginWindow.init(
            this.toolbarView.getCurrentEmployee,
            this.toolbarView
        );
        this.mainPageWindow.init();
        this.sidebarView.init();
        this.toolbarView.init(() => {
            deleteCookie('auth-token');
            authModel.logout()
                .then(r=> console.log(r));
            location.replace('/');
        });
        this.projectWindow.init();
        this.employeeWindow.init();
    }

    // метод вызова обработки событий
    attachEvents(): void {
        this.view = {
            mainBody: $$('bodyApp'),
        };

        // вызов обработки событий окна входа в приложение
        this.mainPageWindow.attachEvents();
        this.loginWindow.attachEvents();
        this.sidebarView.attachEvents();
        this.toolbarView.attachEvents();
        this.projectWindow.attachEvents();
        this.employeeWindow.attachEvents();

        // первоначальное состояние приложения
        this.loginWindow.show();

        /* компоненты требующие авторизации
         вызываются через проверку авторизации
         если клиент не авторизован, то эти
         компоненты не будут отрисованы */
        checkAuth((isAuth: boolean): void => {
            isAuth ? (
                this.loginWindow.hide(),
                this.eventEmitter.emit('hideBodyViews'),
                this.eventEmitter.emit('showMainPageView'),
                this.toolbarView.getCurrentEmployee(),
                webix.message(`Добро пожаловать, ${Store.getItemInStorage('currentEmployee').firstname}!`, 'info')
            ) : this.loginWindow.show();
        });
    }

    // метод отрисовки главной конфигурации представления
    config(): Object {
        webix.ui(this.loginWindow.config());

        return MainApplicationView([
                this.mainPageWindow.config(),
                this.sidebarView.config()[0],
                this.projectWindow.config(),
                this.employeeWindow.config()
            ], this.toolbarView.config(this.sidebarView.config()[1]) // config button для toolbar, отвечает за sidebar
        );
    }
};
