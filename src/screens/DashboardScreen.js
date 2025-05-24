import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLanguage } from '../features/language/languageSlice';
import handleApiError from '../utils/handleApiError';

export default function DashboardScreen() {
  const dispatch = useDispatch();
  const { current, loading } = useSelector(state => state.language);
  const mobile = useSelector(state => state.auth.mobile);

  const handleLanguageToggle = () => {
    dispatch(toggleLanguage(current))
      .unwrap()
      .then(newLang => console.log('Switched to', newLang))
      .catch(err => handleApiError(err));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome, {mobile}</Text>
      <Text style={styles.text}>Current Language: {current.toUpperCase()}</Text>
      <Button
        title={loading ? 'Switching...' : `Switch to ${current === 'english' ? 'Hindi' : 'English'}`}
        onPress={handleLanguageToggle}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  text: { fontSize: 18, marginBottom: 20 },
});
