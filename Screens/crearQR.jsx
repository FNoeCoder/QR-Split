

import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import { Input, Button } from 'react-native-elements';
import QRCode from 'react-native-qrcode-svg';
import * as SQLite from 'expo-sqlite';

const CrearQR = () => {
    const [titulo, setTitulo] = useState('');
    const [platillos, setPlatillos] = useState([]);
    const [mostrarQR, setMostrarQR] = useState(false);

    useEffect(() => {
        const db = SQLite.openDatabase('database.db');

        db.transaction(tx => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS Restaurante (
                    Nombre VARCHAR(100) NOT NULL PRIMARY KEY
                );`,
                [],
                (_, resultSet) => {
                    console.log('Tabla Restaurante creada exitosamente');
                },
                (_, error) => {
                    console.error('Error al crear la tabla Restaurante:', error);
                }
            );
        });

        db.transaction(tx => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS Menu (
                    Nombre VARCHAR(100) NOT NULL PRIMARY KEY,
                    Precio INTEGER NOT NULL,
                    Restaurante_Nombre VARCHAR(100) NOT NULL,
                    FOREIGN KEY (Restaurante_Nombre) REFERENCES Restaurante (Nombre)
                        ON DELETE CASCADE
                        ON UPDATE NO ACTION
                );`,
                [],
                (_, resultSet) => {
                    console.log('Tabla Menú creada exitosamente');
                },
                (_, error) => {
                    console.error('Error al crear la tabla Menú:', error);
                }
            );
        });
    }, []);

    const qrData = JSON.stringify({ titulo, platillos, "qr-split": true });

    const mostrarResultado = () => {
        if (titulo.trim() === '') {
            Alert.alert('Error', 'Llena el campo del título del menú');
            return;
        }
        if (!todosLosPreciosSonValidos()) {
            Alert.alert('Error', 'Llena los campos de los precios correctamente');
            return;
        }
        setMostrarQR(true);
    }

    const esNumero = (n) => {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    const todosLosPreciosSonValidos = () => {
        for (let i = 0; i < platillos.length; i++) {
            if (!esNumero(platillos[i].precio)) {
                return false;
            }
        }
        return true;
    }

    const agregarPlatillo = () => {
        if (platillos.length === 0) {
            setPlatillos([...platillos, { nombre: '', precio: '' }]);
        } else if (!esNumero(platillos[platillos.length - 1].precio)) {
            Alert.alert('Error', `"${platillos[platillos.length - 1].precio}" no es un precio válido`);
        } else if (platillos[platillos.length - 1].nombre.trim() !== '' && platillos[platillos.length - 1].precio.trim() !== '') {
            setPlatillos([...platillos, { nombre: '', precio: '' }]);
        } else {
            Alert.alert('Error', 'Llena los campos del platillo anterior');
        }
    }

    return (
        <View style={{ marginTop: Constants.statusBarHeight, flexGrow: 1 }}>
            <ScrollView>
                <View style={styles.principal}>
                <Input
                    placeholder="Título del Menú"
                    defaultValue={titulo}
                    onChangeText={setTitulo}
                    
                />
                </View>
                {platillos.map((platillo, index) => (
                    <View key={index} style={styles.principal}>
                        <Input
                            placeholder="Nombre del platillo"
                            defaultValue={platillo.nombre}
                            onChangeText={nombre => {
                                platillos[index].nombre = nombre;
                                setPlatillos([...platillos]);
                            }}
                        />
                        <Input
                            placeholder="Precio"
                            defaultValue={platillo.precio}
                            onChangeText={precio => {
                                platillos[index].precio = precio;
                                setPlatillos([...platillos]);
                            }}
                        />
                    </View>
                ))}

                <Button
                    title="Agregar Platillo"
                    onPress={agregarPlatillo}
                    buttonStyle={styles.agregar}
                />
                <Button
                    title="Crear QR"
                    onPress={mostrarResultado}
                    buttonStyle={styles.crear}
                />

                {mostrarQR && (
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <QRCode value={qrData} size={200} />
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    principal: {
        backgroundColor: "#ffffff",
        borderRadius: 10,
        margin: 10,
        padding: 10,
    },
    agregar: {
        backgroundColor: "#A9D2AA",
        color: "#fff",
        borderRadius: 10,
        marginBottom: 20    
    },
    crear: {
        backgroundColor: "#559399",
        color: "#fff",
        borderRadius: 10,
        marginBottom: 50,
        marginTop: 50

    }
})

export default CrearQR;
