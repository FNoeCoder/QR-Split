const Platillo = require('./Platillo');
const Cliente = require('./Cliente');
const Mesa = require('./Mesa');




let platillo1 = new Platillo("Tacos", 20, 7);
let platillo2 = new Platillo("Tostadas", 15, 2);
let platillo3 = new Platillo("Refresco", 10, 4);
let platillo4 = new Platillo("Cerveza", 25, 1);
let platillo5 = new Platillo("Quesadilla", 25, 8);

let platillosNoe = [platillo1, platillo2, platillo3];
let platillosOmar = [platillo3, platillo4, platillo5]

let cliente1 = new Cliente("Noé", 2000, platillosNoe);

let cliente2 = new Cliente("Omar", 500, platillosOmar);

let cliente3 = new Cliente("Bryan", 50, [...platillosNoe, ...platillosOmar]);

let cliente4 = new Cliente("Juan", 140, [platillo1]);

let cliente5 = new Cliente("Pedro", 100, [platillo5]);

let cliente6 = new Cliente("Luis", 100, [platillo5, platillo4, platillo2]);

let mesa = new Mesa([cliente1, cliente2, cliente3, cliente4, cliente5, cliente6]);



console.log(mesa.getDinero());



// console.log(mesa.getClientesDeudores().map(cliente => cliente.getNombre()));
// console.log(mesa.getClientesAcreedores().map(cliente => cliente.getNombre()));
// console.log(mesa.getClientesSinDeuda().map(cliente => cliente.getNombre()));
mesa.setDistribucionDinero();
let distribuciones = mesa.getDistribucionDinero().map(cliente => cliente.getAll());

// console.log(distribuciones);
console.log(JSON.stringify(distribuciones, null, 8));


