import INextHandler from "../interfaces/INextHandler";
import TaskKanban from "../../../../models/entities/taskKanban";
import {States} from "../NameTaskList";

// Правила добавления в список карточек "Новая задача"
export default class DoneTaskList implements INextHandler {
    // id карточки kanban
    private readonly itemId: string;
    // новый статус, куда будет перемещена задача
    private readonly status: string;
    // Задача листа, в котором произошло событие
    private readonly taskKanban: TaskKanban;

    constructor (itemId: string, status: string, taskKanban: TaskKanban) {
        this.itemId = itemId;
        this.status = status;
        this.taskKanban = taskKanban;
    }

    // Определяет можно ли перенести карточку из текущего списка в другой
    nextHandler(): boolean {
        // Проверяем принадлежит ли перемещаемая задача текущему статусу (состоянию в БД)
        if (this.taskKanban.status === States.Done_4) {
            // Перемещать никуда нельзя так как выполненные задачи это по сути архив задач
            return false;
        }

        return false;
    }

}
