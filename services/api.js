import axios from 'axios';
import { URL } from '../constants/global';


export const fetchForms = async () => {
  const formListEndpoint = URL.form_list;
  const response = await axios.get(formListEndpoint);
  return response.data;
}



export const submitFormData = async (formData) => {
  const formSubmitEndpoint = URL.form_submit;
  //console.log(formSubmitEndpoint, formData)
  try{
    const response = await axios.post(formSubmitEndpoint, formData);
    return 0
  }catch(e){
    return e.message
  }

}

