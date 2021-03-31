// id таблиц webix
const DT_ITEM_TRASH = 'dtItemTrash';
const DT_ITEM_WAREHOUSE = 'dtItemWarehouse';

const trash = new GetTrashInstance([]);

const warehouse = new Warehouse([
    new Product(321, "Phone", 3, 15500),
    new Product(24363, "NoteBook", 5, 47000),
    new Product(6363, "Headphones", 20, 7500),
    new Product(425, "SmartWatch", 1, 23000),
]);

// Обновить таблицу webix
function updateTable(id, data=[]) {
    /*$$(id).parse(data);*/
    $$(id).clearAll();
    $$(id).define("data", data);
    $$(id).resize();
}

// Удалить в таблице не существующее поле
function removeDataTable(id, selectedId, idData, data) {
    if (!data.getProductById(idData)) {
        $$(id).remove(selectedId);
    }
}

// Передать из одного контейнера единицу товара в другой
function moveToStorage(container_1, container_2, id) {
    const productContainer_1 = container_1.getProductById(id);
    const productContainer_2 = container_2.getProductById(id);

    if (!productContainer_2) {
        container_2.addProduct(new Product(
            productContainer_1.Id,
            productContainer_1.Name,
            1,
            productContainer_1.Price
        ));
    } else {
        container_2.setterCountProduct(id, 1);
    }

    container_1.setterCountProduct(id, -1);
}

// Добавление нового продукта
function addNewProductWarehouse(Name, Count, Price) {
    if (!Name) {
        return "error"
    }

    if (Price < 1) {
        return "error"
    }

    // Добавление нового товара
    warehouse.addProduct(new Product(getRandomInt(), Name, Count, Price,));

    // Обновление таблицы
    updateTable(DT_ITEM_WAREHOUSE, warehouse.ProductList);

    return "success";
}

// Получение уникального id
function getRandomInt(max = 23464326) {
    return Math.floor(Math.random() * Math.floor(max));
}