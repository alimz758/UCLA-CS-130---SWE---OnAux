import React, { useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import { Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CookieContext } from './cookie-context';
import LoginPage from './src/components/LoginPage';
import SessionPage from './src/components/SessionPage';
import SessionListPage from './src/components/SessionListPage';
import CreateSessionPage from './src/components/CreateSessionPage';
import HybridSessionPage from './src/components/HybridSessionPage';
import HybridDJPage from './src/components/HybridDJPage';
import LikesPage from './src/components/LikesPage';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App: () => ReactNode = () => {

    const [cookie, setCookie] = useState("");
    const [user, setUser] = useState("");

    function updateCookie(c) {
	setCookie(c);
    }

    function updateUser(u) {
	setUser(u);
    }

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
      <CookieContext.Provider value={{ cookie, updateCookie, user, updateUser }}>
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen
              name='Login'
	      component={LoginPage}
	    />
	    <Tab.Screen
	      name='Find'
	      component={HybridSessionPage}
	    />

	    <Tab.Screen
	      name='Host'
	      component={HybridDJPage}
	    />

	    <Tab.Screen
	      name='Likes'
	      component={LikesPage}
	    />

	  </Tab.Navigator>
        </NavigationContainer>
      </CookieContext.Provider>	    
    );
}

export default App;
