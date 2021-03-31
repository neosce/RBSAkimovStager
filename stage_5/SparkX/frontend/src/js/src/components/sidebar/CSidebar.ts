import EventEmitter from "../../../helpers/eventEmitter/eventEmitter";
import * as webix from 'webix';
import { $$ } from 'webix';
import SidebarView from "./SidebarView";

export class CSidebar {
    private view: any;
    private eventEmitter: EventEmitter;

    init() {
        this.view = {
            sidebarView: webix.ui.sidebar,
            btnSidebarView: webix.ui.button
        };
        this.eventEmitter = EventEmitter.getInstance();
    }

    config(): Array<object> {
        return SidebarView();
    }

    attachEvents() {
        this.view = {
            sidebarView: $$('sidebarView'),
            btnSidebarView: $$('btnSidebarView'),
        };

        this.eventEmitter.on('hideBodyViews', this.hide, this);
        this.eventEmitter.on('showProjectView', this.show, this);

        this.view.btnSidebarView.attachEvent('onItemClick', () => {
            this.view.sidebarView.toggle();
        });

        // Выбираем необходимый ID для показа нудного элемента webix.ui
        this.view.sidebarView.attachEvent('onAfterSelect', (id: string) => {
            //webix.message("Selected: " + this.view.sidebarView.getItem(id).value + "ID:" + id);
            const ID = this.view.sidebarView.getSelectedId();

            if (ID === 'accordions') {
                this.showKanban();
            } else {
                this.showSettings();
            }
        });

        this.showKanban();
        this.hide();
    }

    showKanban() {
        // Выбираем первый элемент из списка sidebar
        this.view.sidebarView.select('accordions');
        this.eventEmitter.emit('hideKanbanProject');
        this.eventEmitter.emit('showKanban');
    }

    showSettings() {
        // Выбираем второй элемент из списка sidebar
        this.view.sidebarView.select('tables1');
        this.eventEmitter.emit('hideKanbanProject');
        this.eventEmitter.emit('showSettingsProject');
    }

    // метод отображения sidebar
    show() {
        this.view.sidebarView.show();
        this.view.btnSidebarView.show();
    }

    // метод сокрытия sidebar
    hide() {
        this.view.sidebarView.hide();
        this.view.btnSidebarView.hide();
    }
}