import React from 'react';
import { View } from 'react-native';
import Platillo from './platillo.jsx';

const ListaDePlatillos = ({ platillos }) => {
    return (
        <View>
            {platillos.map((platillo, index) => (
                <Platillo 
                    key={index} 
                    nombreInicial={platillo.nombre} 
                    precioInicial={platillo.precio} 
                />
            ))}
        </View>
    );
}
export default ListaDePlatillos;