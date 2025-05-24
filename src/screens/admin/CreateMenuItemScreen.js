import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, Switch, StyleSheet, Image } from 'react-native';
import { PermissionsAndroid, Platform } from 'react-native';
import { AuthContext } from '../../context/AuthContext'; // assuming you're using context
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from '../../utils/axios';

const CreateMenuItemScreen = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [available, setAvailable] = useState(true);
  const [image, setImage] = useState(null);
  const { token } = useContext(AuthContext);
  const navigation = useNavigation();

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES || PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'App needs access to your photo library to upload images',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS auto-grants or handles via Info.plist
  };

  const selectImage = async () => {
    console.log('jfsodfsdfsdffsfs', hasPermission);
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Storage permission is required.');
      return;
    }
    console.log(hasPermission);

    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0]);
      }
    });
  };

  const uploadMenuItem = async () => {
    const formData = new FormData();
    if (!name || !price) {
      Alert.alert('Name and Price are required.');
      return;
    }
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);

    if (image) {
      formData.append('image', {
        uri: image.uri,
        name: image.fileName,
        type: image.type,
      });
    }

    try {
      await fetch('http://192.168.1.3:5050/api/menu/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // replace with actual token
        },
        body: formData,
      });
      Alert.alert('Menu item created successfully!');
      setName('');
      setDescription('');
      setPrice('');
      setCategory('');
      setAvailable(true);
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.message);
    }
  };


  const handleSubmit = async () => {
    if (!name || !price) {
      Alert.alert('Name and Price are required.');
      return;
    }

    try {
      const response = await axios.post('api/menu', {
        name,
        description,
        price: Number(price),
        category,
        available,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert('Menu item created successfully!');
      setName('');
      setDescription('');
      setPrice('');
      setCategory('');
      setAvailable(true);
      navigation.goBack();
    } catch (error) {
      console.error('Menu creation failed:', error.response?.data || error.message);
      Alert.alert('Failed to create menu item');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name *</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Description</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} />

      <Text style={styles.label}>Price *</Text>
      <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />

      <Text style={styles.label}>Category</Text>
      <TextInput style={styles.input} value={category} onChangeText={setCategory} />

      <View style={styles.switchContainer}>
        <Text>Available</Text>
        <Switch value={available} onValueChange={setAvailable} />
      </View>
      <Button title="Pick Image" onPress={selectImage} />
      {image && <Image source={{ uri: image.uri }} style={{ width: 100, height: 100, marginTop: 10 }} />}

      <Button title="Upload Menu Item" onPress={uploadMenuItem} />
      {/* <Button title="Create Menu Item" onPress={handleSubmit} /> */}
    </View>
  );
};

export default CreateMenuItemScreen;

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontWeight: 'bold', marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginTop: 5, borderRadius: 5 },
  switchContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 15 },
});
