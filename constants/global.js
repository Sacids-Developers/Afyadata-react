
import * as FileSystem from 'expo-file-system';

export const PATH = {

    form_defn: FileSystem.documentDirectory + 'FORMS/DEFN/',
    form_data: FileSystem.documentDirectory + 'FORMS/DATA/',
    //form_media: FileSystem.documentDirectory + 'FORMS/DATA/MEDIA',
  
};

//const BASE_URL  = 'http://10.0.2.2:8000';
const BASE_URL  = 'http://192.168.0.106:8000';
//const BASE_URL  = 'http://41.73.194.139:8040';

export const URL = {
    form_list: BASE_URL + '/form_list',
    form_submit: BASE_URL + '/form_submit',
    register: BASE_URL + '/api/v1/register',
    login: BASE_URL + '/api/v1/login',
    messages: BASE_URL + '/chat',
  
};