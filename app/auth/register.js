import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import { URL } from '../../constants/global';

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

    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSucceccMsg] = useState("");

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
                first_name: firstName,
                last_name: lastName,
                phone: phone,
                email: email,
                password: password,
                password_confirm: passwordConfirmation,
            };

            //API URL
            const API_URL = URL.register;

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

                    console.log(responseJson)

                    //check for registration
                    if (responseJson.error === false) {
                        //set success msg
                        setSucceccMsg(responseJson.success_msg)

                        //clear the form
                        setFirstName("")
                        setLastName("")
                        setPhone("")
                        setEmail("")
                        setPassword("");
                        setPasswordConfirmation("")
                    }else{
                        //error message
                        setErrorMsg(responseJson.error_msg);

                        //clear only password
                        setPassword("");
                        setPasswordConfirmation("")
                    }
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
                <Image style={styles.logo} source={appLogo} />

                {errorMsg != '' ? (<Text style={styles.errorMsg}>{errorMsg}</Text>) : null}
                {successMsg != '' ? (<Text style={styles.successMsg}>{successMsg}</Text>) : null}

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
                    keyboardType='phone-pad'
                    placeholderTextColor="#757575"
                    value={phone}
                    onChangeText={(val) => setPhone(val)} />
                <Text style={styles.errorMessage}>{errorPhone}</Text>

                <CustomTextInput style={styles.textInput}
                    underlineColorAndroid="transparent"
                    placeholder={('Enter email address...')}
                    keyboardType='email-address'
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

                    <Link href="/auth/login">
                        <Text style={{color: "#781E14", fontSize: 16}}>Sign in</Text>
                    </Link>
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
        color: '#C62828',
        fontSize: 14,
        marginTop: 10,
        padding: 10,
        textAlign: 'center',
        borderRadius: 8,
        backgroundColor: '#FFCDD2',
    },

    successMsg: {
        color: '#388E3C',
        fontSize: 14,
        marginTop: 10,
        padding: 10,
        textAlign: 'center',
        borderRadius: 12,
        backgroundColor: '#C8E6C9',
    },

    belowText: {
        alignSelf: 'center',
        fontSize: 16,
        lineHeight: 21,
        letterSpacing: 0.25,
        color: '#424242',
        paddingEnd: 4
    },

    errorMessage: {
        color: 'red',
        textAlign: 'left',
        fontSize: 12
    }

});