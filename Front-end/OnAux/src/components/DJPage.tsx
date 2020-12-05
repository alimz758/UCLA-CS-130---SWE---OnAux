import React, { useState, useContext, useEffect } from 'react';
import { Text, Button, StyleSheet, View, TextInput, FlatList, SafeAreaView, SectionList } from 'react-native';
import { CookieContext } from '../../cookie-context';
import {
  auth as SpotifyAuth,
  remote as SpotifyRemote,
  ApiScope,
  ApiConfig,
} from 'react-native-spotify-remote';

const spotifyConfig: ApiConfig = {
  clientID: '98c44c637a3d43aa9a86c92d884c8b3e',
  redirectURL: 'onaux://session',
  tokenRefreshURL: 'http://13.59.212.151:3000/refresh',
  tokenSwapURL: 'http://13.59.212.151:3000/swap',
  scopes: [
    ApiScope.AppRemoteControlScope,
    ApiScope.PlaylistModifyPrivateScope,
    ApiScope.PlaylistModifyPublicScope,
    ApiScope.PlaylistReadCollaborativeScope,
    ApiScope.PlaylistReadPrivateScope,
    ApiScope.StreamingScope,
    ApiScope.UserModifyPlaybackStateScope,
    ApiScope.UserReadCurrentlyPlaying,
    ApiScope.UserReadCurrentlyPlayingScope,
    ApiScope.UserReadPlaybackPosition,
    ApiScope.UserReadPlaybackStateScope,
    ApiScope.UserReadRecentlyPlayedScope,
  ],
}

function DJPage({ route, navigation }): JSX.Element {
  const [tok, setTok] = useState("");
  const [req, setReq] = useState("");
  const [id, setId] = useState("Josephs Session");
  const [queue, setQueue] = useState([]);
  const [history, setHistory] = useState([]);
  const [curp, setCurp] = useState(null);
  const { sesh } = route.params;
  const { cookie, updateCookie } = useContext(CookieContext);

  const Item = ({ song }) => (
    <View style={styles.itemdiv}>
      <Text style={styles.votebtn}>{song.vote+' '}</Text>
      <View style={styles.songArtist}>
        <View style={styles.item}>
	  <Text style={styles.entry}>{song.songName}</Text>
	  <Text style={styles.artist}>{song.artist}</Text>
	</View>
      </View>
    </View>
  );

  const authorizeSpotify = async () => {
    await SpotifyAuth.authorize(spotifyConfig)
    .then((session) => setTok(session.accessToken))
    .catch((err) => console.error(err));
  }

  const getSongFromText = async () => {
    return fetch('https://api.spotify.com/v1/search?q='+req+'&type=track&market=US&limit=1', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + tok,
	'Content-Type': 'application/json',
      },
    }).then((resp) => resp.json())
    .then((json) => json.tracks.items[0])
    .then((track) => {
      const song = {
        songuri: track.uri,
	songName: track.name,
	artist: track.artists[0].name,
	album: track.album.name
      };
      setCurPlaying(song);
      setCurp(song);
      queueSong(track.uri);
    })
    .catch((err) => console.error(err));
  }

  const setCurPlaying = async (songinfo) => {
    await fetch('https://13.59.212.151:8000/session/session-id='+sesh.newSessionInfo._id+'/set-current-song', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + cookie,
	'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        songInfo: songinfo,
      }),
    })
    .then((resp) => resp.json())
    .then((json) => {
      console.log(json);
    })
    .catch((err) => console.error(err));
  }

  const queueSong = async (uri) => {
    await SpotifyRemote.queueUri(uri);
  }

  useEffect(() => {
    const authSpot = async () => {
      await authorizeSpotify()
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

  const pressbtn = () => {
    console.log('press');
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>{sesh.newSessionInfo.sessionName}</Text>
	<TextInput
	  style={styles.textInput}
	  onChangeText={text => setReq(text)}
	/>
	<Button
	  title='Request'
	  onPress={getSongFromText}
	/>
	<SafeAreaView style={styles.container}>
	  <SectionList
	    sections={queueHis}
	    keyExtractor={(item, index) => item + index}
	    renderItem={({ item }) => <Item song={item} />}
	    renderSectionHeader={
	      ({ section: { title } }) => (
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
  },
});

export default DJPage;