import React from 'react';
import { Image, Text, StyleSheet, View } from 'react-native';

const AppHeader = () => (
  <View style={styles.header}>
    <View style={[styles.row, styles.boxItem2]}>
      <View style={{alignItems: "center", width: "20%" }}>
        <Image style={styles.logo} source={require('.././assets/logo.png')}/>
      </View>
      <View style={{ width: "80%"}}>
        <Text style={styles.headerText}>BigBears : Simple Check-in</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white'
  },
  boxItem2: {
      justifyContent:'space-between',
      margin: 10,
      alignItems: 'center',
  },
  logo: {
    width: 70,
    height: 70
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0
  },
  header: {
      flex: 1.5,
      backgroundColor: '#2196F3',
      justifyContent: 'center',
      alignItems: 'center',
  },
});

export default AppHeader;

