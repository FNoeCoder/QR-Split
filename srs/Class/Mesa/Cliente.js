export default class Cliente {
    constructor(nombre, dineroAportado, platillos) {
        this._nombre = nombre;
        this._dineroAportado = dineroAportado;
        this._platillos = platillos;
        this._totalPagar = 0;
        this._dineroQueDebe = 0;
        this._dineroQueLeDeben = 0;
        this._propina = 0;
        this._dineroDelCambio = 0;
        this._leDebeA = [];
        this._leDeben = [];

        this._setTotalPagarPlatillos();
        this._setDinero();
        this._setPropina();
    }

    _setDinero() {
        if (this._totalPagar > this._dineroAportado) {
            this._dineroQueDebe = this._totalPagar - this._dineroAportado;
        } else if (this._totalPagar < this._dineroAportado) {
            this._dineroQueLeDeben = this._dineroAportado - this._totalPagar;
        }
    }

    _setPropina() {
        this._propina = this._totalPagar * 0.15;
    }

    setDatosFaltantes(dineroDelCambio, leDebeA, leDeben) {
        this._dineroDelCambio = dineroDelCambio;
        this._leDebeA = leDebeA;
        this._leDeben = leDeben;
    }

    _setTotalPagarPlatillos() {
        for (let platillo of this._platillos) {
            this._totalPagar += platillo.getTotal();
        }
    }

    getNombre() {
        return this._nombre;
    }

    getDineroAportado() {
        return this._dineroAportado;
    }

    getPlatillos() {
        return this._platillos;
    }

    getTotalPagar() {
        return this._totalPagar;
    }

    getDineroQueDebe() {
        return this._dineroQueDebe;
    }

    getDineroQueLeDeben() {
        return this._dineroQueLeDeben;
    }

    getDineroDelCambio() {
        return this._dineroDelCambio;
    }

    getLeDebeA() {
        return this._leDebeA;
    }

    getLeDeben() {
        return this._leDeben;
    }

    getAll() {
        return {
            nombre: this._nombre,
            dineroAportado: this._dineroAportado,
            platillos: this._platillos,
            totalPagar: this._totalPagar,
            dineroQueDebe: this._dineroQueDebe,
            dineroQueLeDeben: this._dineroQueLeDeben,
            dineroDelCambio: this._dineroDelCambio,
            leDebeA: this._leDebeA,
            leDeben: this._leDeben,
            propina: this._propina
        };
    }
}
