class GetTrashInstance {
    constructor(productList) {
        if (typeof GetTrashInstance.instance === 'object') {
            return GetTrashInstance.instance;
        }

        GetTrashInstance.instance = new Trash(productList);
        return GetTrashInstance.instance;
    }
}

class Trash extends Container {
    constructor(productList) {
        super(productList);
    }

    get ProductList() {
        return super.ProductList;
    }

    get CountPrice() {
        return super
            .ProductList
            .reduce((accPrice, product) => (accPrice + (product.Price * product.Count)), 0);
    }

    getProductById(id) {
        return super.getProductById(id);
    }

    setterCountProduct(id, value) {
        super.setterCountProduct(id, value);
    }

    addProduct(product) {
        super.addProduct(product);
    }

    deleteProductId(id) {
        super.deleteProductId(id);
    }
}
