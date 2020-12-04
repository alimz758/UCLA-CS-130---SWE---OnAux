import React, { useState, useContext } from 'react';
import { Button, Image, StyleSheet, View, TextInput } from 'react-native';
import SignupButton from './SignupButton';
import { CookieContext } from '../../cookie-context';

function SignupPage({ navigation }): JSX.Element {

  const [fname, setfName] = useState("");
  const [lname, setlName] = useState("");
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");
  const [pw, setPw] = useState("");
  const { cookie, updateCookie } = useContext(CookieContext);
  
  onSignupPress = () => {
    navigation.navigate('Login', { name: 'Login' });
  }

  const signUpAction = () => {
      return fetch('http://13.59.212.151:8000/user/signup', {
      method: 'POST',
      headers: {

	'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: uid,
	    email: email,
	    password: pw,
	    firstName: fname,
	    lastName: lname,
      })
    })
      .then((response) => response.json())
          .then((json) => {
            if(json.hasOwnProperty('token')) {
            
            updateCookie(json.token);
            }
            console.log(json);
            navigation.navigate('Login', { name: 'Login' });
          })
          .catch((error) => {
            console.error(error);
          });
    //navigation.navigate('Login', { name: 'Login' });


  }

  return (

      <View style={styles.container}>
        <View style={styles.form}>
          <TextInput
          
          	style={styles.textInput}
            placeholder="First Name"
          	onChangeText={text => setfName(text)}
          />
          <TextInput
          	style={styles.textInput}
            placeholder="Last Name"
          	onChangeText={text => setlName(text)}
          />
          <TextInput
          	style={styles.textInput}
            placeholder="Email"
            onChangeText={text => setEmail(text)}
          />
          <TextInput
	        style={styles.textInput}
          placeholder="Username"
	        onChangeText={text => setUid(text)}
	      />
	      <TextInput
	        style={styles.textInput}
          placeholder="Password"
	        onChangeText={text => setPw(text)}
	      />
          <Button
	        title='Sign Up'
          color = '#841584'
	        onPress={signUpAction}
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

export default SignupPage;