export default function EmployeeWindowView(): Object {
    // Определяем формы
    const collapsedForm = {
        width: 400,
        multi: false,
        rows: [
            {
                header: "Регистрация",
                css: "registration",
                collapsed: true,
                body: {
                    rows: [
                        {
                            view: "form",
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
                            ],
                            elementsConfig: {labelAlign: "left", labelWidth: 140}
                        },
                        {
                            padding: 20,
                            css: "blue_row",
                            rows: [
                                {
                                    view: 'button',
                                    id: 'registrationEmployeeWindowBtn',
                                    type: "icon",
                                    align: "center",
                                    height: 50,
                                    icon: "mdi mdi-account-check",
                                    css: 'webix_secondary',
                                    value: 'Submit',
                                    label: 'Зарегистрироваться'
                                },
                                {css: "blue_row"}
                            ]
                        }
                    ]

                }
            },
            {
                header: "Редактировать сотрудника",
                css: "registration",
                collapsed: true,
                body: {
                    rows: [
                        {
                            view: "form",
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
                            ],
                            elementsConfig: {labelAlign: "left", labelWidth: 140}
                        },
                        {
                            padding: 20,
                            css: "blue_row",
                            rows: [
                                {
                                    view: 'button',
                                    id: 'editEmployeeWindowBtn',
                                    type: "icon",
                                    align: "center",
                                    height: 50,
                                    icon: "mdi mdi-account-check",
                                    css: 'webix_secondary',
                                    value: 'Submit',
                                    label: 'Изменить'
                                },
                                {css: "blue_row"}
                            ]
                        }
                    ]

                }
            },
            {}
        ]
    };

    // Определяем таблицу сотрудников
    const listEmployeeUI = {
        rows: [
            {
                view: "tabbar",
                multiview: true,
                selected: "listEmployee",
                options: [
                    {
                        id: "listEmployeeDataTable",
                        value: "Список сотрудников"
                    }
                ]
            },
            {
                view: "multiview",
                cells: [
                    {
                        id: "listEmployeeDataTable",
                        view: "datatable",
                        select: true,
                        columns: [
                            {
                                id: "lastname",
                                header: "Фамилия",
                                width: 150,
                                //fillspace: true
                            },
                            {
                                id: "firstname",
                                header: "Имя",
                                width: 150,
                            },
                            {
                                id: "middlename",
                                header: "Отчество",
                                width: 150,
                            },
                            {
                                id: "email",
                                header: "Email",
                                width: 150,
                            },
                            {
                                id: "login",
                                header: "Логин",
                                width: 150,
                            },
                            {
                                id: "lastIn",
                                header: "Последний вход",
                                width: 150,
                                sort: "date",
                                //format: webix.i18n.fullDateFormatDate
                            },
                            {
                                id: "online",
                                header: "Онлайн",
                                width: 150,
                            },
                            /*{
                                id: "book",
                                header: "Booking",
                                css: "webix_el_button",
                                width: 100,
                                template: "<a href='javascript:void(0)' class='check_flight'>Book now</a>"
                            }*/
                        ],
                        data: []
                    },
                ]
            }
        ]
    };

    return {
        id: 'employeeView',
        cols: [
            {
                type: "space",
                rows: [
                    {
                        type: "wide",
                        cols: [
                            collapsedForm,
                            listEmployeeUI
                        ]
                    }
                ]
            }
        ]
    }
}
