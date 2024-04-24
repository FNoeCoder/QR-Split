import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Alert, Text } from 'react-native'; // Agregar Text
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as SQLite from 'expo-sqlite';

const Scan = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [scannedData, setScannedData] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        setScannedData(data);
        let datos = JSON.parse(data);
        guardarEnHistorial(datos.titulo);
        for (let platillo of datos.platillos) {
            guardarPlatillo(platillo.nombre, platillo.precio, datos.titulo);
        }
        Alert.alert(
            'Código escaneado',
            `Tipo de código: ${type}\nDatos del código: ${data}`,
            [
                { text: 'Aceptar'}

            ]
        );
    };

    const guardarEnHistorial = (Nombre) => {
        const db = SQLite.openDatabase('database.db');
        db.transaction(tx => {
            tx.executeSql(
                `INSERT INTO Restaurante (Nombre) VALUES (?);`,
                [Nombre],
                (_, resultSet) => {
                    console.log('Elemento guardado exitosamente:', resultSet.rowsAffected);
                },
                (_, error) => {
                    Alert.alert('Error', 'Error al guardar el elemento en el historial');
                }
            );
        });
    }
    const guardarPlatillo = (nombre, precio, titulo) => {
        const db = SQLite.openDatabase('database.db');
        db.transaction(tx => {
            tx.executeSql(
                `INSERT INTO Menu (Nombre, Precio, Restaurante_Nombre) VALUES (?, ?, ?);`,
                [nombre, precio, titulo],
                (_, resultSet) => {
                    console.log('Platillo guardado exitosamente:', resultSet.rowsAffected);
                    Alert.alert('Platillo guardado', `${nombre} guardado exitosamente`);
                },
                (_, error) => {
                    Alert.alert('Error', 'Error al guardar el platillo');
                }
            );
        });
    }

    

    if (hasPermission === null) {
        return <View style={styles.container}><Text>Solicitando permiso para acceder a la cámara...</Text></View>;
    }
    if (hasPermission === false) {
        return <View style={styles.container}><Text>Permiso para acceder a la cámara denegado</Text></View>;
    }

    return (
        <View style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            {scanned && (
                <Button title={'Escanear de nuevo'} buttonSbuttonStyle={styles.calcular} onPress={() => setScanned(false)} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    calcular: {
        backgroundColor: "#559399",
        color: "#fff",
        borderRadius: 10,
        marginBottom: 50,
        marginTop: 50

    }
});

export default Scan;
