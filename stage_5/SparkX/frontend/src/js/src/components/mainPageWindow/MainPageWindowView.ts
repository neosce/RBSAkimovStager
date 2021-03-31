import * as webix from "webix";
import Project from "../../models/entities/project";
import {FormatDate} from "../../../helpers/dateFormatter";
import Task from "../../models/entities/task";

export default function (): Object {

    //"<div style='padding-left:1px'>Всего задач: {common.CountTasks()}</div>"
    const cellsProjects = [
        {
            header: "<span class='webix_icon mdi mdi-pot-steam-outline'></span> Тимлид",
            body: {
                view: "list",
                id: 'cellsProjectsTeamLead',
                template: "#name# <br> Описание: #description#, <br> Дата создания: {common.ProjectDate()}",
                type: {
                    height: 150,
                    //itemIcon:"<span class='webix_icon mdi mdi-film'></span>",
                    ProjectDate: function (project: Project): Date {
                        return FormatDate(new Date(project.createTime));
                    },
                    // Вспомогательная функция для нумерации списков
                    CountTasks: function (project: Project): number {
                        return 1;
                    }
                },
                select: true,
                data: []
            }
        },
        {
            header: "<span class='webix_icon mdi mdi-microsoft-teams'></span> Участник",
            body: {
                view: "list",
                id: 'cellsProjectsParticipant',
                template: "#name# <br> Описание: #description# <br> Тимлид: {common.TeamLead()} <br> Дата создания: {common.ProjectDate()}",
                type: {
                    height: 150,
                    ProjectDate: function (project: Project): Date {
                        return FormatDate(new Date(project.createTime));
                    },
                    TeamLead: function (project: Project): string {
                        //console.log(project);
                        return ''
                    }
                },
                select: true,
                data: []
            }
        },
    ];

    const cellsTasks = [
        {
            header: "<span class='webix_icon mdi mdi-account-hard-hat'></span> В работе",
            body: {
                view: "list",
                id: 'cellsTasksInWork',
                template: "#name# <div style='padding-left:1px'> Описание: #description#, <div style='padding-left:1px'>Автор задачи: {common.Author()} <div style='padding-left:1px'> Дата создания: {common.Date()}",
                css: "webix_dark",
                type: {
                    height: 150,
                    Date: function (task: Task): Date {
                        return FormatDate(new Date(task.createTime));
                    },
                    Author: function (task: Task): string {
                        return `${task.author.lastname} ${task.author.firstname} ${task.author.middlename}`;
                    }
                },
                select: true,
                data: []
            }
        },
        {
            header: "<span class='webix_icon mdi mdi-account-network-outline'></span> Назначенные",
            body: {
                view: "list",
                id: 'cellsTasksNominated',
                template: "#name# <div style='padding-left:1px'> Описание: #description#, <div style='padding-left:1px'>Автор задачи: {common.Author()} <div style='padding-left:1px'> Дата создания: {common.Date()}",
                css: "webix_dark",
                type: {
                    height: 150,
                    Date: function (task: Task): Date {
                        return FormatDate(new Date(task.createTime));
                    },
                    Author: function (task: Task): string {
                        return `${task.author.lastname} ${task.author.firstname} ${task.author.middlename}`;
                    }
                },
                select: true,
                data: []
            }
        },
    ];

    return {
        id: "mainPageView",
        type: "space",
        cols: [
            {
                type: "wide", rows: [
                    {
                        cols: [
                            {type: "header", template: "Проекты"},
                            {
                                view: 'button',
                                id: 'addProjectBtn',
                                type: "icon",
                                icon: "mdi mdi-clipboard-plus",
                                width: 235,
                                css: 'webix_primary webix_button',
                                label: 'Создать новый проект',
                            },
                        ]
                    },
                    {
                        view: "tabview",
                        cells: cellsProjects,
                        multiview: {fitBiggest: true, animate: true}
                    },
                ]
            },
            {
                type: "wide", rows: [
                    {type: "header", template: "Текущие задачи"},
                    {
                        view: "tabview",
                        cells: webix.copy(cellsTasks),
                        multiview: {fitBiggest: true, animate: true}
                    },
                ]
            }
        ]
    };
};
