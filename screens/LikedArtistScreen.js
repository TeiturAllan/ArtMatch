import React from "react";
import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { StyleSheet, Text, View } from 'react-native';

function LikedArtistScreen() {
    const [email, setEmail] = useState('')
    const [password, setpassword] = useState('')

    return(
        <View>
            <Text>this is the page were you will be able to see a run down of all of the artists that you have liked</Text>
        </View>
    )
}

export default LikedArtistScreen