import * as SecureStore from 'expo-secure-store';

const NOTES_KEY = 'notes';

export async function saveNotes(notes) {
  try {
    const serialized = JSON.stringify(notes || []);
    await SecureStore.setItemAsync(NOTES_KEY, serialized);
    return true;
  } catch (e) {
    console.error('Storage.saveNotes error:', e);
    return false;
  }
}

export async function loadNotes() {
  try {
    const raw = await SecureStore.getItemAsync(NOTES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Storage.loadNotes error:', e);
    return [];
  }
}

export async function clearNotes() {
  try {
    await SecureStore.deleteItemAsync(NOTES_KEY);
    return true;
  } catch (e) {
    console.error('Storage.clearNotes error:', e);
    return false;
  }
}
