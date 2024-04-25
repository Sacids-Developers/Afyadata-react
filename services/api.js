import axios from 'axios';
import { URL } from '../constants/global';


export const fetchForms = async () => {
  const formListEndpoint = URL.form_list;
  const response = await axios.get(formListEndpoint);
  return response.data;
}


export const fetchChat = async (model, model_id) => {

  const fetchChatEndpoint = URL.messages+'/'+model+'/'+model_id;
  console.log("fetch chat",fetchChatEndpoint)
  const response = await axios.get(fetchChatEndpoint);
  const json = await response.data
  return json;
}

export const submitChat = async (model, model_id, message) => {

  const formData  = new FormData()
  formData.append('message', message)
  const submitChatEndpoint = URL.messages+'/'+model+'/'+model_id;
  console.log(submitChatEndpoint)
  const response = await axios.post(submitChatEndpoint, formData);
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


export const fetchNews = async () => {

  const fetchNewsEndpoint = URL.news;
  console.log("fetch news",fetchNewsEndpoint)
  const response = await axios.get(fetchNewsEndpoint);
  const json = await response.data
  return json;
}

