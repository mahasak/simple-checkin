import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const AppFooter = () => (
  <View style={styles.footer}>
    <Text style={styles.footerText}>
      BigBears.IO - Creative Commons License
    </Text>
  </View>
);

const styles = StyleSheet.create({
  footerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white'
  },
  footer: {
      flex: .5,
      backgroundColor: '#2196F3',
      justifyContent: 'center',
      alignItems: 'center',
  }
});

export default AppFooter;
