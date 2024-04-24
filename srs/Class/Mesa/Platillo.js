export default class Platillo {
    constructor(nombre, precio, cantidad) {
        this._nombre = nombre;
        this._precio = precio;
        this._cantidad = cantidad;
        this._total = this._precio * this._cantidad;
    }

    getNombre() {
        return this._nombre;
    }

    getPrecio() {
        return this._precio;
    }

    getCantidad() {
        return this._cantidad;
    }

    getTotal() {
        return this._total;
    }
}
