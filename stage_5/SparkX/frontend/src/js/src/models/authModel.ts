import HttpRequestResponse from "../../helpers/xmlHttpRequest/httpRequestResponse";
import Candidate from "./entities/candidate";
import Employee from "./entities/employee";

class AuthModel extends HttpRequestResponse {
    private static instance: AuthModel;

    private constructor() {
        super();
    }

    // Singleton
    public static getInstance(): AuthModel {
        return !AuthModel.instance
            ? (AuthModel.instance = new AuthModel())
            : AuthModel.instance;
    }

    // Получение сотрудника текущего пользователя
    public async getCurrentEmployee(): Promise<any> {
        return await super.get(`${process.env.URL}/candidate/employee`);
    }

    // Проверка на авторизацию
    public async check(): Promise<any> {
        return await super.get(`${process.env.URL}/candidate/authorize/check`);
    }

    // Регистрация
    public async registration(employee: Employee): Promise<any> {
        return await super.post(`${process.env.URL}/candidate/registration`, employee);
    }

    // Вход в учетную запись
    public async login(candidate: Candidate): Promise<any> {
        return await super.post(`${process.env.URL}/candidate/login`, candidate);
    }

    // Выход из учетной записи
    public async logout(): Promise<any> {
        return await super.get(`${process.env.URL}/candidate/logout`);
    }

}

export default AuthModel.getInstance();