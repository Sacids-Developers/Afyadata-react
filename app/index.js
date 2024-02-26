import { Redirect, router } from "expo-router";
import { useEffect } from "react";
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
  useEffect(() => {
    createDirectory('DEFN');
    createDirectory('DATA');
    createDirectory('DATA/MEDIA');
  }, []);

  try {
    const value = AsyncStorage.getItem('refresh_token');
    if (value !== null) {
      console.log(value);
      return <Redirect href="/(tabs)/updates" />
    } else {
      return <Redirect href="/auth/login" />
    }
  } catch (error) {
    // Error retrieving data
    console.log("No item");
    return <Redirect href="/auth/login" />
  }


}