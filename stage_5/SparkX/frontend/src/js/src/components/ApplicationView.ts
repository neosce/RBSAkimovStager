// возвращает webix конфигурацию рабочего пространства приложения
export default function MainApplicationView(
    body: Array<Object> = [{template: "No content"}],
    toolbar: object
): Object {
    return {
        id: 'bodyApp',
        rows: [
            toolbar,
            {
                cols: [
                    //{view: 'template', id: 'mainApp', template: '156456456'},
                    ...body
                ]
            },

        ]
    }
};
