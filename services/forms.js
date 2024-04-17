import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


BASE_URL    = "http://192.168.41.174:8000/api/v2/pages/?locale=en"
API_URL     =  BASE_URL+"&type=outlets.outletPage&fields=*"
API_URL     = "http://192.168.1.101:8000/form_list"


export const fetchDataAndStore = async (setData,setLoading) => {
    
  try {
    const response = await axios.get(API_URL);
    const fetchedData = response.data.items;

    await AsyncStorage.setItem('formData', JSON.stringify(fetchedData));
    setData(fetchedData);
  } catch (error) {
    console.error('Error fetching data:', error);
  }finally{
    setLoading(false)
  }
};

export const retrieveStoredData = async (setData, setLoading) => {
  try {
    const storedData = await AsyncStorage.getItem('formData');
    if (storedData !== null) {
      setData(JSON.parse(storedData));
    }
  } catch (error) {
    console.error('Error retrieving data from AsyncStorage:', error);
  }finally{
    setLoading(false)
  }
};
