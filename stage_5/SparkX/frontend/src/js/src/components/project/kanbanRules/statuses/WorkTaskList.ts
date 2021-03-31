import INextHandler from "../interfaces/INextHandler";
import TaskKanban from "../../../../models/entities/taskKanban";
import {States} from "../NameTaskList";

// Правила добавления в список карточек "Новая задача"
export default class WorkTaskList implements INextHandler {
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
        if (this.taskKanban.status === States.Work_3) {
            if (this.status === States.Done_4 && (this.taskKanban.actualHour !== 0)) {
                return true;
            }

            if (this.status === States.Consensus_5 && (this.taskKanban.description !== "")) {
                return true;
            }
        }

        return false;
    }

}