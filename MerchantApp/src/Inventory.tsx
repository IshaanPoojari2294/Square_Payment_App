import React, { useEffect, useState, useRef } from 'react';
import { Animated, Image, FlatList, Easing, Button, TouchableHighlight, StyleSheet,SafeAreaView, Text, View } from 'react-native';

function Inventory({ navigation }) {

    const [items, setItems] = useState([
        { id: 1, name: 'Item 1', price: 10 },
        { id: 2, name: 'Item 2', price: 15 },
        { id: 3, name: 'Item 3', price: 20 },
        // Add more items as needed
    ]);

    // Create a state to manage the cart
    const [cart, setCart] = useState([]);

    const toCartView = () => {
        navigation.navigate('Cart', {'payload':cart});
      };

    // Function to add an item to the cart
    const addToCart = (item) => {
        const itemInCart = cart.find((cartItem) => cartItem.id === item.id);
    
        if (itemInCart) {
          // If item is already in the cart, update its quantity
          const updatedCart = cart.map((cartItem) =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          );
          setCart(updatedCart);
        } else {
          // If item is not in the cart, add it with quantity 1
          setCart([...cart, { ...item, quantity: 1 }]);
        }
    };

    const removeFromCart = (item) => {
        const itemInCart = cart.find((cartItem) => cartItem.id === item.id);
    
        if (itemInCart) {
          // If item is already in the cart, update its quantity
          const updatedCart = cart.map((cartItem) =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: Math.max(cartItem.quantity - 1,0) }
              : cartItem
          );

        const newArray = [];
 
        for (let i = 0; i < updatedCart.length; i++) {
            if (updatedCart[i].quantity !== 0) {
                newArray.push(updatedCart[i]);
            }
        }

        setCart(newArray);

        } else {
          // If item is not in the cart, do not do anything
          return;
        }
    };




    return (
        <SafeAreaView style={{ flex: 1, padding: 20, alignItems: 'stretch', justifyContent: 'center' }}>
        <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 20, marginBottom: 10 }}>Items</Text>
            <FlatList
                data={items}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableHighlight
                        style={styles.sign}
                        onPress={() => removeFromCart(item)}
                        underlayColor='#fff'>
                        <Text style={styles.buttonText}>-</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={styles.addtocart}
                        onPress={() => addToCart(item)}
                        underlayColor='#fff'>
                        <Text style={styles.buttonText}>{item.name} - ${item.price}</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={styles.sign}
                        onPress={() => addToCart(item)}
                        underlayColor='#fff'>
                        <Text style={styles.buttonText}>+</Text>
                    </TouchableHighlight>
                </View>
                )}
            />

            <Text style={{ fontSize: 20, marginTop: 20 }}>Cart</Text>
            <FlatList
                data={cart}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>{item.name} - ${item.price} x {item.quantity}</Text>
                    {/* You can add a remove button or quantity control here */}
                </View>
                )}
            />
            <TouchableHighlight
                style={styles.submit}
                onPress={() => toCartView()}
                underlayColor='#fff'>
                <Text style={styles.buttonText}>To Cart</Text>
            </TouchableHighlight>
        </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  tinyLogo: {
    width: 50,
    height: 50,
  },
  logo: {
    width: 66,
    height: 58,
  },
  addtocart: {
    width: 200,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000000',
    textAlign: 'center',
  },
  sign: {
    width: 50,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000000',
  },
  submit: {
    width: 100,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#007bff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  buttonText: {
    color: '#000000',
    textAlign: 'center',
    fontSize: 20,
  }
});

export default Inventory;