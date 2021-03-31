import * as webix from "webix";

export default function (): Object {
    return {
        view: 'window',
        id: 'addProjectModalWindow',
        modal: true,
        head: 'Новый проект',
        width: 450,
        height: 600,
        position: 'top',
        padding: -100,
        body: {
            cols: [
                {
                    rows: [
                        {
                            view: 'form',
                            id: 'addProjectWindowForm',
                            complexData: true,
                            rules: {
                                "name.nameProject": webix.rules.isNotEmpty,
                                "name.descriptionProject": webix.rules.isNotEmpty
                            },
                            elements: [
                                {
                                    view: 'text',
                                    id: 'addProjectNameWindowForm',
                                    label: 'Название проекта',
                                    name: 'name.nameProject',
                                    required: true,
                                    labelWidth: 150,
                                },
                                {
                                    view: 'text',
                                    id: 'addProjectDescriptionWindowForm',
                                    label: 'Описание',
                                    name: 'name.descriptionProject',
                                    required: true,
                                    labelWidth: 100,
                                },
                                {
                                    cols: [
                                        {
                                            view: 'button',
                                            id: 'addModalProjectBtn',
                                            type: "icon",
                                            icon: "mdi mdi-clipboard-plus",
                                            css: 'webix_primary',
                                            value: 'Submit',
                                            label: 'Создать',
                                        },
                                        {
                                            view: 'button',
                                            id: 'closeModalProjectBtn',
                                            type: "icon",
                                            icon: "mdi mdi-close",
                                            css: 'webix_danger',
                                            label: 'Отмена',
                                        },
                                    ]
                                },
                            ],
                        },
                    ]
                },
            ]
        }
    }
}