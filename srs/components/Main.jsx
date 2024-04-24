import React from 'react';
import Constans from 'expo-constants';
import { View, Text } from 'react-native';

const Main = () => {
    return (
        <View style={{ marginTop:Constans.statusBarHeight, flexGrow:1}}>
            <Text>My Main Component</Text>
        </View>
    );
}

export default Main;