import { StatusBar } from 'expo-status-bar';
import React, { useRef,useEffect } from "react";
import { StyleSheet, Text, View,BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import StaticServer from 'react-native-static-server';
import RNFS from 'react-native-fs';

export default function App() {
 // const WEBVIEW_REF = useRef(null)
 let webview = null;
 let url="";
 let path = RNFS.DocumentDirectoryPath + '/dist';
 let server = new StaticServer(33400,path);

  server.start().then(_url)
  {
    console.log(_url);
    url=_url;
  }
  const goback = () => {
    //webViewRef.current.goBack();
    //webview.goBack();
    return true;
  };
  
  useEffect(() => {
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to go back?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      goback
    );

    return () => backHandler.remove();
  }, []);

  return (
    
      <WebView
       //ref={(ref) => (webview = ref)}
        /*source={{
          uri: 'https://su-library-archive.web.app'
        }}*/

        source={{ uri: url }}
        userAgent="Mobile_profile"
        scalesPageToFit={true}
        useWebKit={true}
        
        style={{ marginTop: 30 }}
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