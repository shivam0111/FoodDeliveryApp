import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp } from '../features/auth/authSlice';
import handleApiError from '../utils/handleApiError';

export default function OTPScreen({ navigation }) {
  const [otp, setOtp] = useState('');
  const dispatch = useDispatch();
  const { mobile, loading } = useSelector(state => state.auth);

  const handleVerify = () => {
    if (otp.length !== 4) {
      Alert.alert('Invalid OTP', 'Please enter a 4-digit OTP.');
      return;
    }

    dispatch(verifyOtp({ mobile, otp }))
      .unwrap()
      .then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Dashboard' }],
        });
      })
      .catch(err => handleApiError(err));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter OTP sent to {mobile}</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        maxLength={4}
        value={otp}
        onChangeText={setOtp}
        placeholder="4-digit OTP"
      />
      <Button title={loading ? 'Verifying...' : 'Verify'} onPress={handleVerify} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  label: { fontSize: 18, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    padding: 10,
    fontSize: 16,
    borderRadius: 4,
  },
});
