import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import NoteItem from '../components/NoteItem';
import * as Storage from '../storage/Storage';
import { getWeather } from '../weather/WeatherService';

export default function NotesListScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) return;
    (async () => {
      const loaded = await Storage.loadNotes();
      setNotes(loaded);
    })();
  }, [isFocused]);

  
  
  useEffect(() => {
    (async () => {
      try {
        const data = await getWeather();
        setWeather(data);
      } catch (e) {
        console.warn('Weather fetch failed:', e);
      } finally {
        setLoadingWeather(false);
      }
    })();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 22, fontWeight: '700' }}>Notes</Text>
          {weather && (
            <Text style={{ fontSize: 14, color: '#555', marginTop: 2, marginBottom: 6 }}>
              {weather.city}: {weather.temp}°C
            </Text>
          )}
        </View>
      ),
    });
  }, [navigation, weather]);


  const shakeAnim = new Animated.Value(0);
  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 5, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -5, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 5, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true }),
    ]).start();
  };

  const onDeleteNote = (note) => {
    Alert.alert(
      'Delete note',
      `Are you sure you want to delete the note "${note.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            triggerShake();
            setTimeout(async () => {
              const updated = notes.filter((n) => n.id !== note.id);
              setNotes(updated);
              await Storage.saveNotes(updated);
            }, 180);
          },
        },
      ]
    );
  };

  const onDeleteAll = () => {
    if (notes.length === 0) return;
    Alert.alert('Delete all notes', 'Are you sure you want to delete all notes?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete all',
        style: 'destructive',
        onPress: async () => {
          await Storage.clearNotes();
          setNotes([]);
        },
      },
    ]);
  };

  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        transform: [{ translateX: shakeAnim }],
      }}
    >
      {notes.length === 0 ? (
        <Text
          style={{
            textAlign: 'center',
            marginTop: 40,
            color: '#777',
            fontSize: 16,
          }}
        >
          You don’t have any notes yet
        </Text>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
          renderItem={({ item }) => (
            <NoteItem
              item={item}
              onPress={(it) => navigation.navigate('EditNote', { note: it })}
              onDelete={onDeleteNote}
            />
          )}
        />
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate('EditNote')}
        activeOpacity={0.6}
        style={{
          position: 'absolute',
          bottom: 25,
          right: 25,
          padding: 10,
        }}
      >
        <Ionicons name="add" size={36} color="#007AFF" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onDeleteAll}
        activeOpacity={0.6}
        style={{
          position: 'absolute',
          bottom: 35,
          left: 35,
        }}
      >
        <Text
          style={{
            color: notes.length === 0 ? '#d1d1d1' : '#ff6b6b',
            fontSize: 16,
            fontWeight: '500',
          }}
        >
          Clear all
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
