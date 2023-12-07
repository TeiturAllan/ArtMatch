import React from "react";
import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { StyleSheet, Text, View } from 'react-native';

function LikedArtPieceScreen() {
    const [email, setEmail] = useState('')
    const [password, setpassword] = useState('')

    return(
        <View>
            <Text>this is the page were you will be able so see all the art pieces that you have liked</Text>
        </View>
    )
}

export default LikedArtPieceScreen