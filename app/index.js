import { Redirect } from "expo-router";
import { useEffect } from "react";
import * as FileSystem from 'expo-file-system';

const createDirectory = async (dir) => {


  const path  = FileSystem.documentDirectory+'/FORMS/'+dir;
  const directoryInfo = await FileSystem.getInfoAsync(path);

  if (!directoryInfo.exists) {
    try {
      await FileSystem.makeDirectoryAsync(path, {intermediates: true,});
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
    createDirectory('TASKS');
    createDirectory('DATA');
    createDirectory('MEDIA');
  }, []);

  return <Redirect href="/(tabs)/updates" />
  //return <Redirect href="/auth/login" />
}