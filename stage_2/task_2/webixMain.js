// Основная форма
webix.ready(() => {
    webix.ui({
        cols: [
            {
                rows: [
                    {
                        type: "header",
                        template: "Корзина",
                    },
                    {
                        id: DT_ITEM_TRASH,
                        view: "datatable",
                        css: "webix_data_border webix_header_border",
                        select: true,
                        columns: [
                            {id: "Name", width: 100, fillspace: true, header: "Название"},
                            {id: "Count", width: 100, fillspace: true, header: "Кол-во"},
                            {id: "Price", width: 100, fillspace: true, header: "Цена за 1.шт"}
                        ],
                        data: trash.ProductList,
                    },
                    {
                        id: 'textPrice',
                        view: "text",
                        value: trash.CountPrice,
                        label: "Цена",
                        format: "1.111,00",
                        readonly: true
                    }
                ],
            },
            {
                rows: [
                    {
                        view: "template",
                        type: "header",
                        template: "Склад",
                    },
                    {
                        id: DT_ITEM_WAREHOUSE,
                        view: "datatable",
                        css: "webix_data_border webix_header_border",
                        select: true,
                        columns: [
                            {id: "Name", width: 100, fillspace: true, header: "Название"},
                            {id: "Count", width: 100, fillspace: true, header: "Кол-во"},
                            {id: "Price", width: 100, fillspace: true, header: "Цена за 1.шт"}
                        ],
                        data: warehouse.ProductList,
                    },
                    {
                        cols: [
                            {
                                id: "btnAddProduct", view: "button", css: "webix_primary",
                                value: "Добавить товар на склад"
                            }
                        ]
                    }
                ]
            }
        ]
    });

// Вызов диалогового окна для добавление нового товара
    $$("btnAddProduct").attachEvent("onItemClick", () => {
        webix.ui({
            view: "popup",
            position: "center",
            id: "popupAddProduct",
            width: 500, height: 350,
            body: {
                rows: [
                    {
                        id: "getForm",
                        view: "form",
                        elements: [
                            {view: "text", name: "name", label: "Название"},
                            {
                                view: "text", name: "price", label: "Цена",
                                value: 0,
                                format: "1.111,00"
                            },
                            {
                                view: "counter", label: "Кол-во", value: 1,
                                min: 1, max: 99, step: 1, name: "count"
                            },
                        ]
                    },
                    {
                        cols: [
                            {
                                view: "button",
                                minWidth: 65,
                                height: 40,
                                value: "Сохранить",
                                on: {
                                    // Добавить новый товар в корзину
                                    onItemClick: function () {
                                        const dataForm = $$("getForm").getValues();
                                        const result = addNewProductWarehouse(
                                            dataForm.name,
                                            dataForm.count,
                                            dataForm.price
                                        );

                                        if (result === "error") {
                                            webix.message("Поля не должны быть пустыми", result);
                                            return;
                                        }
                                        updateTable(DT_ITEM_TRASH, trash.ProductList);
                                        $$('textPrice').setValue(trash.CountPrice);

                                        webix.message("Товар добавлен на склад!", result);
                                        $$('popupAddProduct').hide();
                                    }
                                }
                            },
                        ]
                    }
                ]
            }
        }).show();
    });

// Передать одну единицу товара на склад
    $$(DT_ITEM_TRASH).attachEvent("onItemClick", (item) => {
        const id = $$(DT_ITEM_TRASH).getItem(item.row).Id;
        const selectedId = $$(DT_ITEM_TRASH).getItem(item.row).id;

        // Передать на склад
        moveToStorage(trash, warehouse, id);

        // Обновить таблицу webix
        updateTable(DT_ITEM_TRASH, trash.ProductList);
        updateTable(DT_ITEM_WAREHOUSE, warehouse.ProductList);

        // Удалить в таблице не существующий товар
        /*if (!trash.getProductById(id)) {
            removeDataTable(DT_ITEM_TRASH, selectedId, id, trash);
        }*/

        // Подсчитать цену всех товаров в корзине
        $$('textPrice').setValue(trash.CountPrice);
    });

// Передать одну единицу товара в корзину
    $$(DT_ITEM_WAREHOUSE).attachEvent("onItemClick", (item) => {
        const id = $$(DT_ITEM_WAREHOUSE).getItem(item.row).Id;
        const selectedId = $$(DT_ITEM_WAREHOUSE).getItem(item.row).id;

        // Передать в корзину
        moveToStorage(warehouse, trash, id);

        // Обновить таблицу webix
        updateTable(DT_ITEM_WAREHOUSE, warehouse.ProductList);
        updateTable(DT_ITEM_TRASH, trash.ProductList);

        // Удалить в таблице не существующий товар
        /*  if (!warehouse.getProductById(id)) {
              removeDataTable(DT_ITEM_WAREHOUSE, selectedId, id, warehouse);
          }*/

        // Подсчитать цену всех товаров в корзине
        $$('textPrice').setValue(trash.CountPrice);
    });
});


