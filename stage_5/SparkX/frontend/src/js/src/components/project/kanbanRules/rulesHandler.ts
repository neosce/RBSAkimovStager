// Определяет и выполняет цепочку из вызовов и возвращает результат
import INextHandler from "./interfaces/INextHandler";

export default class RulesHandler {
    private readonly handlers: Array<INextHandler>;

    constructor(...args: Array<INextHandler>) {
        this.handlers = args;
    }

    // Запускает цепочку из обработчиков
    checkDragTask(): boolean {
        for (const handler of this.handlers) {
            if (handler.nextHandler()) {
                return true;
            }
        }

        return false;
    }
}
