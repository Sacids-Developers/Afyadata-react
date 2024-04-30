import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URL } from '../constants/global';

//create api wrapper 
const authorization = axios.create({
    baseURL: URL.base_url,
  });
  
  // Add an interceptor for all requests
  authorization.interceptors.request.use(config => {
    // Retrieve the access token
    const accessToken = AsyncStorage.getItem("access_token");

    //TODO: check if access token expiring
  
    // Add the access token to the Authorization header
    config.headers.Authorization = `Bearer ${accessToken}`;
  
    return config;
  });
  
  export default authorization;