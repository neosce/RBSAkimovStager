import EmployeeKanban from "../../../models/entities/employeeKanban";
import {FormatDate} from "../../../../helpers/dateFormatter";
import Employee from "../../../models/entities/employee";

export default function (): Object {
    return {
        view: "window",
        id: "projectListNewEmployeeView",
        height: 500,
        width: 650,
        modal: true,
        position: 'top',
        padding: -50,
        head: {
            view: "toolbar", margin: -4, cols: [
                {width: 5},
                {
                    view: "icon",
                    icon: "mdi mdi-account",
                    css: "alter",
                },
                {width: 10},
                {
                    view: "label",
                    label: "Добавление нового сотрудника в текущий проект"
                },
                {
                    view: "icon",
                    icon: "mdi mdi-close",
                    css: "alter",
                    click: function () {
                        this.getTopParentView().hide();
                    }
                }
            ]
        },
        body: {
            rows: [
                // Поиск по сотрудникам
                {
                    view: "search",
                    id: 'searchProjectNewEmployeeUnitList',
                    placeholder: "Поиск.."
                },
                // Список сотрудников
                {
                    view: "unitlist",
                    id: "projectNewEmployeeUnitList",
                    data: [],
                    select: true,
                    padding: 40,
                    scheme: {
                        $sort: {
                            by: "value",
                            dir: "asc"
                        }
                    },
                    type: {
                        height: 70,
                        EmployeeKanbanStatusActive: function (employeeKanban: EmployeeKanban): string {
                            if (employeeKanban.online) {
                                return "Сейчас онлайн"
                            } else {
                                return `Последний вход: ${FormatDate(new Date(employeeKanban.lastIn))}`;
                            }
                        },
                    },
                    uniteBy: function (employeeKanban: EmployeeKanban): string {
                        return employeeKanban.value;
                    },
                    template: "#value#<br>{common.EmployeeKanbanStatusActive()}"
                },
                {
                    view: 'button',
                    id: "addProjectNewEmployee",
                    type: "icon",
                    icon: "mdi mdi-account-plus",
                    css: 'webix_primary',
                    label: 'Добавить',
                }
            ]
        },
        hidden: true
    }
}