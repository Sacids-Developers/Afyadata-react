
import * as FileSystem from 'expo-file-system';

export const PATH = {

    form_defn: FileSystem.documentDirectory + 'FORMS/DEFN/',
    form_data: FileSystem.documentDirectory + 'FORMS/DATA/',
    form_media: FileSystem.documentDirectory + 'FORMS/DATA/MEDIA',
  
};


export const URL = {

    form_list: 'http://192.168.242.174:8000/form_list',
    form_submit: 'http://192.168.242.174:8000/form_submit',
  
};