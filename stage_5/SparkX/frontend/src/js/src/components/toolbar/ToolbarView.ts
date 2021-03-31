import Store from "../../../helpers/store";
import Employee from "../../models/entities/employee";

export default function (buttonMenu: object): Object {
    const menuData = [
        {id: "1", value: "Главная"},
        {id: "2", value: "Проект"},
        {id: "3", value: "Сотрудники"}
    ];

    const menu = {
        view: "menu",
        id: "menuHeader",
        data: menuData,
        type: {
            subsign: true
        }
    };

    return {
        view: "toolbar",
        padding: 3,
        css: "webix_dark",
        elements: [
            buttonMenu,
            {width: 10},
            {css: "logo", width: 40},
            {view: "label", label: "SparkX", width: 70, align: "center"},
            menu,
            {},
            // Меню пользователя
            {
                id: 'userLabel',
                view: "label",
                label: "sergo",
                align: "right"
            },
            {
                id: 'userAvatar',
                view: "button",
                template: `<image class="mainphoto" src="">`,
                width: 45,
                borderless: true,
                batch: "default",
                popup: "popupToolbar",
            }
        ]
    }
}