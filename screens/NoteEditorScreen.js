import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Button,
  Alert,
} from 'react-native';
import * as Storage from '../storage/Storage';

export default function NoteEditorScreen({ navigation, route }) {
  const existingNote = route.params?.note;
  const [title, setTitle] = useState(existingNote?.title || '');
  const [content, setContent] = useState(existingNote?.content || '');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button title="Save" onPress={saveNote} />,
    });
  }, [navigation, title, content]);

  const saveNote = async () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('Empty note', 'Please write something before saving.');
      return;
    }

    const notes = await Storage.loadNotes();
    let updated;
    if (existingNote) {
      updated = notes.map((n) =>
        n.title === existingNote.title && n.content === existingNote.content
          ? { title, content }
          : n
      );
    } else {
      updated = [...notes, { title, content, date :new Date().toDateString()}];
      console.log(updated)
    }

    await Storage.saveNotes(updated);
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: '#fff', padding: 20 }}>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          placeholderTextColor="#999"
          style={{
            fontSize: 20,
            fontWeight: '600',
            color: '#000',
            marginBottom: 12,
            borderBottomWidth: 1,
            borderColor: '#ddd',
            paddingBottom: 6,
          }}
        />
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="Write your note..."
          placeholderTextColor="#777"
          multiline
          style={{
            flex: 1,
            color: '#000',
            fontSize: 17,
            textAlignVertical: 'top',
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
