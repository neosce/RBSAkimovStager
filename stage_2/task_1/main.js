const trash = new GetTrashInstance([]);

const warehouse = new Warehouse([
    new Product(321, "Phone", 3, 15500),
    new Product(24363, "NoteBook", 5, 47000),
    new Product(6363, "Headphones", 20, 7500),
    new Product(425, "SmartWatch", 1, 23000),
]);

const TRASHNAME = 'trash';
const WAREHOUSENAME = 'warehouse';

document.addEventListener("DOMContentLoaded", () => {
    // первичное отображение данных
    refresh(trash.ProductList, warehouse.ProductList);
});

// функция обновления данных в контейнере
function refresh(container_1, container_2) {
    clear();
    getSum();

    container_1.forEach(item => {
        document
            .getElementById('trash')
            .appendChild(createElement(item, trash.constructor.name));
    });
    container_2.forEach(item => {
        document
            .getElementById('warehouse')
            .appendChild(createElement(item, warehouse.constructor.name));
    });
}

// функция очищения контейнера
function clear() {
    document.getElementById('trash').innerHTML = '';
    document.getElementById('warehouse').innerHTML = '';
}

// создание html представления продуктов
function createElement(item, containerName) {
    // ячейка Name
    const divName = document.createElement('div');
    divName.className = "item-name item";
    divName.innerHTML = item.Name;

    // ячейка Count
    const divCount = document.createElement('div');
    divCount.className = "item-count item";
    divCount.innerHTML = item.Count;

    // ячейка Price
    const divPrice = document.createElement('div');

    divPrice.className = "item-price item";
    divPrice.innerHTML = item.Price;

    // строка Product
    const divItemContainer = document.createElement('div');
    divItemContainer.className = "row";
    divItemContainer.appendChild(divName);
    divItemContainer.appendChild(divCount);
    divItemContainer.appendChild(divPrice);

    // For only trash
    /*if (containerName === "Trash") {
        const createCounterPlus = createCounter(item.Id, "+", 1);
        const createCounterMinus = createCounter(item.Id, "-", -1);

        divItemContainer.appendChild(createCounterMinus);
        divItemContainer.appendChild(createCounterPlus);
    }*/

    divItemContainer.id = item.Id;
    divItemContainer.containerName = containerName;
    divItemContainer.addEventListener('click', () => {
        selectToMoveContainer(divItemContainer.id, divItemContainer.containerName);
    });

    return divItemContainer;
}

function selectToMoveContainer(id, containerName) {
    switch (containerName) {
        case "Trash":
            //console.log(`Id: ${id}, Container name: ${containerName}`);
            moveToStorage(trash, warehouse, id);
            break;
        case "Warehouse":
            //console.log(`Id: ${id}, Container name: ${containerName}`);
            moveToStorage(warehouse, trash, id);
            break;

        default:
            break;
    }
}

function createCounter(id, value, counter) {
    const btnItemContainer = document.createElement('input');
    btnItemContainer.className = "item-btn";
    btnItemContainer.value = value;
    btnItemContainer.id = id;
    btnItemContainer.type = "button";
    btnItemContainer.addEventListener('click', () => {
        setCounterTrash(btnItemContainer.id, counter);
    });

    return btnItemContainer;
}

function setCounterTrash(id, counter) {
    trash.setterCountProduct(id, counter);
    refresh(trash.ProductList, warehouse.ProductList);
}

// Обновление суммы корзины
function getSum() {
    document.getElementById('countPrice').value = trash.CountPrice;
}

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

    refresh(trash.ProductList, warehouse.ProductList);
}
