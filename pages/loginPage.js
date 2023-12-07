import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//start of function importation
import RegisterPage from './RegisterPage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();



const LoginPage = (props) =>{
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isCompleted, setCompleted] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
   
  const auth = getAuth()  


  const handleLoginSubmit = async () => {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      //this fires if the user is found on the firebase backend and becomes signed in
      const user = userCredential.user
      console.log('success')
      
    })
    .catch((error) => {
      console.log('error, login did not work')
      const errorCode = error.code;
      const errorMessage = error.message;
      setErrorMessage(errorMessage)
    })
  }

  const handleRegisterSubmit = async() => {
    await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log('registration successful')
    })
    .catch((error) => {
      console.log('error, registration did not work')
      const errorCode = error.code;
      const errorMessage = error.message;
      setErrorMessage(errorMessage)
      // ..
    });
  }

 

  //start of UI
    return(
        <KeyboardAvoidingView
          style={styles.container}
          behavior='padding'>
            <View style={styles.inputContainer}>
              <TextInput 
                placeholder='Email'
                value={email}
                onChangeText={text => setEmail(text)}
                style={styles.input}
              />
              <TextInput 
                placeholder='Password'
                value={password}
                onChangeText={text => setPassword(text)}
                style={styles.input}
                secureTextEntry
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleLoginSubmit}
                style={[styles.button, styles.buttonOutline]}
              >
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleRegisterSubmit}
                style={[styles.button, styles.buttonOutline]}
              >
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightblue'
  },
  inputContainer:{
    width: '80%'
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5
  },
  buttonContainer: {
    marginTop: 30,
    width: '60%'

  },
  button: {
    backgroundColor: '#0a5da6',
    width: '100%',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 16
  }
});


export default LoginPage
