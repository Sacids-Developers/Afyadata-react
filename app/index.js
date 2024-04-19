import { Redirect, router } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const createDirectory = async (dir) => {
  const path = FileSystem.documentDirectory + '/FORMS/' + dir;
  const directoryInfo = await FileSystem.getInfoAsync(path);

  if (!directoryInfo.exists) {
    try {
      await FileSystem.makeDirectoryAsync(path, { intermediates: true, });
      console.log('Directory created successfully.');
    } catch (error) {
      console.error('Error creating directory:', error);
    }
  } else {
    console.log('Directory already exists.');
  }
};


export default function index() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    createDirectory('DEFN');
    createDirectory('TASKS');
    createDirectory('DATA');
    createDirectory('MEDIA');

    //get refresh token
    AsyncStorage.getItem('refresh_token').then(value=>{setToken(value)})
  }, []);

  //login token
  console.log("My Token => " + token)

  //check for token if is null
  if (token !== null) {
    return <Redirect href="/(tabs)/updates" />
  } else {
    return <Redirect href="/auth/login" />
  }
}