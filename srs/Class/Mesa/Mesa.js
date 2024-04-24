import Cliente from './Cliente';

export default class Mesa {
    constructor(clientes) {
        this._clientes = clientes;
        this._totalPagar = 0;
        this._totalDinero = 0;
        this._cambio = 0;
        this._clientesDeudores = [];
        this._clientesAcreedores = [];
        this._clientesSinDeuda = [];
        this._propina = 0;
        this._distribucionDinero = {};

        this._setTotalPagar();
        this._setTotalDinero();
        this._setCambio();
        this._setClientesDAS();
        this._setPropina();
    }

    getDistribucionDinero() {
        let distribuciones = [];
        for (let cliente of this._clientes) {
            distribuciones.push(new Cliente(
                cliente.getNombre(), cliente.getDineroAportado(), cliente.getPlatillos()
            ));
        }
        for (let distribucion of distribuciones) {
            let nombre = distribucion.getNombre();
            distribucion.setDatosFaltantes(
                this._distribucionDinero[nombre].dineroDelCambio,
                this._distribucionDinero[nombre].leDebeA,
                this._distribucionDinero[nombre].leDeben
            );
        }
        return distribuciones;
    }

    _setDistribucionDinero() {
        for (let cliente of this._clientes) {
            this._distribucionDinero[cliente.getNombre()] = {
                dineroAportado: cliente.getDineroAportado(),
                totalPagar: cliente.getTotalPagar(),
                dineroDelCambio: 0,
                dineroQueLeDeben: cliente.getDineroQueLeDeben(),
                dineroQueDebe: cliente.getDineroQueDebe(),
                leDebeA: [],
                leDeben: []
            }
        }
    }

    _setCambioClientes() {
        let cambioRestante = this._cambio;
        for (let cliente of this._clientesAcreedores) {
            if (cliente.getDineroQueLeDeben() <= cambioRestante) {
                this._distribucionDinero[cliente.getNombre()].dineroDelCambio = cliente.getDineroQueLeDeben();
                this._distribucionDinero[cliente.getNombre()].dineroQueLeDeben = 0;
                cambioRestante -= cliente.getDineroQueLeDeben();
            } else if (cliente.getDineroQueLeDeben() > cambioRestante) {
                this._distribucionDinero[cliente.getNombre()].dineroDelCambio = cambioRestante;
                this._distribucionDinero[cliente.getNombre()].dineroQueLeDeben -= cambioRestante;
                cambioRestante = 0;
                break;
            }
        }
    }

    _setDeudasVacias() {
        for (let cliente in this._distribucionDinero) {
            for (let leDebeA of this._distribucionDinero[cliente].leDebeA) {
                if (leDebeA.cantidad === 0) {
                    this._distribucionDinero[cliente].leDebeA = this._distribucionDinero[cliente].leDebeA.filter(cliente => cliente.cantidad !== 0);
                }
            }
            for (let leDeben of this._distribucionDinero[cliente].leDeben) {
                if (leDeben.cantidad === 0) {
                    this._distribucionDinero[cliente].leDeben = this._distribucionDinero[cliente].leDeben.filter(cliente => cliente.cantidad !== 0);
                }
            }
        }
    }

    setDistribucionDinero() {
        this._setDistribucionDinero();
        this._setCambioClientes();

        let dineroQueSeDebe = 0;
        for (let clienteAcreedor in this._distribucionDinero) {
            dineroQueSeDebe += this._distribucionDinero[clienteAcreedor].dineroQueLeDeben;
        }

        for (let clienteDeudor of this._clientesDeudores) {
            for (let clienteAcreedor of this._clientesAcreedores) {
                if (this._distribucionDinero[clienteDeudor.getNombre()].dineroQueDebe === 0 && this._distribucionDinero[clienteAcreedor.getNombre()].dineroQueLeDeben === 0) {
                    break;
                } else if (this._distribucionDinero[clienteDeudor.getNombre()].dineroQueDebe >= this._distribucionDinero[clienteAcreedor.getNombre()].dineroQueLeDeben) {
                    this._distribucionDinero[clienteDeudor.getNombre()].leDebeA.push({
                        nombre: clienteAcreedor.getNombre(),
                        cantidad: this._distribucionDinero[clienteAcreedor.getNombre()].dineroQueLeDeben
                    });
                    this._distribucionDinero[clienteAcreedor.getNombre()].leDeben.push({
                        nombre: clienteDeudor.getNombre(),
                        cantidad: this._distribucionDinero[clienteAcreedor.getNombre()].dineroQueLeDeben
                    });
                    this._distribucionDinero[clienteDeudor.getNombre()].dineroQueDebe -= this._distribucionDinero[clienteAcreedor.getNombre()].dineroQueLeDeben;
                    this._distribucionDinero[clienteAcreedor.getNombre()].dineroQueLeDeben = 0;
                } else if (this._distribucionDinero[clienteDeudor.getNombre()].dineroQueDebe < this._distribucionDinero[clienteAcreedor.getNombre()].dineroQueLeDeben) {
                    this._distribucionDinero[clienteDeudor.getNombre()].leDebeA.push({
                        nombre: clienteAcreedor.getNombre(),
                        cantidad: this._distribucionDinero[clienteDeudor.getNombre()].dineroQueDebe
                    });
                    this._distribucionDinero[clienteAcreedor.getNombre()].leDeben.push({
                        nombre: clienteDeudor.getNombre(),
                        cantidad: this._distribucionDinero[clienteDeudor.getNombre()].dineroQueDebe
                    });
                    this._distribucionDinero[clienteAcreedor.getNombre()].dineroQueLeDeben -= this._distribucionDinero[clienteDeudor.getNombre()].dineroQueDebe;
                    this._distribucionDinero[clienteDeudor.getNombre()].dineroQueDebe = 0;
                }
            }
        }
        this._setDeudasVacias();
    }

    _setClientesDAS() {
        for (let cliente of this._clientes) {
            if (cliente.getDineroQueDebe() > 0) {
                this._clientesDeudores.push(cliente);
            } else if             (cliente.getDineroQueLeDeben() > 0) {
                this._clientesAcreedores.push(cliente);
            } else if (cliente.getDineroQueDebe() === 0 && cliente.getDineroQueLeDeben() === 0) {
                this._clientesSinDeuda.push(cliente);
            }
        }
    }

    _setPropina() {
        this._propina = this._totalPagar * 0.15;
    }

    getPropina() {
        return this._propina;
    }

    getClientesDeudores() {
        return this._clientesDeudores;
    }

    getClientesAcreedores() {
        return this._clientesAcreedores;
    }

    getClientesSinDeuda() {
        return this._clientesSinDeuda;
    }

    getDinero() {
        return {
            totalDinero: this._totalDinero,
            totalPagar: this._totalPagar,
            cambio: this._cambio
        }
    }

    getTotalPagar() {
        return this._totalPagar;
    }

    getClientes() {
        let datosClientes = [];
        for (let cliente of this._clientes) {
            datosClientes.push({
                nombre: cliente.getNombre(),
                dineroAportado: cliente.getDineroAportado(),
                totalPagar: cliente.getTotalPagar(),
            });
        }
        return datosClientes;
    }

    getTotalDinero() {
        return this._totalDinero;
    }

    getCambio() {
        return this._cambio;
    }

    _setTotalPagar() {
        for (let cliente of this._clientes) {
            this._totalPagar += cliente.getTotalPagar();
        }
    }

    _setTotalDinero() {
        for (let cliente of this._clientes) {
            this._totalDinero += cliente.getDineroAportado();
        }
    }

    _setCambio() {
        this._cambio = this._totalDinero - this._totalPagar;
    }
    getObtenerQuienDaCuantoAquien(){
        // Fulano -> 500 -> Fulano2
        
    }
}

