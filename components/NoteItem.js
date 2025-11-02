import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NoteItem({ item, onPress, onDelete }) {

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderBottomColor: '#e6e6e6',
        borderBottomWidth: 1,
        paddingVertical: 14,
        paddingHorizontal: 20,
      }}
    >
      <TouchableOpacity
        onPress={() => onPress(item)}
        style={{ flex: 1, marginRight: 10 }}
        activeOpacity={0.7}
      >
        <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 2 }}>{item.title}</Text>
        <Text numberOfLines={2} style={{ fontSize: 14, color: '#666', marginBottom: 2 }}>
          {item.content}
        </Text>
        <Text style={{ fontSize: 12, fontWeight: '300', color: '#666', marginBottom: 2, flexDirection:'row', justifyContent:'flex-end', flex: 1 }}>{item.date}</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <TouchableOpacity onPress={() => onPress(item)} activeOpacity={0.6}>
          <Ionicons name="pencil-outline" size={20} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onDelete(item)} activeOpacity={0.6}>
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
