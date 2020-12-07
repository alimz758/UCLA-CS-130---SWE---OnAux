import React, { useState, useContext, useEffect } from 'react';
import { Text, Button, StyleSheet, View, TextInput, FlatList, SafeAreaView, SectionList } from 'react-native';
import { CookieContext } from '../../cookie-context';
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


const getSession = async (seshId, cookie, setHistory, setQueue, setId, setSong) => {
  return fetch('http://13.59.212.151:8000/session/session-id='+seshId, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + cookie,
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json())
  .then((json) => {
    console.log('octopus');
    console.log(json);
    console.log('HISTORY: ' + json.history);
    setSong(json.currentSongInfo);
    setHistory(json.history);
    setQueue(json.requestedSongObj);
    setId(json.sessionName);
  }).catch((err) => console.error(err));
}

const getSongFromText = async (token, songr, seshId, cookie, setHistory, setQueue, setId) => {
  console.log("mark4");
  console.log(token);

  await fetch('https://api.spotify.com/v1/search?q='+songr+'&type=track&market=US&limit=1', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  }).then((resp) => resp.json())
  .then((json) => json.tracks.items[0])
  .then((track) => {
    //console.log(track);
    const song = {
      songuri: track.uri,
      songName: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
    };
    console.log(song);
    return song;
  })
  .then((song) => sendApiSongReq(song, seshId, cookie, setHistory, setQueue, setId))
  .catch((error) => console.error(error));
}

const sendApiSongReq = async (song, seshId, cookie, setHistory, setQueue, setId) => {
  await fetch('http://13.59.212.151:8000/session/session-id='+seshId+'/request-song', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + cookie,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      songInfo: song,
      vote: '1',
    }),
  }).then((resp) => resp.json())
  .then((json) => {
    console.log('SENDAPISONGREQ JSON: ' + json);
    console.log('SENDAPISONGREQ HISTORY: ' + json.history);
    console.log('SENDAPISONGREQ REQ: ' + json.requestedSongObj);
    //setHistory(json.history);
    setQueue(json.requestedSongObj);
    setId(json.sessionName);
  })
  .catch((err) => console.error(err));
}

const authorizeSpotify = async (setTok) => {
  await SpotifyAuth.authorize(spotifyConfig)
  .then((session) => { console.log('ACCESS TOK: ' + session.accessToken); setTok(session.accessToken); })
  .catch((err) => console.error(err));
}

function GuestPage({ route, navigation }): JSX.Element {
  const [id, setId] = useState("");
  const [req, setReq] = useState("");
  const [tok, setTok] = useState("");
  const [queue, setQueue] = useState([]);
  const [history, setHistory] = useState([]);
  const [song, setSong] = useState(null);
  const { seshId } = route.params;
  const { cookie, updateCookie } = useContext(CookieContext);

  //console.log(seshId);


  const Item = ({ song }) => (
    <View style={styles.itemdiv}>
      <Text style={styles.votebtn}>{(typeof song.vote === 'undefined' ? ' ' : song.vote ) + ' '}</Text>
      <View style={styles.songArtist}>
        <View style={styles.item}>
	  <Text style={styles.entry}>{typeof song.songName === 'undefined' ? ' ' : song.songName}</Text>
	  <Text style={styles.artist}>{typeof song.artist === 'undefined' ? ' ' : song.artist}</Text>
	</View>
      </View>
      <Button
        style={styles.votebtn}
	title='+'
	onPress={() => voteSong(song)}
      />
    </View>
  );

  const voteSong = async ( song ) => {
    console.log('votesong!');
    console.log(song);
    return fetch('http://13.59.212.151:8000/session/session-id='+seshId+'/request-song', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + cookie,
	'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        songInfo: song,
	vote: '1',
      }),
    })
    .then((resp) => {
      return resp.json();
    })
    .then((json) => {
      console.log(json);
      setQueue(json.requestedSongObj);
    })
    .catch((err) => console.error(err));
  }

  useEffect(() => {
    let mounted = true;

    const getSesh = async () => {
      await getSession(seshId, cookie, setHistory, setQueue, setId, setSong);
    }

    if(mounted){
      getSesh();
    }
    return () => mounted = false;
  }, []);

  useEffect(() => {

    const authSpot = async () => {
      await authorizeSpotify(setTok)
      .then(() => SpotifyRemote.connect(tok));
    }

    if(tok == ""){
      authSpot();
    } else {
      SpotifyRemote.connect(tok);
    }
  });

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

  const saveSong = () => {
    return fetch('http://13.59.212.151:8000/user/add-song', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + cookie,
	'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        songInfo: song,
      })
    })
    .then((resp) => {
      return resp.json();
    })
    .then((json) => {
      console.log('savesong!');
      console.log(json);
    })
    .catch((err) => console.error(err));
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>{id}</Text>
        <TextInput
	  style={styles.textInput}
	  onChangeText={text => setReq(text)}
	/>
	<Button
	  title='Request'
	  onPress={() => getSongFromText(tok, req, seshId, cookie, setHistory, setQueue, setId)}
	/>
	<SafeAreaView style={styles.container}>
	  <SectionList
	    sections={queueHis}
	    keyExtractor={(item, index) => item + index}
	    renderItem={({ item }) => <Item song={item} />}
	    renderSectionHeader={({ section: { title } }) => (
	      <Text style={styles.heading}>{typeof title === 'undefined' ? ' ' : title}</Text>
	    )}
	  />
	</SafeAreaView>
	<View style={styles.itemdiv}>
          <View style={styles.songArtist}>
	    <Text style={styles.entry}>{song === null ? ' ' : 'Now Playing'}</Text>
            <Text style={styles.entry}>{song === null ? ' ' : song.songName}</Text>
	    <Text style={styles.artist}>{song === null ? ' ' : song.artist}</Text>
          </View>
	  <Button
	    title='like'
	    onPress={saveSong}
	  />
	</View>
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
    fontSize: 25,
    textAlign: 'center',
  },
  entry: {
    fontSize: 16,
    textAlign: 'left',
  },
  artist: {
    fontSize: 10,
    textAlign: 'left',
  },
  title: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 20,
  },
  itemdiv: {
    flexDirection: 'row',
  },
  songArtist: {
    flexDirection: 'column',
  },
  votebtn: {
    fontSize: 16,
  }
});

export default GuestPage;