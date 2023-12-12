import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

//imports from Firebase serviceses
import {getApps, initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged } from "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyD-RrZHKgQh2nYnWft1li_hgKr83uy9BpQ",
  authDomain: "artmatch-b62bc.firebaseapp.com",
  databaseURL: "https://artmatch-b62bc-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "artmatch-b62bc",
  storageBucket: "gs://artmatch-b62bc.appspot.com",
  messagingSenderId: "192045533053",
  appId: "1:192045533053:web:3ee9141cbf9102cb736e14"
};

//importation of components from other local folders
import LoginPage from './pages/loginPage'; <LoginPage/>
import MainNavigationPage from './pages/MainNavigation'; <MainNavigationPage/>





export default function App() {
  const [user, setUser] = useState({loggedIn: false})

  if (getApps().length < 1) {
    initializeApp(firebaseConfig);
    console.log("Firebase On!");
    // Initialize other firebase products here
  } else {
    console.log("Firebase not on!");
  }
 
  const auth = getAuth();

  function onAuthStateChange(callback) {
    return onAuthStateChanged(auth, (user) => {
      if(user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        callback({loggedIn: true, user: user});
        console.log("You are logged in!");
        // ...
      } else {
        
        callback({loggedIn: false});
      }
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChange(setUser);
    return () => {
      unsubscribe();
    };
  }, []);


  const GuestPage = () =>{ //this page is used to load the 
    return (
      <View style={styles.container}>
        <LoginPage/>
      </View>
    );
  }
 


  return user.loggedIn ? <MainNavigationPage/> : <GuestPage/> 

}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
