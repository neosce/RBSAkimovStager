// возвращает webix конфигурацию рабочего пространства приложения
import * as webix from 'webix';
import kanban from '../../../../utils/kanban';
import Store from "../../../../helpers/store";
import Project from "../../../models/entities/project";

enum States {
    New_1 = 'Новая задача',
    Appointed_2 = 'Назначена',
    Work_3 = 'В процессе',
    Done_4 = 'Выполненные',
    Consensus_5 = 'Согласование',
}

export default function ProjectWindowView(): Object {
    const users_set: Array<any> = [
        {id: 1, value: 'default', image: ''}
    ];

    const statuses_set = [
        {id: 1, value: 'Обычная', color: "green"},
        {id: 2, value: 'Срочная', color: "orange"},
        {id: 3, value: 'Очень срочная', color: "red"}
    ];

    // Определяет виджет kanban
    kanban();

    return {
        id: 'projectView',
        rows: [
            {
                id: 'employeeListManager',
                type: "wide",
                rows: [
                    {
                        type: "wide",
                        align: "left",
                        cols: [
                            {
                                view: 'button',
                                id: 'showListEmployeesProjectBtn',
                                type: "icon",
                                popup: 'projectListEmployeeView',
                                icon: "mdi mdi-account-details",
                                css: 'webix_primary webix_button',
                                label: 'Список сотрудников',
                            },
                            {
                                view: 'button',
                                id: 'addListEmployeeProjectBtn',
                                type: "icon",
                                icon: "mdi mdi-account-plus",
                                inputWidth: 100,
                                css: 'webix_primary webix_button',
                                label: '',
                            },
                            {},
                            {},
                        ]
                    },
                ]
            },
            {
                id: 'kanbanProject',
                view: "kanban",
                cols: [
                    {
                        rows: [
                            {
                                view: "kanbanheader",
                                label: "Новые",
                                link: "newKanbanTask",
                                id: 'kanbanHeader'
                            },
                            {id: "newKanbanTask", view: "kanbanlist", status: States.New_1}
                        ]
                    },
                    {
                        header: "Назначенные",
                        body: {view: "kanbanlist", status: States.Appointed_2}
                    },
                    {
                        header: "В процессе",
                        body: {view: "kanbanlist", status: States.Work_3}
                    },
                    {
                        header: "Выполненные",
                        body: {view: "kanbanlist", status: States.Done_4}
                    },
                    {
                        header: "Согласование",
                        body: {view: "kanbanlist", status: States.Consensus_5}
                    }
                ],
                userList: true,
                editor: {
                    elements: [
                        {
                            rows: [
                                {
                                    cols: [
                                        {
                                            view: "label",
                                            label: "Автор задачи: ",
                                            align: "left"
                                        },
                                        {
                                            view: "label",
                                            label: "",
                                            name: 'author',
                                            align: "left"
                                        },
                                        {},
                                        {}
                                    ]
                                },
                                {
                                    cols: [
                                        {
                                            view: "label",
                                            label: "Дата создания: ",
                                            align: "left"
                                        },
                                        {
                                            view: "label",
                                            label: "",
                                            name: 'createTime',
                                            align: "left"
                                        },
                                        {},
                                        {}
                                    ]
                                }
                            ]
                        },
                        {
                            margin: 10,
                            rows: [
                                {
                                    view: "textarea",
                                    name: "text",
                                    label: "Название"
                                },
                                {
                                    view: "textarea",
                                    name: "description",
                                    label: "Описание"
                                },
                                {
                                    view: "combo",
                                    name: "color",
                                    label: "Статус задачи",
                                    options: statuses_set
                                },
                                {
                                    view: "combo",
                                    // TODO: Разобраться как получить уникальность для каждой карточки чтобы установить setValue приходящего с бэка исполнителя (executor)
                                    id: 'editorComboExecutorKanban',
                                    name: "executor",
                                    label: "Исполнитель задачи",
                                    options: users_set
                                },
                                {
                                    view: "counter",
                                    name: "planHour",
                                    label: "Планируемое количество часов на задачу",
                                    value: 0
                                },
                                {
                                    view: "counter",
                                    name: "actualHour",
                                    label: "Потрачено часов на задачу",
                                    value: 0
                                },
                            ]
                        }
                    ],
                    rules: {
                        text: webix.rules.isNotEmpty
                    }
                },
                cardActions: true,
                data: [],
                users: users_set,
                colors: statuses_set
            },
            {
                id: 'settingsProject',
                hidden: true,
                cols: [
                    {
                        rows: [
                            {},
                            {
                                cols: [
                                    {},
                                    {
                                        view: "form",
                                        id: 'editProjectWindowForm',
                                        complexData: true,
                                        width: 500,
                                        borderless: true,
                                        rules: {
                                            "nameProject": webix.rules.isNotEmpty,
                                            "descriptionProject": webix.rules.isNotEmpty
                                        },
                                        elements: [
                                            {
                                                view: "fieldset",
                                                label: "Изменить",
                                                body: {
                                                    rows: [
                                                        {
                                                            view: "text",
                                                            label: "Название",
                                                            name: "nameProject",
                                                            required: true,
                                                            labelWidth: 100,
                                                        },
                                                        {
                                                            view: "text",
                                                            label: "Описание",
                                                            name: "descriptionProject",
                                                            required: true,
                                                            labelWidth: 100,
                                                        }
                                                    ]
                                                }
                                            },
                                            {
                                                margin: 5,
                                                rows: [
                                                    {
                                                        view: "button",
                                                        id: "saveEditProjectWindowBtn",
                                                        css: "webix_primary",
                                                        label: "Сохранить изменения",
                                                        type: "icon",
                                                        icon: "mdi mdi-content-save",
                                                        value: 'Submit'
                                                    },
                                                    {
                                                        view: "button",
                                                        id: "deleteEditProjectWindowBtn",
                                                        css: "webix_danger",
                                                        type: "icon",
                                                        icon: "mdi mdi-delete-forever",
                                                        label: "Удалить проект"
                                                    },
                                                ]
                                            }
                                        ]
                                    },
                                    {}
                                ]
                            },
                            {}
                        ]
                    },

                ]
            }
        ],
    }
}
