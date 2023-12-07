import React from "react";
import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { StyleSheet, Text, View } from 'react-native';

function MainScreenFilters() {
    const [email, setEmail] = useState('')
    const [password, setpassword] = useState('')

    return(
        <View>
            <Text>this is the page were you will be able to adjust the filters for which artpieces will appear on your main screen.</Text>
            <Text>here you can adjust things such as price, size, distance from you, and possibly a few others</Text>
        </View>
    )
}

export default MainScreenFilters