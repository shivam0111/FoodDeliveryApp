import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const MenuItemCard = ({ item, onEdit, onDelete }) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>₹{item.price}</Text>
      </View>
      <Text style={styles.desc}>{item.description}</Text>
      <Text style={styles.meta}>Category: {item.category || 'N/A'}</Text>
      <Text style={styles.meta}>
        Available: {item.available ? 'Yes' : 'No'}
      </Text>
      <Text style={styles.meta}>Created At: {new Date(item.createdAt).toLocaleString()}</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(item)}>
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(item._id)}>
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    elevation: 3,
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  desc: {
    fontSize: 14,
    color: '#555',
    marginVertical: 4,
  },
  meta: {
    fontSize: 12,
    color: '#777',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  editBtn: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteBtn: {
    backgroundColor: '#f44336',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default MenuItemCard;
