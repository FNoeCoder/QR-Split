import react from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

import Calcular from "./Screens/calcular.jsx";
import Scan from "./Screens/scan.jsx";
import CrearQR from "./Screens/crearQR.jsx";
import historial from "./Screens/historial.jsx";

import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
        <Tab.Navigator
            initialRouteName="CrearQR"
            tabBarOptions={{
                activeTintColor: "#559399"
            }}
        >
            <Tab.Screen name="Scan" component={Scan} 
            options={{
                tabBarLabel: 'Escanear',
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="qrcode-scan" color={color} size={size} />
                ),
                headerStyle: {
                    backgroundColor: '#559399',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
            }}
            />

            <Tab.Screen name="CrearQR" component={CrearQR} 
            options={{
                tabBarLabel: 'CrearQR',
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="qrcode-plus" color={color} size={size} />
                ),
                // poner color de fondo
                headerStyle: {
                    backgroundColor: '#559399',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
            }}
            />

            <Tab.Screen name="Calcular" component={Calcular} 
            options={{
                tabBarLabel: 'Calcular',
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="calculator" color={color} size={size} />
                ),
                headerStyle: {
                    backgroundColor: '#559399',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
            }}
            />  

            <Tab.Screen name="Historial" component={historial} 
            options={{
                tabBarLabel: 'Historial',
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="history" color={color} size={size} />
                ),
                headerStyle: {
                    backgroundColor: '#559399',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
            }}
            />

        </Tab.Navigator>
        </NavigationContainer>
    );
}

export default Navigation;
