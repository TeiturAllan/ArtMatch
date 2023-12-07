import React from "react";
import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { StyleSheet, Text, View } from 'react-native';

function SettingsScreen() {
    const [email, setEmail] = useState('')
    const [password, setpassword] = useState('')

    return(
        <View>
            <Text>this is the screen were you will be able to adjust your app settings</Text>
        </View>
    )
}

export default SettingsScreen