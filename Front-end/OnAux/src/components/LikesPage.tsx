import React, { useState, useContext, useEffect } from 'react';
import { Text, Button, StyleSheet, View, TextInput, FlatList, SafeAreaView, SectionList } from 'react-native';
import { CookieContext } from '../../cookie-context';

function LikesPage({ navigation }): JSX.Element {
  const [ likes, setLikes ] = useState([]);
  const { cookie, updateCookie } = useContext(CookieContext);

  const getLikes = () => {
    return fetch('http://13.59.212.151:8000/user/likes', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + cookie,
	'Content-Type': 'application/json',
      },
    })
    .then((resp) => {
      return resp.json();
    })
    .then((json) => {
      console.log('getLikes json!');
      console.log(json);
      setLikes(json);
    })
    .catch((err) => console.error(err));
  }

  const Item = ({ song }) => (
    <View style={styles.itemdiv}>
      <View style={styles.songArtist}>
        <View styles={styles.item}>
	  <Text style={styles.entry}>{typeof song.songName === 'undefined' ? ' ' : song.songName}</Text>
	  <Text style={styles.artist}>{typeof song.artist === 'undefined' ? ' ' : song.artist}</Text>
	</View>
      </View>
    </View>
  );

  useEffect(() => {
    getLikes();
  }, []);

  const likedSongs = [
    {
      title: 'Liked Songs',
      data: likes,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <SafeAreaView style={styles.container}>
	  <SectionList
	    sections={likedSongs}
	    keyExtractor={(item, index) => item + index}
	    renderItem={({ item }) => <Item song={item} />}
	    renderSectionHeader={({ section: { title } }) => (
	      <Text style={styles.heading}>{typeof title === 'undefined' ? ' ' : title}</Text>
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
    //textAlign: 'center',
  },
  entry: {
    fontSize: 16,
    //textAlign: 'left',
  },
  artist: {
    fontSize: 10,
    //textAlign: 'left',
  },
  title: {
    fontSize: 40,
    //textAlign: 'center',
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

export default LikesPage;