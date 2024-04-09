import axios from 'axios';
import { URL } from '../constants/global';


export const getForms = async () => {

  const response = await axios.get(URL.form_list);
  return response.data;
  
}

