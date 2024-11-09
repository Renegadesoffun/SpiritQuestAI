import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { purchaseItem } from '../redux/playerSlice';
import { useTheme } from '../theme/ThemeProvider';

const shopItems = [
  { id: 1, name: 'Wisdom Boost', description: 'Increase wisdom gain by 10% for 1 hour', price: 50 },
  { id: 2, name: 'Compassion Aura', description: 'Automatically complete one Compassion Quest per day', price: 100 },
  { id: 3, name: 'Courage Potion', description: 'Gain temporary invincibility in FlappySpirit', price: 75 },
  { id: 4, name: 'Meditation Cushion', description: 'Reduce meditation time by 20%', price: 150 },
  { id: 5, name: 'Karmic Shield', description: 'Protect against negative karma for 3 gameplay sessions', price: 200 },
];

const SpiritualShop = () => {
  const dispatch = useDispatch();
  const playerCurrency = useSelector(state => state.player.currency);
  const inventory = useSelector(state => state.player.inventory);
  const { theme } = useTheme();

  const handlePurchase = (item) => {
    if (playerCurrency >= item.price) {
      dispatch(purchaseItem(item));
    } else {
      alert('Not enough spiritual currency!');
    }
  };

  const renderShopItem = ({ item }) => (
    <View style={styles.shopItem}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
      <Text style={styles.itemPrice}>Price: {item.price} spiritual coins</Text>
      <TouchableOpacity
        style={styles.purchaseButton}
        onPress={() => handlePurchase(item)}
      >
        <Text style={styles.purchaseButtonText}>Purchase</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Spiritual Shop</Text>
      <Text style={styles.currency}>Your spiritual coins: {playerCurrency}</Text>
      <FlatList
        data={shopItems}
        renderItem={renderShopItem}
        keyExtractor={item => item.id.toString()}
        style={styles.shopList}
      />
      <Text style={styles.inventoryTitle}>Your Inventory</Text>
      <FlatList
        data={inventory}
        renderItem={({ item }) => <Text style={styles.inventoryItem}>{item.name}</Text>}
        keyExtractor={item => item.id.toString()}
        style={styles.inventoryList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  currency: {
    fontSize: 18,
    marginBottom: 20,
  },
  shopList: {
    marginBottom: 20,
  },
  inventoryTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  inventoryList: {
    marginBottom: 20,
  },
  shopItem: {
    backgroundColor: theme.background,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 16,
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    marginBottom: 10,
  },
  purchaseButton: {
    backgroundColor: theme.primary,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  purchaseButtonText: {
    fontSize: 16,
    color: theme.text,
  },
});

export default SpiritualShop;
