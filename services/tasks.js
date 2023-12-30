import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


BASE_URL    = "http://192.168.41.174:8000/api/v2/pages/?locale=en"
API_URL     =  BASE_URL+"&type=portfolio.portfolioPage&fields=*"
API_URL     = "https://dummyjson.com/products"


export const fetchDataAndStore = async (setData,setLoading) => {
    
  try {
    const response = await axios.get(API_URL);
    const fetchedData = response.data.items;

    await AsyncStorage.setItem('taskData', JSON.stringify(fetchedData));
    setData(fetchedData);
  } catch (error) {
    console.error('Error fetching data:', error);
  }finally{
    setLoading(false)
  }
};

export const retrieveStoredData = async (setData, setLoading) => {
  try {
    const storedData = await AsyncStorage.getItem('taskData');
    if (storedData !== null) {
      setData(JSON.parse(storedData));
    }
  } catch (error) {
    console.error('Error retrieving data from AsyncStorage:', error);
  }finally{
    setLoading(false)
  }
};
