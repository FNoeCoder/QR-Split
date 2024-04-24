import React from "react";
import { View, Button, StyleSheet } from "react-native";

const SubirMenu = () => {
    return (
        <View style={styles.boton}>
            <Button title="Subir Memú" />
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

export default SubirMenu;