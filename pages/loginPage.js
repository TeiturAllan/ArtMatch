import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


//importations from firebase module
import { initializeApp, getApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from "firebase/firestore";


//start of function importation
import RegisterPage from './RegisterPage';





const LoginPage = (props) =>{
  //initialization of firebase products
  const firebaseApp = getApp()
  const auth = getAuth()
  const firebaseDB = getFirestore(firebaseApp)
  
  async function createUserDocumentInFirestore(user){
    const userFirestoreRef = `Users/${user.uid}`
    await setDoc(doc(firebaseDB, userFirestoreRef), {
      userID: user.uid,
      userIsPublic: false
    }).then(console.log('registration successful'))
    
  }

  //states used for user creation and authorization
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isCompleted, setCompleted] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const handleRegisterSubmit = async() => {
    await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      createUserDocumentInFirestore(user)
      
    })
    .catch((error) => {
      console.log('error, registration did not work')
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('errorCode', errorCode)
      console.log('errorMessage', errorMessage)
      setErrorMessage(errorMessage)
      // ..
    });
  }


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


  

 

  //start of UI
    return(
        <View
          style={styles.container}
          behavior='padding'>
            <KeyboardAvoidingView style={styles.inputContainer}>
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
            </KeyboardAvoidingView>
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
        </View>
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
