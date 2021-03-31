import EmployeeKanban from "../../../models/entities/employeeKanban";
import {FormatDate} from "../../../../helpers/dateFormatter";

export default function (): Object {
    return {
        view: "popup",
        id: "projectListEmployeeView",
        height: 450,
        body: {
            rows: [
                {
                    view: "search",
                    id: 'searchProjectEmployeeUnitList',
                    placeholder: "Поиск..",
                    keyPressTimeout: 100 // В данном случае бесполезно так как не идет запрос на сервер
                },
                // Список сотрудников
                {
                    view: "unitlist",
                    id: "projectEmployeeUnitList",
                    data: [],
                    select: true,
                    width: 350,
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
                    uniteBy: function (obj: EmployeeKanban): string {
                        return obj.value.substr(0, 1);
                    },
                    template: "#value#<br>{common.EmployeeKanbanStatusActive()}"
                }
            ]
        }
    }
}
