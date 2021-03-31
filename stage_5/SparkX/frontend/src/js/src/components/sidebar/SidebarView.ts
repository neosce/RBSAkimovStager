export default function SidebarView(): Array<object> {
    /*const sidebarData = [
        {
            id: "layouts", icon: "mdi mdi-view-column", value: "Layouts", data: [
                {id: "accordions", value: "Accordions"},
                {id: "portlets", value: "Portlets"}
            ]
        },
        {
            id: "tables", icon: "mdi mdi-cog", value: "Data Tables", data: [
                {id: "tables1", value: "Datatable"},
                {id: "tables2", value: "TreeTable"},
                {id: "tables3", value: "Pivot"}
            ]
        }
    ];*/
    const sidebarData = [
        {id: "accordions", value: "Доска задач", icon: "mdi mdi-view-column"},
        {id: "tables1", value: "Настройка проекта", icon: "mdi mdi-cog"}
    ];

    return [
        {
            view: 'sidebar',
            id: 'sidebarView',
            css: "webix_dark",
            data: sidebarData
        },
        {
            view: "button",
            type: "icon",
            id: 'btnSidebarView',
            hidden: false,
            icon: "mdi mdi-menu",
            width: 37,
            align: "left",
            css: "app_button"
        }
    ]
}