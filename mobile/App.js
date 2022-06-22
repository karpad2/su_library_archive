import { StatusBar } from 'expo-status-bar';
import React, { useRef,useEffect,Component } from "react";
import { StyleSheet, Text, View,BackHandler,TouchableOpacity,Dimensions,Alert} from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  const webViewRef = useRef(null)
  let currenturl="";
  let i=0;
  let starturl="https://digitalna.subiblioteka.rs";

  const _onNavigationStateChange=(webViewState)=>{
    i++;
    currenturl=webViewState.url;
    console.log(currenturl);
    console.log(i)
  };
  
  const goback = () => {
    console.log(i)
    //console.log(currenturl+`\n`+starturl)
    if(currenturl==starturl || currenturl==starturl+'/home'||i==0)
    {
      Alert.alert("Hold on!", "Are you sure you want to exit the application?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
    }
    else
    {
    i--;
    webViewRef.current?.goBack();
    }
    //webview.goBack();
    return true;
  };
  
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      goback
    );

    return () => backHandler.remove();
  }, []);

  return (
    
      <WebView
      ref={webViewRef}
      source={{
        uri:  starturl
      }}
      userAgent="Mobile_profile"
      scalesPageToFit={true}
      useWebKit={true}
      viewportContent={'width=device-width, user-scalable=no'}
      updateNavigationState={_onNavigationStateChange}
      onNavigationStateChange={_onNavigationStateChange}
      //injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=0.3, maximum-scale=0.5, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
      style={{ marginTop: 25 }}
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