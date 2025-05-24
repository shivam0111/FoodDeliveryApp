import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Image, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { MenuItemCard } from '../components/MenuItemCard';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { setAuthToken } from '../utils/tokenService';
import axios from '../utils/axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const AdminDashboard = () => {
  const [menuItems, setMenuItems] = useState([]);
  const { token } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (token) {
      setAuthToken(token);
    }
    fetchMenuItems();
  }, [token]);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  const fetchMenuItems = async () => {
    try {
      const response = await axios.get('api/menu', {
        headers: {
        },
      });
      console.log('response>>', response.data.menu)
      setMenuItems(response.data.menu);
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Error', 'Failed to load menu items.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMenuItems(); // Call your menu fetching function when screen focuses
    }, [])
  );

  const handleDeleteItem = async (itemId) => {
    Alert.alert(
      'Delete Confirmation',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`http://192.168.1.3:5050/api/menu/${itemId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              // Alert.alert('Deleted!', 'Item removed successfully.');
              fetchMenuItems(); // 🔁 Refresh after deletion
            } catch (err) {
              console.error('Delete error:', err);
              Alert.alert('Error', 'Could not delete item.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://sdmntprcentralus.oaiusercontent.com/files/00000000-3450-61f5-ae44-ce708f24113f/raw?se=2025-05-21T03%3A22%3A34Z&sp=r&sv=2024-08-04&sr=b&scid=49aec68f-2cee-5141-876c-b75c414fc3d5&skoid=31bc9c1a-c7e0-460a-8671-bf4a3c419305&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-21T01%3A42%3A11Z&ske=2025-05-22T01%3A42%3A11Z&sks=b&skv=2024-08-04&sig=RehxMRiTnRbyV52IOxk4I88uAihS1uYZt4MVVpJxoko%3D' }}
          style={{
            width: 100,
            height: 40,
            borderRadius: 8,
          }}
          resizeMode='cover'
        />
        <Text style={styles.headerTitle}>Tadka That Talks!</Text>
        <View style={{ width: 24 }} />
        {/* placeholder to balance the back arrow */}
      </View>
      <View style={styles.container}>
        {/* <Text style={styles.heading}>Admin Dashboard</Text> */}
        <FlatList
          data={menuItems}
          keyExtractor={item => item._id}
          ListFooterComponent={<View style={{ height: 24 }} />}
          contentContainerStyle={{ padding: 12 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {item.image && (
                <Image
                  source={{ uri: `http://192.168.1.3:5050/uploads/${item.image}` }}
                  style={styles.image}
                  resizeMode="cover"
                />
              )}

              <View style={styles.content}>
                {/* Title Row */}
                <View style={styles.vegIcon}>
                  <View style={styles.vegDot} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.heading}>{item.name}</Text>
                    <View>
                      <Text style={styles.price}>₹ {item.price}</Text>

                    </View>
                  </View>
                  {/* Right Column: Edit/Delete */}

                  <View>
                    <TouchableOpacity
                      style={[styles.button, styles.editButton]}
                      onPress={() => navigation.navigate('EditMenuItem', { item })}
                    >
                      <Text style={styles.editText}>   EDIT   </Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                    style={[styles.button, styles.deleteButton]}
                    onPress={() => handleDeleteItem(item._id)}
                  >
                    <Text style={styles.deleteText}>DELETE</Text>
                  </TouchableOpacity> */}

                  </View>
                </View>

                {/* Main Row: Left info & Right actions */}
                <View style={styles.mainRow}>
                  {/* Left Column: Price, Category, Desc, Date */}


                  <View style={styles.infoColumn}>

                    <Text style={styles.desc} numberOfLines={3}>
                      {item.description || 'No description available.'}
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={styles.createdAt}>
                        🗓️  {new Date(item.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </Text>
                      <TouchableOpacity
                        style={styles.deleteIconContainer}
                        onPress={() => handleDeleteItem(item._id)}
                      >
                        <MaterialIcons name="delete" size={24} color="#FF1744" />
                      </TouchableOpacity>
                    </View>
                  </View>

                </View>
              </View>
            </View>
          )}
        />
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('CreateMenuItem')}
        >
          <Text style={styles.fabIcon}>＋</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E5E4E2',
    paddingHorizontal: 5,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#00362d',
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#e1cdc4',
    paddingLeft: 10,
    fontFamily: 'sans-serif-thin'
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: '#444',
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  vegIcon: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: '#08A046',    // Swiggy-green
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,            // spacing before the name
    borderRadius: 5,
    padding: 8,
  },
  vegDot: {
    width: 8,
    height: 8,
    padding: 4.8,
    borderRadius: 4,
    backgroundColor: '#08A046',// same green fill
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    // elevation: 3,              // Android
    shadowColor: '#000',       // iOS
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  image: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: 14,
  },

  infoColumn: {
    flex: 1,
  },
  actionsColumn: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    // keeps buttons stacked neatly
  },

  price: {
    backgroundColor: '#FFCC00',
    fontSize: 15,
    fontWeight: '600',
    paddingLeft: 6,
    paddingVertical: 5,
    marginBottom: 5,
    color: '#000',
    width: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },
  metaTag: {
    fontSize: 12,
    color: '#999',
  },
  desc: {
    marginTop: 8,
    fontSize: 14,
    color: '#808080',
    fontFamily: 'sans-serif',
    lineHeight: 18,
  },
  createdAt: {
    fontSize: 12,
    color: '#bbb',
    marginBottom: 4,
    marginTop: 5,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
    width: 100,
  },
  deleteButton: {
    backgroundColor: '#FF1744',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
  },
  editText: {
    color: '#08A046',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  createButton: {
    alignSelf: 'center',
    backgroundColor: '#08A046',       // Swiggy-green
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 24,                 // pill shape
    marginTop: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteIconContainer: {
    borderWidth: 1.5,
    borderColor: '#FF1744',    // matches icon color
    borderRadius: 24,          // circle (half of width/height)
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    // shadow for iOS
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    // elevation for Android
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#08A046',        // Swiggy-green
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 5,                       // Android shadow
  },
  fabIcon: {
    fontSize: 32,
    color: '#fff',
    lineHeight: 32,                     // vertically center the “＋”
  },
});
