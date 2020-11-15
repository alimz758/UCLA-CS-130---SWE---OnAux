import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './src/components/LoginPage';
import SessionPage from './src/components/SessionPage';

const Stack = createStackNavigator();

const App: () => ReactNode = () => {

    useEffect(() => {
	Linking.getInitialURL().then(url => {
	    navigateHandler(url);
	});
	if (Platform.OS === 'ios') {
	    Linking.addEventListener('url', handleOpenURL);
	}
	return () => {
	    if(Platform.OS === 'ios') {
		Linking.removeEventListener('url', handleOpenURL);
	    }
	};
    }, [])

    const handleOpenURL = (event) => {
	navigateHandler(event.url);
    }

    const navigateHandler = async (url) => {
	if(url === 'onaux://session'){
	    navigation.navigate('Login', { name: 'Login' });
	}
    }

    
    return (
      <NavigationContainer>
        <Stack.Navigator>
	  <Stack.Screen
	    name='Login'
	    component={LoginPage}
	  />
	  <Stack.Screen
	    name='Session'
	    component={SessionPage}
	  />
	</Stack.Navigator>
      </NavigationContainer>
    );
}

export default App;
