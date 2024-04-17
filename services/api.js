import axios from 'axios';
import { URL } from '../constants/global';


export const fetchForms = async () => {
  const formListEndpoint = URL.form_list;
  console.log(formListEndpoint)
  const response = await axios.get(formListEndpoint);
  return response.data;
}



export const submitFormData = async (formData) => {
  const formSubmitEndpoint = URL.form_submit;
  console.log(formSubmitEndpoint)
  try{
    const response = await axios.post(formSubmitEndpoint,formData);
    console.log('response',response.data)
    return 0
  }catch(e){
    console.log(e.message, formSubmitEndpoint)
    return e.message
  }

}

