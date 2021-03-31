import IHttpRequestResponse from "./interfaces/IHttpRequestResponse";
import * as webix from "webix";

enum httpConst {
    ResponseType = "json",
    Text = "text/plain",
    Json = "application/json",
    Success = "success",
    Failed = "failed",
    Error = "error",
    Get = "GET",
    Post = "POST",
    Put = "PUT",
    Patch = "PATCH",
    Delete = "DELETE",
}

// вспомогательный класс для совершения запросов
export default class HttpRequestResponse {
    constructor() {}

    protected async get(url: string) {
        return await this.xhr({
            method: httpConst.Get,
            url,
            body: null,
            responseType: httpConst.Json,
            success: httpConst.Success,
            failed: httpConst.Failed,
            error: httpConst.Error
        });
    }

    protected async post(url: string, body: any = null) {
        return await this.xhr({
            method: httpConst.Post,
            url,
            body,
            responseType: httpConst.Json,
            success: httpConst.Success,
            failed: httpConst.Failed,
            error: httpConst.Error
        });
    }

    protected async put(url: string, body: any = null) {
        return await this.xhr({
            method: httpConst.Put,
            url,
            body,
            responseType: httpConst.Json,
            success: httpConst.Success,
            failed: httpConst.Failed,
            error: httpConst.Error
        });
    }

    protected async patch(url: string, body: any = null) {
        return await this.xhr({
            method: httpConst.Patch,
            url,
            body,
            responseType: httpConst.Json,
            success: httpConst.Success,
            failed: httpConst.Failed,
            error: httpConst.Error
        });
    }

    protected async delete(url: string) {
        return await this.xhr({
            method: httpConst.Delete,
            url,
            body: null,
            responseType: httpConst.Json,
            success: httpConst.Success,
            failed: httpConst.Failed,
            error: httpConst.Error
        });
    }

    private xhr(options: IHttpRequestResponse) {
        return new Promise(function (res, rej) {
            const xhr = new XMLHttpRequest();

            xhr.open(options.method, options.url);

            xhr.responseType = 'json';
            xhr.onload = () => {
                // проверка статуса HTTP запроса
                if (!(xhr.status >= 200 && xhr.status < 400)) {
                    webix.message(xhr.status + ': ' + xhr.statusText, options.error);
                    rej();
                } else {
                    if (!xhr.response) {
                        return
                    }
                    // валидация статуса ответа сервера
                    if (!xhr.response.status) {
                        webix.message('Не удалось совершить запрос', options.error);
                        console.error(`${options.method} xhr.response.status is ${xhr.response.status}`);
                        rej();
                    }

                    // проверка статуса ответа сервера
                    switch (xhr.response.status) {
                        case options.success: // положительный результат запроса
                            res(xhr.response.data);
                            return;
                        case options.failed: // отрицательный результат запроса
                            webix.message('Не удалось совершить запрос', options.error);
                            console.error(`${options.method} ${xhr.response.error}`);
                            rej();
                            return;
                        default: // ошибка при получении результата запроса
                            webix.message('Не удалось совершить запрос', options.error);
                            console.error(`${options.method} Статус ответа сервера не соответствует ожидаемым значениям, xhr.response.status is ${xhr.response.status}`);
                            rej();
                            return
                    }
                }
            };

            options.body != undefined ? xhr.send(JSON.stringify(options.body)) : xhr.send();
        });
    }
}
