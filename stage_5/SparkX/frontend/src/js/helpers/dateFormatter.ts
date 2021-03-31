// функция форматирования даты в человеко-читаемую строку

import * as webix from "webix";

// date: Date
export function FormatDate(date: Date): Date {
    const format = webix.Date.dateToStr("%Y-%m-%d %H:%i", false);

    return format(helpDate(date));
}

// функция форматирования даты с учетом часового пояса
// date: Date
export function GetDate(date: Date) {
    return helpDate(date);
}

function helpDate(date: Date) {
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
}
