import React from "react";
import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { StyleSheet, Text, View } from 'react-native';

function MainScreen() {
    const [email, setEmail] = useState('')
    const [password, setpassword] = useState('')

    return(
        <View>
            <Text>this is the MainScreen of the app, where you will be able to like artists and art pieces</Text>
        </View>
    )
}

export default MainScreen