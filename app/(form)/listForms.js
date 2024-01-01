

import { View, Text, StyleSheet, ActivityIndicator, Pressable, SafeAreaView,  Dimensions } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'

import * as FileSystem from 'expo-file-system';

import { Link, router, useNavigation } from 'expo-router'

import { Ionicons, AntDesign, Entypo } from '@expo/vector-icons';
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
import {PATH, URL} from "../../constants/global"


const listForms = () => {

    const [data, setData] = useState([])
    const [isLoading, setLoading] = useState(false)
    const navigation = useNavigation();


    language = 'en'

    _getFilesInDirectory = async() => {
      
      let files = [];
      let dir = await FileSystem.readDirectoryAsync(PATH.form_defn);

      dir.forEach((val) => {

        // read json file
        FileSystem.readAsStringAsync(PATH.form_defn+val).then(
          (xForm) =>{
            let tForm = JSON.parse(xForm)
            console.log(tForm.meta.name)
            let tmp = {
              "file_name": val,
              "form_name": tForm.meta.name,
              "version":  tForm.meta.version,
            }
            files.push(tmp);
          }
        ).catch(
          (e) => {console.log(e)}
        )  
      
      });
      console.log(files)
      setData(files)
      setLoading(false)

      ;
    }

    const Item = ({item}) => (
      <Link href={{
          pathname: "../newForm",
          params: {
            form_fn: item.file_name,
            new_form: "1",
          },
        }} asChild>
        <Pressable>
          <View style={styles.item}>
            <View style={{padding: 10,}}>
              <Text style={{fontSize: 14,color: "black"}}>{item.form_name}</Text>
              <Text style={{fontSize: 12, color: "#999",}}>{item.file_name}</Text>
              <View style={{flexDirection: "row"}}>
                <Text style={{fontSize: 12, color: "#aaa",}}>created on</Text>
                <Text style={{fontSize: 12, color: "#aaa",}}> | Version {item.version}</Text>
              </View>
            </View>
          </View>
        </Pressable>
      </Link>
    );

    useEffect(() => {
      _getFilesInDirectory();
    }, []);

    useLayoutEffect(() => {
      navigation.setOptions({
        title: 'List Forms',
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
                <Entypo name="new-message" size={50} color={COLORS.fontColor}  />
                <Text style={{fontSize: 30, color: COLORS.fontColor, paddingTop: 8,}}>Fill Form</Text>
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
                <Animated.Text style={[styles.title, titleBlockStyle]}> Fill Form </Animated.Text>
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
          </View>
          )
        }
      </SafeAreaView>
    )
}


export default listForms

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
