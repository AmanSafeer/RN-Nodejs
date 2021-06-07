/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from 'react-native';
import RootStack from './src';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor:"white" }} >
      <StatusBar barStyle="dark-content" backgroundColor="white"/>
      {
        Platform.OS == "ios" ?
        <KeyboardAvoidingView style={{flex:1}} behavior="padding">
          <RootStack/>
        </KeyboardAvoidingView>
        :
        <RootStack/>
      }
    </SafeAreaView>
  );
};


export default App;
