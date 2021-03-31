export default function (): Object {
    return {
        view: "popup",
        id: "popupToolbar",
        width: 250,
        body: {
            rows: [
                // Описание сотрудника
                {
                    view: 'label',
                    id: 'userInfoLabel',
                    align: 'center',
                    label: 'загрузка...',
                },
                {
                    cols: [
                        // кнопка выхода
                        {},
                        {
                            view: 'button',
                            id: 'logoutBtn',
                            inputWidth: 80,
                            css: 'webix_danger',
                            label: 'Выход',
                        },
                        {},
                    ]
                },
                {height: 10}
            ]
        }
    }
}