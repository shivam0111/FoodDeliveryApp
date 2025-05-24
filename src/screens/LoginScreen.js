// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
// import auth from '@react-native-firebase/auth';

import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import api from "../api/client";
import { useDispatch } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import handleApiError from "../utils/handleApiError";

// const LoginScreen = ({ navigation }) => {
//     const [phone, setPhone] = useState('');

//     const handleSendOTP = async () => {
//         if (!phone) { return Alert.alert('Please enter a phone number'); }

//         const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

//         try {
//             const confirmation = await auth().signInWithPhoneNumber(formattedPhone);
//             console.log('confirmation:::>>',confirmation)
//             navigation.navigate('OTPScreen', { confirmation });
//         } catch (error) {
//             console.log(error);
//             Alert.alert('Error sending OTP. Please check the number and try again.');
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>Login via Phone</Text>
//             <TextInput
//                 style={styles.input}
//                 placeholder="Enter phone number"
//                 keyboardType="phone-pad"
//                 onChangeText={setPhone}
//                 value={phone}
//             />
//             <TouchableOpacity style={styles.button} onPress={handleSendOTP}>
//                 <Text style={styles.buttonText}>Send OTP</Text>
//             </TouchableOpacity>
//         </View>
//     );
// };

// export default LoginScreen;

// const styles = StyleSheet.create({
//     container: { flex: 1, justifyContent: 'center', padding: 20 },
//     title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
//     input: { borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 15 },
//     button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8 },
//     buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
// });

export default function LoginScreen({ navigation }) {
    const [mobile, setMobile] = useState('');
    const [loading, setLoading] = useState('');
    const dispatch = useDispatch()
    const handleLogin = () => {
        if (!/^\d{10}$/.test(mobile)) {
          Alert.alert('Error', 'Please enter a valid 10-digit mobile number.');
          return;
        }
        dispatch(loginUser(mobile))
          .unwrap()
          .then(() => navigation.navigate('OTP'))
          .catch(err => handleApiError(err));
      };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Enter Mobile Number</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter phone number 10 digits"
                keyboardType="phone-pad"
                onChangeText={setMobile}
                value={mobile}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Send OTP</Text>
            </TouchableOpacity>
        </View>
        );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 15 },
    button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8 },
    buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
