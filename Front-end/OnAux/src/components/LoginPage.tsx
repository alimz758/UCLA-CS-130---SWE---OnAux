import React, { useState } from 'react';
import { Button, Image, StyleSheet, View, TextInput } from 'react-native';
import LoginButton from './LoginButton';

function LoginPage({ navigation }): JSX.Element {

  const [uid, setUid] = useState("");
  const [pw, setPw] = useState("");
  
  onLoginPress = () => {
    navigation.navigate('Session', { name: 'Session' });
  }

  const signUpAction = () => {
    console.log(JSON.stringify({
        username: uid,
	password: pw,
	email: 'abc@gmail.com',
      }));
    return fetch('http://localhost:8000/user/signup', {
      method: 'POST',
      body: JSON.stringify({
        username: uid,
	email: 'abc@gmail.com',
	password: pw,
	firstName: 'joe',
	lastName: 'clegg',
      })
    }).then((response) => response.json())
    .then((json) => {
      console.log(json);
    })
    .catch((error) => {
      console.error(error);
    });
  }

  return (
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
	  onPress={onLoginPress}
	/>
      </View>
    </View>
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