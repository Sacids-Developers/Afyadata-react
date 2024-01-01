

import { View, Text, StyleSheet, ActivityIndicator, Pressable, SafeAreaView,  Dimensions } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import axios from 'axios';

import * as FileSystem from 'expo-file-system';

import { Link, router, useNavigation } from 'expo-router'

import { Ionicons, AntDesign, Entypo } from '@expo/vector-icons';
import { FAB, CheckBox } from '@rneui/themed';

import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const HEADER_MAX_HEIGHT = Dimensions.get('window').height/2.6;
const HEADER_MIN_HEIGHT = 30;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

import {COLORS} from "../../constants/colors"
import {PATH, URL} from "../../constants/global"
API_URL     = "http://127.0.0.1:8000/form_list"


const downloadForms = () => {

  const [formList, setFormList] = useState([])
  const [filesChosen, setFilesChosen] = useState(false)
  const [downloadProgress, setDownloadProgres] = useState(0)
  const [data, setData] = useState([])
  const [isLoading, setLoading] = useState(false)

  const navigation = useNavigation();

    language = 'en'

    _getFilesInDirectory = async() => {
      
      let files = [];
      let dir = await FileSystem.readDirectoryAsync(PATH.form_defn);

      dir.forEach((val) => {

        // read json file
        
        let tmp = {
          "file_name": val,
          "created_at": ""
        }
        files.push(tmp);
      
      });
      console.log(files)
      setData(files)
      setLoading(false)

      ;
    }

    _getFilesFromServer = async() => {

      
      try {

        const response = await axios.get(URL.form_list);
        const fetchedData = response.data;

        console.log(fetchedData)
        setFormList(fetchedData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }finally{
        setLoading(false)
      }

    }

    const callback = downloadProgress => {
      const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
      setDownloadProgres(progress)
    };
    
    const do_download = () =>  {
    
      formList.forEach( async (item) => {

        if(item.checked){
          
          console.log(item.downloadUrl)
      
          
          const downloadResumable = FileSystem.createDownloadResumable(
            item.downloadUrl,
            PATH.form_defn+item.formID,
            {},
            callback
          );
      
          try {
            const { uri } = await downloadResumable.downloadAsync();
            console.log('Finished downloading to ', uri);
          } catch (e) {
            console.error(e);
          }
          
        }
      })
  
    }

    const handleCheck = () => {

      setFilesChosen(false)
      formList.forEach((item) => {
        if(item.checked){
          setFilesChosen(true)
        }
      })

    }

    

    const Item = ({item}) => (

      <View style={styles.item}>
        <CheckBox
          title={item.name + ' : '+ item.formID}
          checked={item.checked}
          checkedColor={COLORS.fontColor}
          onPress={() => {
            const items = [...formList] // <-- shallow copy to show we're not mutating state
            const currentItemIndex = items.findIndex(v => v.formID === item.formID) // <-- lookup by something unique on the item like an ID. It's better to lookup rather than assume the array indexes are ordered the same.
            items[currentItemIndex].checked = !items[currentItemIndex].checked
            setFormList(items);
            handleCheck();

          }}
        />
      </View>

    );

    useEffect(() => {
      _getFilesFromServer();
      _getFilesInDirectory();
    }, []);


    useLayoutEffect(() => {
      navigation.setOptions({
        title: 'Download Forms',
      });
    }, [navigation]);


    const handleRefresh = () => {
      setLoading(true); // Set refreshing to true to show the loading indicator
      _getFilesInDirectory();
      //fetchDataAndStore(language, setData, setLoading); // Fetch data when pulled down for refresh
    };

    const scrollY = useSharedValue(0);
  
    const onScroll = useAnimatedScrollHandler((event) => {
      scrollY.value = event.contentOffset.y;
    });

    const summaryBlockStyle = useAnimatedStyle(() => {

      return {
        height:   interpolate(scrollY.value,[0,HEADER_MAX_HEIGHT],[HEADER_MAX_HEIGHT,HEADER_MIN_HEIGHT],Extrapolation.CLAMP),
        //marginBottom: interpolate(scrollY.value,[0,200],[0,HEADER_MIN_HEIGHT],Extrapolation.CLAMP)
        opacity:  interpolate(scrollY.value,[0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],[1, 1, 0],Extrapolation.CLAMP),
          
      }
    });


    const titleBlockStyle = useAnimatedStyle(() => {

      return {
        opacity:  interpolate(scrollY.value,[0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],[0, 1, 1],Extrapolation.CLAMP),     
      }
    });

    return (
      <SafeAreaView style={{ flex: 1,}}>
        { isLoading ? 
          (<ActivityIndicator  size="large" color="#0000ff" />):
          (              
          <View style={{ flex: 1, backgroundColor: COLORS.backgroundColor}}>
            
              <Animated.View style={[styles.header, summaryBlockStyle ]}>
                <Ionicons name="ios-download-outline" size={50} color={COLORS.fontColor}  />
                <Text style={{fontSize: 30, color: COLORS.fontColor, paddingTop: 8,}}>Download Form</Text>
              </Animated.View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 15,
                  paddingVertical:8,
                  color: "#f7f2e4",
                }}
              >
                <Animated.Text style={[styles.title, titleBlockStyle]}> Download </Animated.Text>
                <Ionicons name="search-outline" size={24} color={COLORS.fontColor} />
                

              </View>
              
              <Animated.FlatList
                data={formList}
                scrollEventThrottle={16}
                renderItem={({item}) => (
                    <Item item={item}></Item>
                )}
                keyExtractor={item => item.formID}
                onScroll={onScroll}
                removeClippedSubviews
                contentContainerStyle={styles.list_container}
                style={styles.list}
                onRefresh={handleRefresh}
                refreshing={isLoading}
                
              />

              {filesChosen ? (
              <FAB
                size="small"
                title=""
                color={COLORS.fontColor}
                icon={<Ionicons name="ios-download-outline" size={22} color="white" />}
                placement='right'
                onPress={() => {
                  console.log('do download')
                  do_download()
                }}
              />
              ):(<></>)}

          </View>
          )
        }
      </SafeAreaView>
    )
}


export default downloadForms

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    paddingVertical: 3,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: COLORS.backgroundColor,
  },
  item_title: {
    fontSize: 20,
  },
  item_text: {
    fontSize: 12,
  },

  header: {
    height: HEADER_MAX_HEIGHT,
    margin: 0,
    fontSize: 50,
    color: COLORS.fontColor,
    alignItems: 'center',
    justifyContent: 'center',
  },

  list:{
    flex: 1,
    margin: 0,
    padding: 0,
    backgroundColor: COLORS.backgroundColor,
    borderRadius: 20,
  },

  list_container:{
    borderRadius: 25, 
    backgroundColor: "white",
  },
  
  title: {
    color: COLORS.fontColor,
    fontSize: 18,
    paddingTop: 3,
  },


});
