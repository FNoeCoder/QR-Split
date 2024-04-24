import React, { useEffect, useState } from "react";
import { View, Text, Alert, ScrollView, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { Picker } from '@react-native-picker/picker';
import { Input, Button } from 'react-native-elements';
import Cliente from '../srs/Class/Mesa/Cliente.js';
import Platillo from '../srs/Class/Mesa/Platillo.js';
import Mesa from '../srs/Class/Mesa/Mesa.js';

import * as SQLite from 'expo-sqlite';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Calcular = () => {
    const [historial, setHistorial] = useState([]);
    const [selectedValue, setSelectedValue] = useState('Ninguno');
    const [personas, setPersonas] = useState([]);
    const [platillos, setPlatillos] = useState([]);

    const esNumero = (n) => {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    const obtenerHistorial = () => {
        const db = SQLite.openDatabase('database.db');
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM Restaurante;`,
                [],
                (_, resultSet) => {
                    setHistorial(resultSet.rows._array);
                    console.log('Historial obtenido exitosamente:', resultSet.rows._array);
                },
                (_, error) => {
                    console.error('Error al obtener el historial:', error);
                }
            );
        });
    }
    const obtenerPlatillos = (nombre) => {
        if (nombre !== 'Ninguno'){
            const db = SQLite.openDatabase('database.db');
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM Menu WHERE Restaurante_Nombre = ?;`,
                    [nombre],
                    (_, resultSet) => {
                        if (resultSet.rows._array.length === 0) {
                            Alert.alert('Error', 'No hay platillos en el menú seleccionado');
                            setSelectedValue('Ninguno');
                        }
                        else{
                            setPlatillos(resultSet.rows._array);
                            console.log('Platillos obtenidos exitosamente:', resultSet.rows._array);
                        }
                    },
                    (_, error) => {
                        console.error('Error al obtener los platillos:', error);
                    }
                );
            });
        }
        else {
            console.log("No se optiene platillos porque no hay un menú seleccionado en el picker")
        }
    }
    const agregarPersona = () => {
        //No está en la base de datos
        //Es para agregar un componente con input Nombre, y dinero aportado
        // if (personas.length !== 0){
        //     console.log(`Es numero: ${personas[personas.length - 1].DineroAportado}: ${esNumero(personas[personas.length - 1].DineroAportado)}`);
        //     console.log(`${personas[personas.length - 1].DineroAportado} <= 0`);
        //     console.log(parseFloat(personas[personas.length - 1].DineroAportado) <= 0);
        // }
        if (selectedValue === 'Ninguno') {
            Alert.alert('Error', 'Selecciona un menú');
        }

        else if (personas.length === 0) {
            setPersonas([...personas, { Nombre: '', DineroAportado: 0, platilos: [{nombre: "", cantidad: 0, precio: 0}] }]);
        }
        else if (esNumero(personas[personas.length - 1].DineroAportado) && parseFloat(personas[personas.length - 1].DineroAportado) < 0) {
            Alert.alert('Error', `"${personas[personas.length - 1].DineroAportado}" no es válido`);
        }
        else if (personas[personas.length - 1].platilos.length === 0 ) {
            Alert.alert('Error', 'Termina de agregar los platillos');
        }
        else if (!esNumero(personas[personas.length - 1].DineroAportado)) {
            Alert.alert('Error', `"${personas[personas.length - 1].DineroAportado}" no es válido`);
        }
        else if (personas[personas.length - 1].Nombre.trim() !== '' && (personas[personas.length - 1].DineroAportado).toString().trim() !== ''){
            setPersonas([...personas, { Nombre: '', DineroAportado: 0, platilos: [{nombre: "", cantidad: 0, precio: 0}] }]);
        }
        else{
            Alert.alert('Error', 'Llena correctamente los campos');
        }
    }
    agregarPlatillo = (personaNombre) => {
        let indexPersona = personas.findIndex(persona => persona.Nombre === personaNombre);
        
        console.log('Persona:', personas[indexPersona]);
        console.log();


        if (personas[indexPersona].platilos.length === 0) {
            personas[indexPersona].platilos = [{nombre: "", cantidad: 0, precio: 0}];
            setPersonas([...personas]);
        }
        else if ((personas[indexPersona].DineroAportado).toString().trim() === '' || !esNumero(personas[indexPersona].DineroAportado) || parseFloat(personas[indexPersona].DineroAportado) < 0) {
            let valor = personas[indexPersona].DineroAportado
            Alert.alert('Error', `"${valor}" no es válido`);
        }
        else if (personas[indexPersona].Nombre.trim() === '') {
            Alert.alert('Error', 'Ingresa un nombre');
        }
        else if (personas[indexPersona].platilos[personas[indexPersona].platilos.length - 1].nombre.trim() === '' ) {
            Alert.alert('Error', 'Selecciona los platillos correctamente'); 
        }
        else if (personas[indexPersona].platilos[personas[indexPersona].platilos.length - 1].cantidad === 0 || !esNumero(personas[indexPersona].platilos[personas[indexPersona].platilos.length - 1].cantidad)) {
            Alert.alert('Error', `"${personas[indexPersona].platilos[personas[indexPersona].platilos.length - 1].cantidad}" no es válido`);
        }
        else {
            personas[indexPersona].platilos = [...personas[indexPersona].platilos, {nombre: "", cantidad: 0, precio: 0}];
            setPersonas([...personas]);
        }

    }
    obtenerPrecioPlatillo = (nombrePlatillo) => {
        let platillo = platillos.find(platillo => platillo.Nombre === nombrePlatillo);
        return platillo.Precio;
    }
    eliminarPersona = (index) => {
        let personasActualizadas = personas.filter((persona, i) => i !== index);
        setPersonas(personasActualizadas);
    }
    eliminarPlatillo = (indexPersona, indexPlatillo) => {
        
        let platillosActualizados = personas[indexPersona].platilos.filter((platillo, i) => i !== indexPlatillo);
        personas[indexPersona].platilos = platillosActualizados;
        setPersonas([...personas]);
        console.log(personas[indexPersona].platilos.length);
    }

    verificarDatosPersonas = () => {
        // Nombre: '', DineroAportado: 0, platilos: [{nombre: "", cantidad: 0, precio: 0}
        if (personas.length === 0) {
            Alert.alert('Error', 'Agrega personas');
            return false;
        }
        for (let persona of personas){
            if (persona.platilos.length === 0){
                Alert.alert('Error', 'Agrega platillos');
            }
        }
        // try{
            let objetosPersonas = personas.map(persona => {
                let platillos = persona.platilos.map(platillo => {
                    return new Platillo(platillo.nombre, platillo.cantidad, platillo.precio);
                });
                return new Cliente(persona.Nombre, parseFloat(persona.DineroAportado), platillos);
            });
    
            let mesa = new Mesa(objetosPersonas);
            mesa.setDistribucionDinero();
            let distribuciones = mesa.getDistribucionDinero();
    
            console.log(JSON.stringify(distribuciones, null, 8));

            let losQueRecibenCambio = distribuciones.filter(persona => persona.getDineroDelCambio() > 0)
            let personasQueDeben = distribuciones.filter(persona => persona.getLeDebeA().length > 0)
    
            let datosMostar = "";
            datosMostar += `Total a pagar: ${mesa.getTotalPagar()} \n`;
            datosMostar += `Cambio: ${mesa.getCambio()} \n`;
            datosMostar += `----------------------------- \n`;
            datosMostar += `Cambio total: ${mesa.getCambio()} \n`
            for (let persona of losQueRecibenCambio){
                datosMostar+= ` - ${persona.getNombre()}: ${persona.getDineroDelCambio()} \n`
            }
            datosMostar += `----------------------------- \n`;
            datosMostar+= "Dinero por dar\n"
            
            for (let persona of personasQueDeben){
                for (leDebeA of persona.getLeDebeA()){
                    datosMostar += `${persona.getNombre()} --> ${leDebeA.cantidad} --> ${leDebeA.nombre} \n`
                }
            }

            datosMostar += `----------------------------- \n`;
            // todosLosQueDeben 
            Alert.alert('Resulado', datosMostar);
        // }
        // catch(e){
        //     Alert.alert('Error', 'Agrega los datos correctamente');
        // }



    }
    
    useEffect(() => {
        obtenerHistorial();
    }, []);

    

    return (
        <View style={{ marginTop: Constants.statusBarHeight,  width: "100%", flexGrow: 1 , alignSelf: "center"}}>
            <ScrollView>
            <Text style={styles.titulo}>Seleccione un menú</Text>
            <Picker
                style={styles.itemMenu}
                selectedValue={selectedValue}
                onValueChange={(itemValue, itemIndex) => {
                    setSelectedValue(itemValue),
                    setPersonas([])
                    obtenerPlatillos(itemValue)
                }
                }>
                <Picker.Item label="Ninguno" value="Ninguno" />
                {
                    historial.map((item, index) => (
                        <Picker.Item key={index} label={item.Nombre} value={item.Nombre} />
                    ))
                }
            </Picker>
            <View style={styles.personas}>
            {
                personas.map((persona, indexPersona) => (
                    <View key={indexPersona} style={styles.persona}>
                        <Input
                            placeholder="Nombre"
                            value={persona.Nombre}
                            onChangeText={text => {
                                personas[indexPersona].Nombre = text;
                                setPersonas([...personas]);
                            }}
                        />
                        <Input
                            placeholder="Dinero aportado"
                            value={(persona.DineroAportado).toString()}
                            onChangeText={text => {
                                personas[indexPersona].DineroAportado = text;
                                setPersonas([...personas]);
                            }}
                        />
                        <Text>Platillos consumidos</Text>
                        {
                            personas[indexPersona].platilos.map((platillo, indexPlatillo) => (
                                <View key={indexPlatillo}>
                                    <Picker
                                        selectedValue={platillo.nombre}
                                        style={{ height: 50, width: 150 }}
                                        onValueChange={(itemValue, itemIndex) => {
                                            personas[indexPersona].platilos[indexPlatillo].nombre = itemValue;
                                            personas[indexPersona].platilos[indexPlatillo].precio = obtenerPrecioPlatillo(itemValue);
                                            setPersonas([...personas]);
                                        }
                                        }>
                                        {/* <Picker.Item label="Ninguno" value="Ninguno" /> */}
                                        {
                                            platillos.map((item, index) => (
                                                <Picker.Item key={index} label={item.Nombre+" - "+item.Precio + " $"} value={item.Nombre} 
                   
                                                />
                                            ))
                                        }
                                    </Picker>
                                    <Input
                                        placeholder="Cantidad"
                                        // value={}
                                        onChangeText={text => {
                                            personas[indexPersona].platilos[indexPlatillo].cantidad = text;
                                            setPersonas([...personas]);
                                        }}
                                    />         
                                    <Button title={`Eliminar ${platillo.nombre}`} buttonStyle={styles.eliminar} onPress={() => eliminarPlatillo(indexPersona, indexPlatillo)} />                                                               
                                </View>
                            ))
                        }
                        <Button title={persona.Nombre ? `Agregar platillo a ${persona.Nombre}` : "Agregar platillo"} 
                        buttonStyle={styles.agregar}
                            onPress={() => {
                                agregarPlatillo(persona.Nombre);
                            }}
                        />
                        <Button title={persona.Nombre ? `Eliminar a ${persona.Nombre}` : "Eliminar persona"} buttonStyle={styles.eliminar} onPress={() => eliminarPersona(indexPersona)} />


                    </View>
                ))
                
            }
            </View>
            <Button title="Agregar Persona" onPress={agregarPersona} buttonStyle={styles.agregar} />
            <Button title="Calcular" buttonStyle={styles.calcular} onPress={() => {
                verificarDatosPersonas();
            }} />
            </ScrollView>
        </View>
    );    
}

const styles = StyleSheet.create({
    titulo: {
        width: "100$",
        textAlign: "center",
        fontSize: 20
    },
    itemMenu: {
        width: "100%",
        fontSize: 17,
        height: 50,
        borderBottomWidth: 10,
        borderBottomColor: "grey"
    },
    calcular: {
        marginTop: 20,
        width: 150,
        height: 50,
        borderRadius: 10,
    },
    personas: {
        paddingBottom: 20,
        paddingTop: 20,
    },    
    persona: {
        backgroundColor: "#ffffff",
        borderRadius: 10,
        margin: 10,
        padding: 10,
    },
    eliminar:{
        backgroundColor: "#c08872",
        color: "#fff",
        borderRadius: 10,
        marginBottom: 20
    },
    agregar: {
        backgroundColor: "#A9D2AA",
        color: "#fff",
        borderRadius: 10,
        marginBottom: 20    
    },
    calcular: {
        backgroundColor: "#559399",
        color: "#fff",
        borderRadius: 10,
        marginBottom: 50,
        marginTop: 50

    }
});

export default Calcular;

