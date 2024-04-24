import react, {useState, useEffect} from "react";
import { View, Text, Alert, StyleSheet } from 'react-native';
import { Button, Input } from 'react-native-elements';
import Constans from 'expo-constants';

import * as SQLite from 'expo-sqlite';


const Historial = () => {
    const [historial, setHistorial] = useState([]);
  

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
    const eliminarElemento = (Nombre) => {
        const db = SQLite.openDatabase('database.db');
        db.transaction(tx => {
            tx.executeSql(
                `DELETE FROM Restaurante WHERE Nombre = ?;`,
                [Nombre],
                (_, resultSet) => {
                    console.log('Elemento eliminado exitosamente:', resultSet.rowsAffected);
                    obtenerHistorial();
                },
                (_, error) => {
                    console.error('Error al eliminar el elemento:', error);
                }
            );
        });
    }

    
    useEffect(() => {
        obtenerHistorial();
    }, []);
    return (
        <View style={{ marginTop:Constans.statusBarHeight, flexGrow:1}}>
            <View style={styles.linea}></View>
            {
                historial.map((item, index) => (
                    <View key={index} style={styles.eliminar}>
                        <View style={styles.nombre}>
                        <Text key={index}>{item.Nombre}</Text>
                        </View>
                        <Button title="Eliminar" buttonStyle={styles.botonEliminar} onPress={() => eliminarElemento(item.Nombre)} />
                    </View>
                ))
            }
        </View>
    );
}


const styles = StyleSheet.create({
    // titulo:{
    //     fontSize: 20,
    //     width: "100%",
    //     textAlign: "center",
    //     marginBottom: 20,
    //     borderBottomWidth: 4,
    //     borderBottomColor: "grey"
    // },
    nombre:{
        fontSize: 25
    },
    linea: {
        borderBottomWidth: 1,
        borderBottomColor: "#bfbfbf",
    },
    eliminar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginLeft: 10,
        marginRight: 10,
        paddingTop: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#bfbfbf",
        fontSize: 25
    },
    botonEliminar:{
        backgroundColor: "#c08872",
        color: "#fff",
        borderRadius: 10
    }
});


export default Historial;