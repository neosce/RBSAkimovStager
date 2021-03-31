import authModel from "../src/models/authModel";

// функция проверяет авторизованность клиента
// вызывает callback функцию с boolean аргументом - признаком авторизованности
export default function checkAuth(callback: Function): void {
    authModel
        .check()
        .then((isAuthorize) => {
        callback(isAuthorize);
    })
}
