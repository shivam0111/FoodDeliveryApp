import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Switch, Image, Platform, PermissionsAndroid } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Text, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from '../../utils/axios';

const EditMenuItemScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const { token } = useAuth();
  const [image, setImage] = useState(item.image);
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description || '');
  const [price, setPrice] = useState(item.price.toString());
  const [category, setCategory] = useState(item.category || '');
  const [available, setAvailable] = useState(item.available);
  const [isImageReady, setIsImageReady] = useState(true);

  const handleUpdate = async () => {
    try {
      await axios.put(`api/menu/${item._id}`, {
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

      Alert.alert('Item updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Update failed:', error.response?.data || error.message);
      Alert.alert('Failed to update item');
    }
  };

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
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Storage permission is required.');
      return;
    }
    console.log(hasPermission);
    setIsImageReady(false); // block update until ready
    await launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        setIsImageReady(true);
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const selected = response.assets[0];
        setImage(selected);
        setTimeout(() => {
          setIsImageReady(true); // give it some time
        }, 300); // 300ms delay to ensure file is ready
      }
    });
  };

  const updateMenuItem = async () => {
    if (!name || !price || !category) {
      Alert.alert('Missing Fields', 'Please fill all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    console.log('Selected image:', image);
    if (image && image.uri?.startsWith('file://')) {
      formData.append('image', {
        uri: image.uri,
        name: image.fileName || `image-${Date.now()}.jpg`,
        type: image.type || 'image/jpeg',
      });
    } else {
      console.warn('Image not ready or URI invalid:', image);
    }

    try {
      const response = await axios.put(`api/menu/update/${item._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      Alert.alert('Success', 'Menu item updated!');
      navigation.goBack();

    } catch (error) {
      console.log('Axios error object:', error);
      console.log('Error config:', error.config);
      console.log('Error response:', error.response);
      console.log('Error request:', error.request);
      Alert.alert('Error', error.response?.data?.message || error.message || 'Upload failed');
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
      {image ? (
        <Image source={{ uri: image.uri || `http://192.168.1.3:5050/uploads/${item.image}` }} style={{ width: 100, height: 100 }} />
      ) : null}
      <Button title="Pick New Image" onPress={selectImage} />
      <Button title="Update" onPress={updateMenuItem} disabled={!isImageReady} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontWeight: 'bold', marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginTop: 5, borderRadius: 5 },
  switchContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 15 },
});

export default EditMenuItemScreen;
