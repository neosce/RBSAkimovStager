import * as webix from "webix";
import HelpWindowView from "./HelpWindowView";

// возвращает webix конфигурацию окна авторизации
export default function LoginWindowView(): Object {
    // Формирование формы авторизации и регистрации
    const formsConfig = [
        {
            header: "Вход",
            body: {
                view: 'form',
                id: 'loginWindowForm',
                complexData: true,
                elements: [
                    {
                        view: 'text',
                        label: 'Логин',
                        name: 'login',
                        required: true,
                        placeholder: "login",
                        labelWidth: 100
                    },
                    {
                        view: 'text',
                        label: 'Пароль',
                        type: 'password',
                        name: 'password',
                        placeholder: "********",
                        required: true,
                        labelWidth: 100
                    },
                    {
                        view: 'button',
                        id: 'loginWindowConfirmBtn',
                        type: "icon",
                        icon: "mdi mdi-login-variant",
                        css: 'webix_primary',
                        value: 'Submit',
                        label: 'Вход'
                    },
                ],
                rules: {
                    "login": webix.rules.isNotEmpty,
                    "password": webix.rules.isNotEmpty
                }
            }
        },
        {
            header: "Регистрация",
            body: {
                view: 'form',
                id: 'registrationWindowForm',
                complexData: true,
                elements: [
                    {
                        view: 'text',
                        label: 'Имя',
                        name: 'firstName',
                        required: true,
                        labelWidth: 100,
                        placeholder: "Иван",
                    },
                    {
                        view: 'text',
                        label: 'Фамилия',
                        name: 'lastName',
                        required: true,
                        labelWidth: 100,
                        placeholder: "Иванов",
                    },
                    {
                        view: 'text',
                        label: 'Отчество',
                        name: 'middleName',
                        required: true,
                        labelWidth: 100,
                        placeholder: "Иванович",
                    },
                    {
                        view: 'text',
                        label: 'Логин',
                        name: 'login',
                        required: true,
                        labelWidth: 100,
                        placeholder: "login",
                    },
                    {
                        view: 'text',
                        label: 'Email',
                        name: 'email',
                        required: true,
                        labelWidth: 100,
                        placeholder: "login@mail.ru",
                    },
                    {
                        view: 'text',
                        label: 'Пароль',
                        type: 'password',
                        name: 'password',
                        required: true,
                        labelWidth: 100,
                        placeholder: "********"
                    },
                    {
                        view: 'text',
                        label: 'Подтверждение пароля',
                        type: 'password',
                        name: 'confirmPassword',
                        required: true,
                        labelWidth: 100,
                        placeholder: "********"
                    },
                    {
                        view: 'button',
                        id: 'registrationWindowConfirmBtn',
                        type: "icon",
                        icon: "mdi mdi-account-check",
                        css: 'webix_secondary',
                        value: 'Submit',
                        label: 'Зарегистрироваться'
                    },
                ],
                rules: {
                    "firstName": webix.rules.isNotEmpty,
                    "lastName": webix.rules.isNotEmpty,
                    "middleName": webix.rules.isNotEmpty,
                    "login": webix.rules.isNotEmpty,
                    "email": webix.rules.isEmail,
                    "password": webix.rules.isNotEmpty,
                    "confirmPassword": webix.rules.isNotEmpty
                }
            }
        },
    ];

    // Создание правой части окна с картинкой
    HelpWindowView();

    return {
        view: 'window',
        id: 'loginWindow',
        fullscreen: true,
        modal: true,
        headHeight: 0,
        position: 'top',
        css: 'main_window',
        body: {
            cols: [
                {
                    rows: [
                        {},
                        {
                            cols: [
                                {},
                                {
                                    view: "tabview",
                                    minWidth: 400,
                                    cells: formsConfig,
                                    multiview: {
                                        animate: {
                                            subtype: "horizontal"
                                        }
                                    }
                                },
                                {},
                            ]
                        },
                        {},
                    ]
                },
                {
                    css: 'login_frame',
                    rows: [
                        {
                            view: "template",
                            content: "frameArea"
                        }
                    ]
                }
            ]
        }
    }
}
