// Работа с внутренним хранилищем
export default class Store {
    private constructor() {}

    // Сохраняем необходимое нам значение в постоянное хранилище для быстрого доступа из других компонентов
    public static setItemInStorage(nameKey: string, data: any): void {
        localStorage.setItem(nameKey, JSON.stringify(data));
    }

    // Берем по ключу необходимое значения из localstorage
    public static getItemInStorage(nameKey: string): any {
        return JSON.parse(<string>localStorage.getItem(nameKey));
    }
}
