import LoginWindowView from "./LoginWindowView";
import Candidate from "../../models/entities/candidate";
import {$$} from 'webix';
import * as webix from 'webix';
import EventEmitter from "../../../helpers/eventEmitter/eventEmitter";
import authModel from "../../models/authModel";
import CToolbar from "../toolbar/CToolbar";
import Employee from "../../models/entities/employee";
import SignUp from "../../models/interfaces/signUp";
import Store from "../../../helpers/store";
import Emogi from "../../../helpers/defaultAvatar";

// компонент окна авторизации
export class CLoginWindow {
    private view: {
        window: webix.ui.window,
        formAuth: {
            form: webix.ui.form,
            confirm: webix.ui.button
        },
        formRegistration: {
            form: webix.ui.form,
            confirm: webix.ui.button
        }
    };
    private eventEmitter: EventEmitter;
    private getEmployee: Function;
    private toolbarView: CToolbar;

    // метод инициализации компонента
    public init(getEmployee: Function, toolbarView: CToolbar): void {
        this.getEmployee = getEmployee;
        this.toolbarView = toolbarView;
        this.eventEmitter = EventEmitter.getInstance();
    }

    // метод получения webix конфигурации компонента
    public config(): Object {
        return LoginWindowView();
    }

    // метод инициализации обработчиков событий компонента
    public attachEvents(): void {
        // инициализация используемых представлений
        this.view = {
            window: $$('loginWindow') as webix.ui.window,
            formAuth: {
                form: $$('loginWindowForm') as webix.ui.form,
                confirm: $$('loginWindowConfirmBtn') as webix.ui.button,
            },
            formRegistration: {
                form: $$('registrationWindowForm') as webix.ui.form,
                confirm: $$('registrationWindowConfirmBtn') as webix.ui.button
            }
        };

        // событие входа в приложение
        this.view.formAuth.confirm.attachEvent('onItemClick', async (): Promise<any> => {
            // Валидация формы
            if (this.view.formAuth.form.validate()) {
                // Получение данных с формы авторизации
                const candidate: Candidate = this.view.formAuth.form.getValues();

                // авторизация пользователя
                this.login(candidate);
            } else {
                webix.message({type: "error", text: "Заполните данные!"});
            }
        });

        // событие регистрации пользователя в приложение
        this.view.formRegistration.confirm.attachEvent(
            'onItemClick',
            async (): Promise<any> => {
            // Валидация формы
            if (this.view.formRegistration.form.validate()) {
                // Получение данных с формы авторизации
                const signUp: SignUp = this.view.formRegistration.form.getValues();

                // Проверка паролей
                if (signUp.password != signUp.confirmPassword) {
                    webix.message({type: "error", text: "Пароли не совпадают!"});
                    return;
                }

                // Создание сущности на основе данных с формы
                const employee: Employee = new Employee(
                    0,
                    signUp.lastName,
                    signUp.firstName,
                    signUp.middleName,
                    signUp.email,
                    signUp.login,
                    Emogi,
                    new Date().toJSON(),
                    false
                );
                employee.password = signUp.password;

                // регистрация пользователя
                this.signUp(employee);
            } else {
                webix.message({type: "error", text: "Заполните данные!"});
            }
        });
    }

    // авторизация пользователя
    private async login(candidate: Candidate): Promise<any> {
        try {
            // Выполняем вход в систему
            await authModel.login(candidate);

            // получаем текущего сотрудника
            await this.getEmployee.call(this.toolbarView);

            // Удаляем проект предыдущего входа из хранилища
            Store.setItemInStorage('currentProject', null);
            Store.setItemInStorage('taskSelect', null);

            // скрываем Login window при успешной авторизации
            this.hide();
            this.eventEmitter.emit('showMainPageView');
        } catch (e) {
            webix.message('Неверный логин или пароль!', 'error');
            console.error(e);
        }
    }

    // регистрация пользователя
    private async signUp(employee: Employee): Promise<any> {
        try {
            // Выполняем регистрацию
            await authModel.registration(employee);
            webix.message('Регистрация завершена!', 'success');

            // Автоматический вход
            await this.login(new Candidate(employee.login, employee.password));
        } catch (e) {
            webix.message('Пользователь уже существует', 'error');
            console.error(e);
        }
    }

    // метод отображения окна
    public show(): void {
        this.view.window.show();
    }

    // метод сокрытия окна
    public hide(): void {
        this.view.window.hide();
    }
}
