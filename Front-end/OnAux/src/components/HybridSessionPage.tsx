import React, { useState, useContext, useEffect } from 'react';
import SessionPage from './SessionPage';
import SessionListPage from './SessionListPage';
import GuestPage from './GuestPage';
import { CookieContext } from '../../cookie-context';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function HybridSessionPage({ navigation }): JSX.Element {
  const { cookie, updateCookie } = useContext(CookieContext);

  
  return (
    <Stack.Navigator>
      <Stack.Screen name='Sessions' component={SessionListPage} />
      <Stack.Screen name='Guest' component={GuestPage} />
    </Stack.Navigator>
  );

}

export default HybridSessionPage;