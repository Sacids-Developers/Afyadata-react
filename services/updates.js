import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchDataAndStore = async (language,setData,setLoading) => {

  API_URL     = "https://dummyjson.com/products"
    
  try {
    const response = await axios.get(API_URL);
    const fetchedData = response.data.products;

    await AsyncStorage.setItem('updateData', JSON.stringify(fetchedData));
    setData(fetchedData);
  } catch (error) {
    console.error('Error fetching data:', error);
    
  }finally{
    setLoading(false)
  }
};

export const retrieveStoredData = async (setData, setLoading) => {

  try {
    const storedData = await AsyncStorage.getItem('updateData');
    if (storedData !== null) {
      setData(JSON.parse(storedData));
    }
  } catch (error) {
    console.error('Error retrieving data from AsyncStorage:', error);
  }finally{
    setLoading(false)
  }
};
