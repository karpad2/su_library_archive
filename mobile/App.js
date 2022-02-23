import { StatusBar } from 'expo-status-bar';
import React, { useRef } from "react";
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  const webViewRef = useRef(null)
  
  return (
    
      <WebView
        ref={webViewRef}
        source={{
          uri: 'https://su-library-archive.web.app',
          userAgent:"Electron_profile",
        
        }}
        scalesPageToFit={true}
        useWebKit={true}
        style={{ marginTop: 0 }}
      />
   
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/*
 <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
*/