import React, { useEffect, useState, useRef } from 'react';
import { Animated, Image, FlatList, TextInput, Easing, Button, TouchableHighlight, StyleSheet,SafeAreaView, Text, View } from 'react-native';

function Payment({ route, navigation }) {

    // Create a state to manage the cart
    const { total, subtotal, tip } = route.params;

    return (
        <SafeAreaView style={{ flex: 1, padding: 20, alignItems: 'stretch', justifyContent: 'center' }}>
        <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 50, marginTop: 80, marginBottom:10 }}>ADD QR CODE HERE</Text>


            <Text style={{ fontSize: 20, marginTop: 80, marginBottom:10 }}>Order Details</Text>
            <Text style={{ fontSize: 14, marginTop: 10 }}>Subtotal: ${subtotal}</Text>
            <Text style={{ fontSize: 14, marginTop: 10 }}>Tax: ${Math.round(0.07 * subtotal *100)/100}</Text>
            <Text style={{ fontSize: 14, marginTop: 10 }}>Tip: ${tip}</Text>
            
            <Text numberOfLines={1}>               
                ___________________________________
            </Text>
            
            <Text style={{ fontSize: 14, marginTop: 10 }}>Total: ${total}</Text>
            <Text style={{ fontSize: 14, marginTop: 10 }}>Points Earned: ADD LOGIC FOR POINTS HERE</Text>

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
  input: {
    height: 40,
    width:60,
    margin: 12,
    borderWidth: 1,
    padding: 10,
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

export default Payment;