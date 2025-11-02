import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NotesListScreen from './screens/NotesListScreen';
import NoteEditorScreen from './screens/NoteEditorScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Notes"
          component={NotesListScreen}
          options={{ title: 'Notes' }}
        />
        <Stack.Screen
          name="EditNote"
          component={NoteEditorScreen}
          options={{ title: 'Edit Note' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
