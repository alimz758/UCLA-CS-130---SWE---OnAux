import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, View, TextInput, Linking } from 'react-native';
import {
  auth as SpotifyAuth,
  remote as SpotifyRemote,
  ApiScope,
  ApiConfig
} from 'react-native-spotify-remote';

const spotifyConfig: ApiConfig = {
  clientID: "98c44c637a3d43aa9a86c92d884c8b3e",
  redirectURL: "onaux://session",
  tokenRefreshURL: "http://13.59.212.151:3000/refresh",
  tokenSwapURL: "http://13.59.212.151:3000/swap",
  scopes: [
    ApiScope.AppRemoteControlScope,
    ApiScope.PlaylistModifyPrivateScope,
    ApiScope.PlaylistModifyPublicScope,
    ApiScope.PlaylistReadCollaborativeScope,
    ApiScope.PlaylistReadPrivateScope,
    ApiScope.StreamingScope,
    ApiScope.UGCImageUploadScope,
    ApiScope.UserFollowModifyScope,
    ApiScope.UserFollowReadScope,
    ApiScope.UserLibraryModifyScope,
    ApiScope.UserLibraryReadScope,
    ApiScope.UserModifyPlaybackStateScope,
    //ApiScope.UserReadBirthDateScope,
    ApiScope.UserReadCurrentlyPlaying,
    ApiScope.UserReadCurrentlyPlayingScope,
    //ApiScope.UserReadEmailScope,
    ApiScope.UserReadPlaybackPosition,
    ApiScope.UserReadPlaybackStateScope,
    //ApiScope.UserReadPrivateScope,
    ApiScope.UserReadRecentlyPlayedScope,
    //ApiScope.UserTopReadScope,
  ],
}

function SessionPage(): JSX.Element {
  const [id, setId] = useState("");

  async function onQueuePress() {
    // search spotify api
    // add song to queue through api
    try {
      console.log("dog");
      const session = await SpotifyAuth.authorize(spotifyConfig);
      //await SpotifyRemote.playUri('');
      //await SpotifyRemote.connect(session.token);
      //await SpotifyRemote.queueUri('spotify:track:6IA8E2Q5ttcpbuahIej074');
      //await SpotifyRemote.seek(58);
    } catch(err) {
      console.error("Couldn't authorize/connect w spotify", err);
      console.log("Couldn't authorize/connect w spotify " + err);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.textInput}
          onChangeText={text => setId(text)}
        />
        <Button
          title='Queue'
	  onPress={onQueuePress}
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
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});

export default SessionPage;