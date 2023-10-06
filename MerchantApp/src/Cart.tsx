import React, { useEffect, useState, useRef } from 'react';
import { Animated, Image, FlatList, TextInput, Easing, Button, TouchableHighlight, StyleSheet,SafeAreaView, Text, View } from 'react-native';

function Cart({ route, navigation }) {

    // Create a state to manage the cart
    const { payload } = route.params;

    const getSubTotal = () => {
        let subtotal = 0;

        for (let i = 0; i < payload.length; i++) {
            subtotal += payload[i].quantity * payload[i].price
        }

        return subtotal;
    }

    const [tip, onChangeTip] = useState('');
    const [subtotal, setSubTotal] = useState(getSubTotal());
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (tip){
            setTotal(Math.round((parseFloat(tip) + subtotal + 0.07*subtotal)*100)/100);
        }
        else {
            setTotal(Math.round((subtotal + 0.07*subtotal)*100)/100)
        }
    });

    const toPaymentView = () => {
        navigation.navigate('Payment', {'total':total, 'subtotal':subtotal, 'tip':tip});
      };

    return (
        <SafeAreaView style={{ flex: 1, padding: 20, alignItems: 'stretch', justifyContent: 'center' }}>
        <View style={{ alignItems: 'center' }}>

            <Text style={{ fontSize: 20, marginTop: 20 }}>Cart</Text>
            <FlatList
                data={payload}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>{item.name} - ${item.price} x {item.quantity}</Text>
                    {/* You can add a remove button or quantity control here */}
                </View>
                )}
            />

            <Text style={{ fontSize: 20, marginTop: 80, marginBottom:10 }}>Order Details</Text>
            <Text style={{ fontSize: 14, marginTop: 10 }}>Subtotal: ${subtotal}</Text>
            <Text style={{ fontSize: 14, marginTop: 10 }}>Tax: ${Math.round(0.07 * getSubTotal()*100)/100}</Text>
            <View style = {{flexDirection: 'row', marginBottom:10}}>
                <Text style={{ fontSize: 14, marginTop: 10 }}>Tip: </Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeTip}
                    value={tip}
                    placeholder="0.00"
                    keyboardType="numeric"
                />
            </View>
            
            <Text numberOfLines={1}>               
                ___________________________________
            </Text>
            
            <Text style={{ fontSize: 14, marginTop: 10 }}>Total: ${total}</Text>
            <Text style={{ fontSize: 14, marginTop: 10 }}>Points Earned: ADD LOGIC FOR POINTS HERE</Text>

            <TouchableHighlight
                style={styles.submit}
                onPress={() => toPaymentView()}
                underlayColor='#fff'>
                <Text style={styles.buttonText}>To Payment</Text>
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

export default Cart;