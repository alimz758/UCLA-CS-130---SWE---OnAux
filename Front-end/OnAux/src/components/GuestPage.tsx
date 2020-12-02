import React, { useState, useEffect } from 'react';
import { Text, Button, StyleSheet, View, TextInput, FlatList, SafeAreaView, SectionList } from 'react-native';
import {
  auth as SpotifyAuth,
  remote as SpotifyRemote,
  ApiScope,
  ApiConfig,
}  from 'react-native-spotify-remote';

const spotifyConfig: ApiConfig = {
  clientID: '98c44c637a3d43aa9a86c92d884c8b3e',
  redirectURL: 'onaux://session',
  tokenRefreshURL: 'http://13.59.212.151:3000/refresh',
  tokenSwapURL: 'http://13.59.212.151:3000/swap',
  scopes: [
    ApiScope.AppRemoteControlScope,
    ApiScope.StreamingScope,
    ApiScope.UserLibraryModifyScope,
    ApiScope.UserLibraryReadScope,
    ApiScope.UserModifyPlaybackStateScope,
    ApiScope.UserReadCurrentlyPlaying,
    ApiScope.UserReadCurrentlyPlayingScope,
    ApiScope.UserReadPlaybackPosition,
    ApiScope.UserReadPlaybackStateScope,
    ApiScope.UserReadRecentlyPlayedScope,
  ],
}

const DATA = [
  {
    title: 'Queue',
    data: ['Marvins Room', 'Pyramids', 'Dont Think Twice its Alright'],
  },
  {
    title: 'History',
    data: ['Lost', 'Cameras', 'Draco']
  },
];

function GuestPage(): JSX.Element {
  const [id, setId] = useState("");
  const [req, setReq] = useState("");
  const [tok, setTok] = useState(null);
  const [queue, setQueue] = useState([]);
  const [history, setHistory] = useState([]);

  const Item = ({ title }) => (
    <View style={styles.item}>
      <Text style={styles.entry}>{title}</Text>
    </View>
  );

  const requestSong = () => {
    setQueue(queue.concat(req));
  }

  const queueHis = [
    {
      title: 'Queue',
      data: queue,
    },
    {
      title: 'History',
      data: history,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
	  style={styles.textInput}
	  onChangeText={text => setReq(text)}
	/>
	<Button
	  title='Request'
	  onPress={requestSong}
	/>
	<SafeAreaView style={styles.container}>
	  <SectionList
	    sections={queueHis}
	    keyExtractor={(item, index) => item + index}
	    renderItem={({ item }) => <Item title={item} />}
	    renderSectionHeader={({ section: { title } }) => (
	      <Text style={styles.heading}>{title}</Text>
	    )}
	  />
	</SafeAreaView>
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
    paddingVertical: 20,
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
  heading: {
    fontSize: 32,
  },
  entry: {
    fontSize: 16,
  }
});

export default GuestPage;