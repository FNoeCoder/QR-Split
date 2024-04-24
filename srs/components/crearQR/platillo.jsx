import React,  { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Input, Button } from 'react-native-elements';

const Platillo = ({nombreInicial, precioInicial}) => {
    const [nombre, setNombre] = useState(nombreInicial);
    const [precio, setPrecio] = useState(precioInicial);

    return (
        <View>
            <Input 
                placeholder="Nombre del platillo" 
                defaultValue={nombre} 
                onChangeText={setNombre} 
            />
            <Input 
                placeholder="Precio" 
                defaultValue={precio} 
                onChangeText={setPrecio} 
            />        
        </View>

    );
}

export default Platillo;