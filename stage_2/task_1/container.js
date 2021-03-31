class Container {
    constructor(productList) {
        this._productList = productList;
    }

    get ProductList() {
        return this._productList;
    }

    getProductById(id) {
        return this._productList.filter(p => p.Id == id)[0];
    }

    addProduct(product) {
        if (someBy(this._productList, "Id", product.Id))
            throw new Error("Товар с таким Id уже существует!");
        /*if (someBy(this._productList, "Id", product.Name)) {
            throw new Error("Товар с таким Id уже существует!");
        } */
        this._productList.push(product);
    }

    deleteProductId(id) {
        this._productList = filterBy(this._productList, "Id", id);
    }

    setterCountProduct(id, value) {
        //debugger
        const product = this._productList.filter(p => p.Id == id)[0];

        if (!product) {
            throw new Error("Товар не найден!");
        }

        const counter = product.Count + value;
        if (counter < 1) {
            this.deleteProductId(id);
            return;
        }

        product.Count = counter;

        const productIndex = this._productList.findIndex(p => (p.Id == id));
        this._productList[productIndex] = product;
    }
}

function filterBy(item, valueItem, value) {
    return item.filter(i => i[valueItem] != value);
}

function someBy(item, valueItem, value) {
    return item.some(i => i[valueItem] == value[valueItem]);
}
