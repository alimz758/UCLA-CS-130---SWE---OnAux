import React, { useState, useContext } from 'react';
import { Button, Image, StyleSheet, View, TextInput } from 'react-native';
import LoginButton from './LoginButton';
import { CookieContext } from '../../cookie-context';

function LoginPage({ navigation }): JSX.Element {

  const [uid, setUid] = useState("");
  const [pw, setPw] = useState("");
  const { cookie, updateCookie } = useContext(CookieContext);
  
  onLoginPress = () => {
    navigation.navigate('Session', { name: 'Session' });
  }

  const signUpAction = () => {
    return fetch('http://13.59.212.151:8000/user/signup', {
      method: 'POST',
      headers: {
        //Authorization: 'Bearer ',
	'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: uid,
	email: 'ladidadida@gmail.com',
	password: pw,
	firstName: 'john',
	lastName: 'doe',
      }),
    }).then((response) => response.json())
    .then((json) => {
      updateCookie(json.token);
      //updateUser(uid);
      console.log(json.token);
    })
    .catch((error) => {
      console.error(error);
    });
  }

  const loginAction = () => {
    return fetch('http://13.59.212.151:8000/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: uid,
	password: pw,
      }),
    }).then((response) => response.json())
    .then((json) => {
      updateCookie(json.token);
      console.log(json.token);
    })
    .catch((error) => {
      console.error(error);
    });
  }

  return (
//    <CookieContext.Consumer>
//    {context => (
      <View style={styles.container}>
        <View style={styles.form}>
          <TextInput
	    style={styles.textInput}
	    onChangeText={text => setUid(text)}
	  />
	  <TextInput
	    style={styles.textInput}
	    onChangeText={text => setPw(text)}
	  />
          <Button
	    title='Login'
	    onPress={loginAction}
	  />
	  <Button
	    title='Sign Up'
	    onPress={signUpAction}
	  />
        </View>
      </View>
//      )}
//    </CookieContext.Consumer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1.0)',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    width: '80%',
  },
  textInput: {
    backgroundColor: 'rgba(215,215,215,1.0)',
    color: 'rgba(125,125,125,1.0)',
    borderRadius: 50,
    marginBottom:10,
    marginLeft:20,
    marginRight:20,
    fontSize:20,
    paddingVertical:10,
    paddingHorizontal:20,
  }
});

export default LoginPage;