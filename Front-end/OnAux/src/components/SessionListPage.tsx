import React, { useState, useContext, useEffect } from 'react';
import { Text, TouchableOpacity, Button, Image, StyleSheet, View, TextInput, FlatList, SafeAreaView } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { CookieContext } from '../../cookie-context';

function SessionListPage({ navigation }): JSX.Element {
  const { cookie, updateCookie } = useContext(CookieContext);
  const [ sessions, updateSessions ] = useState([])
  const [ seshId, setSeshId] = useState('')

  const fetchSessions = () => {
    console.log(cookie);
    return fetch('http://13.59.212.151:8000/session/all', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + cookie,
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json())
    .then((json) => {
      console.log(json);
      updateSessions(json);
    }).catch((error) => console.error(error));
  }

  useEffect(() => {
    fetchSessions();
  }, []);

  const Item = ({ title, onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.seshname}>{title}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Item
        title={item.sessionName}
	onPress={() => selectSession(item._id)}
      />
    </View>
  );

  const Sesh = ({ sesh, onPress }) => (
      <Text>help</Text>
  );

  selectSession = (id) => {
    console.log(id);
    navigation.navigate('Guest', {
      seshId: id,
    });
  }

  return (
      <SafeAreaView style={styles.container}>
	<FlatList
	  data={sessions}
	  renderItem={renderItem}
	  keyExtractor={(item) => item._id}
	/>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1.0)',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sesh: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  item: {
//    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  seshname: {
    fontSize: 32,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    width: '80%',
  },
});

export default SessionListPage;