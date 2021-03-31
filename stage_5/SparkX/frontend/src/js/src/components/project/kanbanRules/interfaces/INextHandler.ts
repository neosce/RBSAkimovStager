// Интерфейс Обработчика объявляет метод построения цепочки обработчиков.
export default interface INextHandler {
    // Вызывает обработчик
    nextHandler(): boolean
}
