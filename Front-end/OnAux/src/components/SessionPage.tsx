import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, View, TextInput, Linking } from 'react-native';
import { decode as atob, encode as btoa } from 'base-64';
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
  const [tok, setTok] = useState("");

  async function onQueuePress() {
    // search spotify api
    // add song to queue through api
    try {
      if(tok === ""){
        const session = await SpotifyAuth.authorize(spotifyConfig);
        await SpotifyRemote.connect(session.accessToken);
        setTok(session.accessToken);
      }
      let uri = await getSongFromText(tok);
      await SpotifyRemote.queueUri(uri);
    } catch(err) {
      console.error("Couldn't authorize/connect w spotify", err);
      console.log("Couldn't authorize/connect w spotify " + err);
    }
  }

  const getSongFromText = async (token) => {
    try{
      let resp = await fetch('https://api.spotify.com/v1/search?q='+id+'&type=track&market=US&limit=1', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      let json = await resp.json();
      return json.tracks.items[0].uri;
    } catch (err) {
      console.log('error encountered requesting songs');
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.textInput}
          onChangeText={text => setId(text)}
        />
        <Button
          title='queue'
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