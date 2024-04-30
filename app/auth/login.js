import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, router } from 'expo-router';
import {
    Platform,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    StyleSheet,
    SafeAreaView,
    View,
    Text,
    Image,
    Pressable,
} from 'react-native';

import { CustomTextInput } from '../../components/CustomTextInput';

import { COLORS } from "../../constants/colors"
import appLogo from '../../assets/images/app_logo.png';
import { URL } from '../../constants/global';

export default function Login() {
    const [isLoading, setLoading] = useState(false)
    const [username, setUsername] = useState("");
    const [errorUsername, setErrorUsername] = useState("");

    const [password, setPassword] = useState("");
    const [errorPassword, setErrorPassword] = useState("");

    const [errorMsg, setErrorMsg] = useState("");

    //clear async storage
    AsyncStorage.clear();

    //validate fields
    const validate = () => {
        //TODO: Form Validation

        //return
        return true;
    };

    // handleValidSubmit
    const handleValidSubmit = () => {
        const isValid = validate();

        if (isValid) {
            setLoading(true);

            //create payload
            const payload = {
                username: username,
                password: password,
            };

            //API URL
            const API_URL = URL.login;

            //post data 
            fetch(API_URL, {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
            })
                .then(response => response.json())
                .then((responseJson) => {
                    setLoading(false);

                    if (responseJson.error === false) {
                        AsyncStorage.setItem('access_token', responseJson.access);
                        AsyncStorage.setItem('refresh_token', responseJson.refresh);
                        AsyncStorage.setItem("user", JSON.stringify(responseJson.user))

                        //redirect
                        router.replace('/(tabs)/updates')
                    } else {
                        setErrorMsg(responseJson.error_msg); //error message
                        setPassword(""); //clear only password
                    }
                })
                .catch((error) => {
                    setLoading(false);
                    console.log(error);
                });
        }
    };


    //return view
    return (
        <SafeAreaView style={{ flex: 1, flexDirection: "column", backgroundColor: "#FFEBEE" }}>

            <View style={styles.container}>
                <Image style={styles.logo} source={appLogo} />

                {errorMsg != '' ? (<Text style={styles.errorMsg}>{errorMsg}</Text>) : null}

                <CustomTextInput style={styles.textInput}
                    underlineColorAndroid="transparent"
                    placeholder={('Username or phone...')}
                    keyboardType='default'
                    placeholderTextColor="#757575"
                    value={username}
                    onChangeText={(val) => setUsername(val)} />
                <Text style={styles.errorMessage}>{errorUsername}</Text>

                <CustomTextInput style={styles.textInput}
                    underlineColorAndroid="transparent"
                    placeholder={('Password...')}
                    secureTextEntry={true}
                    placeholderTextColor="#757575"
                    value={password}
                    onChangeText={(val) => setPassword(val)} />
                <Text style={styles.errorMessage}>{errorPassword}</Text>

                <Pressable style={styles.loginBtn}
                    onPress={() => handleValidSubmit()}>
                    <Text style={styles.textButton}>{('Sign In')}</Text>
                </Pressable>

                <View style={{ flexDirection: "row", marginTop: 20, }}>
                    <Text style={styles.belowText}>
                        {('Don\'t have an account?')}
                    </Text>

                    <Text style={{ paddingLeft: 4, color: "#781E14", fontSize: 16 }} onPress={() => router.replace("/auth/register")}>
                        {('Sign up.')}
                    </Text>
                </View>

            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        flexDirection: "column",
        paddingStart: 30,
        paddingEnd: 30,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomStartRadius: 120,
        borderBottomRightRadius: 120,
    },

    logo: {
        width: '100%',
        height: 120,
        marginBottom: 16,
        resizeMode: 'contain',
    },

    textLabel: {
        fontSize: 14,
    },

    textInput: {
        width: '100%',
        minHeight: 48,
        padding: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 4,
        fontSize: 15,
        color: '#424242'
    },

    loginBtn: {
        width: '100%',
        minHeight: 48,
        padding: 12,
        alignItems: 'center',
        backgroundColor: '#781E14',
        borderRadius: 8
    },

    textButton: {
        fontSize: 16,
        fontWeight: 600,
        textTransform: 'uppercase',
        lineHeight: 20,
        letterSpacing: .5,
        color: '#ffffff',
    },

    errorMsg: {
        color: 'red',
        fontSize: 13,
        marginTop: 10,
        padding: 10,
        textAlign: 'center',
        borderRadius: 8,
        backgroundColor: '#FFEBEE',
    },

    belowText: {
        alignSelf: 'center',
        fontSize: 16,
        lineHeight: 21,
        letterSpacing: 0.25,
        color: '#424242',
    },

    errorMessage: {
        color: 'red',
        textAlign: 'left',
        fontSize: 12
    }

});