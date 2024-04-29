import axios from 'axios';
import { URL } from '../constants/global';


export const fetchForms = async () => {
  const formListEndpoint = URL.form_list;
  console.log(formListEndpoint)
  const response = await axios.get(formListEndpoint);
  return response.data;
}

export const submitFormData = async (formData) => {
  try {
    const formSubmitEndpoint = URL.form_submit;
    console.log(formData);
    const response = await axios.post(formSubmitEndpoint, formData,{
        headers: {
          'Content-Type': 'multipart/form-data', // Set content type to multipart/form-data
        },
      }
    );
    const data = response.data;
    console.log('response', data);
    return 0;
  } catch (error) {
    console.error('Error submitting form data:', error);
    return error
  }
}


