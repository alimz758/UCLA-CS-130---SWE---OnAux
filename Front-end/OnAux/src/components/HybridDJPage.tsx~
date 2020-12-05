import React, { useState, useContext, useEffect } from 'react';
import DJPage from './DJPage';
import CreateSessionPage from './CreateSessionPage';
import { CookieContext } from '../../cookie-context';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function HybridDJPage({ navigation }): JSX.Element {
  const { cookie, updateCookie } = useContext(CookieContext);

  return (
   <Stack.Navigator>
     <Stack.Screen name='Host Session' component={CreateSessionPage} />
     <Stack.Screen name='DJ Panel' component={DJPage} />
   </Stack.Navigator>
  );
}

export default HybridDJPage;