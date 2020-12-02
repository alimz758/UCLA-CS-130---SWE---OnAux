import React, { useState, useContext } from 'react';
import { Button, StyleSheet, View, TextInput } from 'react-native';
import { CookieContext } from '../../cookie-context';

function CreateSessionPage({ navigation }): JSX.Element {

  const [sesId, setSesId] = useState("");
  const { cookie, updateCookie } = useContext(CookieContext);

  const createSession = () => {
    console.log('CreateSession Says: ');
    console.log(cookie);
    try {
      return fetch('http://13.59.212.151:8000/session/create', {
        method: 'POST',
	headers: {
	  Authorization: 'Bearer ' + cookie,
	  'Content-Type': 'application/json',
	},
	body: JSON.stringify({
	  sessionName: sesId,
	}),
      })
      .then((resp) => console.log(resp));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
	  style={styles.textInput}
	  onChangeText={text => setSesId(text)}
	/>
	<Button
	  title='Create'
	  onPress={createSession}
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
  form: {
    flex: 1,
    justifyContent: 'center',
    width: '80%',
  },
  textInput: {
    backgroundColor: 'rgba(215,215,215,1.0)',
    color: 'rgba(125,125,125,1.0)',
    borderRadius: 50,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});

export default CreateSessionPage;