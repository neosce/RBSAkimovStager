class Warehouse extends Container {
    constructor(productList) {
        super(productList);
    }

    get ProductList() {
        return super.ProductList;
    }

    getProductById(id) {
        return super.getProductById(id);
    }

    addProduct(product) {
        super.addProduct(product);
    }

    setterCountProduct(id, value) {
        super.setterCountProduct(id, value);
    }

    deleteProductId(id) {
        super.deleteProductId(id);
    }
}
