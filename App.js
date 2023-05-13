import React, { useState, useRef, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView,StyleSheet, Image } from 'react-native';
import axios from 'axios';
import { Buffer } from 'buffer';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
global.Buffer = Buffer;

const CLIENT_ID = '2cda8b32630d4194b20ca0c5063e1f1c';
const CLIENT_SECRET = 'b2704cb0e4a94b5e98cf60f9ad9d0089';

const emotionalSongs = [
  'The Scientist - Coldplay',
  'Someone Like You - Adele',
  'Say You Love Me - Jessie Ware',
  'All of Me - John Legend',
  'Hello - Adele',
  'Fix You - Coldplay',
  'Chasing Cars - Snow Patrol',
  'In the end - Tommee Profit',
  'Stay with Me - Sam Smith',
  'Love on Top - Beyonce',
  'Skinny Love - Bon Iver',
  'A Thousand Years - Christina Perri',
  'When I Was Your Man - Bruno Mars',
  'I Will Always Love You - Whitney Houston',
  'Without You - Mariah Carey',
  'The One That Got Away - Katy Perry',
  'All I Ask - Adele',
  'Let Her Go - Passenger',
  'Un-Break My Heart - Toni Braxton',
  'I Don\'t Want to Miss a Thing - Aerosmith'
];

const App = () => {
  const [query, setQuery] = useState("");
  useEffect(() => {
   
    setQuery(emotionalSongs[Math.floor(Math.random() * emotionalSongs.length)]);
 
    searchTracks();
}, []);
  const [tracks, setTracks] = useState([]);
  const [accessToken, setAccessToken] = useState('');
  const soundRef = useRef(null);

  const getAccessToken = async () => {
    const response = await axios.post('https://accounts.spotify.com/api/token', 
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
        }
      }
    );
    setAccessToken(response.data.access_token);
  }

  const searchTracks = async () => {
    try {
      const response = await axios.get(`https://api.spotify.com/v1/search?type=track&q=${query}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setTracks(response.data.tracks.items);
    } catch (error) {
      console.log(error);
    }
  };

  const playTrack = async (previewUrl) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }
      soundRef.current = new Audio.Sound();
      await soundRef.current.loadAsync(
        { uri: previewUrl },
        { shouldPlay: false, positionMillis: 0 },
        false,
        false,
        true,
        { progressUpdateIntervalMillis: 1000 }
      );
      soundRef.current.setOnPlaybackStatusUpdate((playbackStatus) => {
        console.log("durationMillis:", playbackStatus.durationMillis);
        console.log("positionMillis:", playbackStatus.positionMillis);
        if (playbackStatus.isLoaded && !playbackStatus.isPlaying) {
          soundRef.current.playAsync();
        }
      });
    } catch (error) {
      console.log('failed to load the sound', error);
    }
  }
useEffect(() => {
  if(query){
    searchTracks();

  }
}, [query]);

      return (
      <View style={styles.container}>
       <Text  style={styles.button}>
    <Ionicons name="ios-arrow-back" size={30} color="white" />
    </Text>

<Text style={styles.header}>Music</Text>

<View style={styles.searchContainer}>
<TouchableOpacity style={styles.searchIcon} >
  <Feather name="search" size={24} color="black" />
 </TouchableOpacity>
<TextInput
      style={styles.searchBar}
      placeholder="Enter your emotion..."
      onChangeText={text => setQuery(text)}
      onSubmitEditing={searchTracks}
      value={query}
      />
</View>
    
      <ScrollView style={styles.tracksContainer}>
      {tracks.map(track => (
      <TouchableOpacity
      style={styles.track}
      key={track.id}
      onPress={() => playTrack(track.preview_url)}
      >
      <Image
      source={{ uri: track.album.images[0].url }}
      style={styles.albumImage}
      />
      <View style={styles.trackDetails}>
      <Text style={styles.trackName}>{track.name}</Text>
      <Text style={styles.trackArtist}>{track.artists[0].name}</Text>
      </View>
      <Feather name="play-circle" size={24} color="black" />
      </TouchableOpacity>
      ))}
      </ScrollView>
      </View>
      )
  }

            
      const styles = StyleSheet.create({
      container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      backgroundColor: "lightgray"
      },
      title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 20,
      },
      searchBar: {
      
      width: '100%',
    
      padding: 10,

      },
      header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10,
        marginRight: 300,
        color: "white",
        },
      tracksContainer: {
      width: '100%',
      },
      track: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      marginBottom: 10,
      borderRadius: 10,
      },
      albumImage: {
      width: 50,
      height: 50,
      marginRight: 10,
      borderRadius: 10,
      },
      trackDetails: {
      flex: 1,
      },
      trackName: {
      fontWeight: 'bold',
      },
      trackArtist: {
      fontStyle: 'italic',
      },
      button: {
        marginRight: 350,
        marginTop: 20,

      
      },
      searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 15,
        paddingLeft:10,
        width: "100%",
        backgroundColor: "#E6E2E2",
        borderColor: "#E6E2E2",
        
      },
      });
      
      export default App;