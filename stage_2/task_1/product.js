class Product {
    constructor(id, name, count, price) {
        this._id = id;
        this.Name = name;
        this.Count = count;
        this.Price = price;
    }

    get Id() {
        return this._id;
    }

    get Name() {
        return this._name;
    }

    get Count() {
        return this._count;
    }

    get Price() {
        return this._price;
    }

    set Name(value) {
        if (value.length < 1)
            throw new Error("Длина имени не может быть 1!");
        this._name = value;
    }

    set Count(value) {
        if (value < 1)
            throw new Error("Количество не может быть 0 или меньше одного!");
        this._count = parseInt(value);
    }

    set Price(value) {
        if (value < 1)
            throw new Error("Цена не может быть 0");
        this._price = parseFloat(value);
    }

    toString() {
        return `Name: ${this._name}, Count: ${this._count}, Price: ${this._price}`;
    }
}
