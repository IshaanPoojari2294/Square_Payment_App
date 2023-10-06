import React, { useEffect, useState, useRef } from 'react';
import { Animated, Image, Easing, Button, TouchableHighlight, StyleSheet,SafeAreaView, Text, View } from 'react-native';

function Home({ navigation }) {
  navigation.setOptions({
    title: "",

    // headerLeft: () => null, // Disable the back button
  });

  const toInventory = () => {
    navigation.navigate('Inventory', {});
  };

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center' }}>
       <View style={{ alignItems: 'center' }}>
       <TouchableHighlight
        style={styles.submit}
        onPress={() => toInventory()}
        underlayColor='#fff'>
          <Text style={[styles.submitText]}>Inventory</Text>
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
  submit: {
    width: 100,
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#007bff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  submitText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
  }
});

export default Home;