

import { View, Text, StyleSheet, ActivityIndicator, Pressable, SafeAreaView,  Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'

import * as FileSystem from 'expo-file-system';

import { fetchDataAndStore, retrieveStoredData } from '../../services/updates'
import { Link, router } from 'expo-router'

import { Ionicons, AntDesign } from '@expo/vector-icons';
import { FAB } from '@rneui/themed';

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

const path = '../../assets/forms/defn/'

import { useStoreState } from 'pullstate';
import { state } from '../../stores/state';
import { Asset } from 'expo-asset';


const data = () => {

    const [data, setData] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);


    language = 'en'

    _getFilesInDirectory = async() => {
      
      let files = [];
      let path = FileSystem.documentDirectory + 'FORMS/DATA/'
      let dir = await FileSystem.readDirectoryAsync(path);

      
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

    const Item = ({item}) => (
      <Link href={{
          pathname: "../dynamicForm",
          params: {
            id: item.file_name,
          },
        }} asChild>
        <Pressable>
          <View style={styles.item}>
            <View style={{padding: 10,}}>
              <Text style={{fontSize: 14,color: "black"}}>{item.file_name}</Text>
              <Text style={{fontSize: 12, color: "#ddd",}}>Form Name</Text>
              <Text style={{fontSize: 12, color: "#ddd",}}>created on</Text>
            </View>
          </View>
        </Pressable>
      </Link>
    );

    useEffect(() => {
      _getFilesInDirectory();
    }, []);

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
                <AntDesign name="database" size={50} color={COLORS.fontColor}  />
                <Text style={{fontSize: 30, color: COLORS.fontColor, paddingTop: 8,}}>Reported Data</Text>
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
                <Animated.Text style={[styles.title, titleBlockStyle]}> My Data </Animated.Text>
                <Ionicons name="search-outline" size={24} color={COLORS.fontColor} />

              </View>
              
              <Animated.FlatList
                data={data}
                scrollEventThrottle={16}
                renderItem={({item}) => (
                    <Item item={item}></Item>
                )}
                keyExtractor={item => item.file_name}
                onScroll={onScroll}
                removeClippedSubviews
                contentContainerStyle={styles.list_container}
                style={styles.list}
                onRefresh={handleRefresh}
                refreshing={isLoading}
                
              />
              <FAB
                size="small"
                title="Report"
                color={COLORS.fontColor}
                icon={{
                  name: "edit",
                  color: "white",
                }}
                placement='right'
                onPress={() => {
                  console.log('clicked')
                  router.push('../(form)/listForms')
                }}
              />
          </View>
          )
        }
      </SafeAreaView>
    )
}


export default data

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
