import React from "react";
import { View, Button, StyleSheet } from "react-native";

const SubirQR = () => {
    return (
        <View style={styles.boton}>
            <Button title="Subir QR" />
        </View>
    );
}
const styles = StyleSheet.create({
    boton: {
        width: 150,
        color: 'white',
        borderRadius: 10,
        // padding: 10,
        // margin: 10,
        textAlign: 'center'
    }
})

export default SubirQR;
