import React, { useState, useEffect } from 'react';
import { Link, router } from 'expo-router'
import {
    Platform,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    View,
    Text,
    Image,
    Pressable,
} from 'react-native';

import { CustomTextInput } from '../../components/CustomTextInput';

import { COLORS } from "../../constants/colors"
import appLogo from '../../assets/images/app_logo_colored.png';

export default function Register() {
    const [isLoading, setLoading] = useState(false)

    const [firstName, setFirstName] = useState("");
    const [errorFirstName, setErrorFirstName] = useState("");

    const [lastName, setLastName] = useState("");
    const [errorLastName, setErrorLastName] = useState("");

    const [phone, setPhone] = useState("");
    const [errorPhone, setErrorPhone] = useState("");

    const [email, setEmail] = useState("");
    const [errorEmail, setErrorEmail] = useState("");

    const [password, setPassword] = useState("");
    const [errorPassword, setErrorPassword] = useState("");

    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [errorPasswordConfirmation, setErrorPasswordConfirmation] = useState("");


    //validate fields
    const validate = () => {
        //username
        // if (!username) {
        //     setErrorUsername(('Username required'));
        //     return false;
        // } else {
        //     setErrorUsername("");
        // }

        //password
        // if (!password) {
        //     setErrorPassword(('Password required'));
        //     return false;
        // } else {
        //     setErrorPassword("");
        // }
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
            const LOGIN_URL = "";

            //post data 
            fetch(LOGIN_URL, {
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

                    //logging response
                    console.log(responseJson);
                })
                .catch((error) => {
                    setLoading(false);
                });
        }
    };


    //return view
    return (
        <SafeAreaView style={{ flex: 1, flexDirection: "column", backgroundColor: "#FFEBEE" }}>

            <View style={styles.container}>

                <View style={{ margin: 16, alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: "#424242" }}>
                        {('Register your details to continue')}
                    </Text>
                </View>

                <CustomTextInput style={styles.textInput}
                    underlineColorAndroid="transparent"
                    placeholder={('Enter firstname...')}
                    keyboardType='default'
                    placeholderTextColor="#757575"
                    value={firstName}
                    onChangeText={(val) => setFirstName(val)} />
                <Text style={styles.errorMessage}>{errorFirstName}</Text>

                <CustomTextInput style={styles.textInput}
                    underlineColorAndroid="transparent"
                    placeholder={('Enter surname...')}
                    keyboardType='default'
                    placeholderTextColor="#757575"
                    value={lastName}
                    onChangeText={(val) => setLastName(val)} />
                <Text style={styles.errorMessage}>{errorLastName}</Text>

                <CustomTextInput style={styles.textInput}
                    underlineColorAndroid="transparent"
                    placeholder={('Enter phone number...')}
                    keyboardType='default'
                    placeholderTextColor="#757575"
                    value={phone}
                    onChangeText={(val) => setPhone(val)} />
                <Text style={styles.errorMessage}>{errorPhone}</Text>

                <CustomTextInput style={styles.textInput}
                    underlineColorAndroid="transparent"
                    placeholder={('Enter email address...')}
                    keyboardType='default'
                    placeholderTextColor="#757575"
                    value={email}
                    onChangeText={(val) => setEmail(val)} />
                <Text style={styles.errorMessage}>{errorEmail}</Text>

                <CustomTextInput style={styles.textInput}
                    underlineColorAndroid="transparent"
                    placeholder={('Enter your password...')}
                    secureTextEntry={true}
                    placeholderTextColor="#757575"
                    value={password}
                    onChangeText={(val) => setPassword(val)} />
                <Text style={styles.errorMessage}>{errorPassword}</Text>

                <CustomTextInput style={styles.textInput}
                    underlineColorAndroid="transparent"
                    placeholder={('Confirm your password...')}
                    secureTextEntry={true}
                    placeholderTextColor="#757575"
                    value={passwordConfirmation}
                    onChangeText={(val) => setPasswordConfirmation(val)} />
                <Text style={styles.errorMessage}>{errorPasswordConfirmation}</Text>

                <Pressable style={styles.loginBtn}
                    onPress={() => handleValidSubmit()}>
                    <Text style={styles.textButton}>{('Sign Up')}</Text>
                </Pressable>

                <View style={{ flexDirection: "row",marginTop: 20, }}>
                    <Text style={styles.belowText}>
                        {('Already have an account?')}
                    </Text>

                    <Text style={{paddingLeft: 4, color: "#781E14", fontSize: 16}} onPress={() => router.replace("/auth/login")}>
                        {('Sign In.')}
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
        height: 48,
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