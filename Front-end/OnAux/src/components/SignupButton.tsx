import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

function LoginButton(): JSX.Element {

  return (
    <TouchableOpacity style={styles.container}>
      <Text style={styles.text}>Sign Up</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    fontSize:20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(200,10,50,1.0)',
    marginBottom: 12,
    marginLeft:75,
    marginRight:75,
    paddingVertical: 12,
    borderRadius: 50,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.7)'
  },
  text: {
    color: 'rgba(255,255,255,1.0)',
    textAlign: 'center',
    height: 20,
  }
});

export default SignupButton;