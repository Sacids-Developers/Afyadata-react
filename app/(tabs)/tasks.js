

import { View, Text, StyleSheet, ActivityIndicator, Pressable, SafeAreaView,  Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'


import { fetchDataAndStore, retrieveStoredData } from '../../services/updates'
import { Link } from 'expo-router'

import { Ionicons, Entypo } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";


import { HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT, HEADER_SCROLL_DISTANCE } from '../../constants/dimensions';
import {COLORS} from "../../constants/colors"


import { useStoreState } from 'pullstate';
import { state } from '../../stores/state';
import TasksItem from '../../components/TasksItem';


const tasks = () => {

    const [data, setData] = useState([])
    const [isLoading, setLoading] = useState(false)

    language = 'en'
    
    useEffect(() => {
      fetchDataAndStore(language, setData, setLoading); // Fetch data when the app is online
      retrieveStoredData(setData, setLoading); // Retrieve stored data when the app is offline
    }, []);

    const handleRefresh = () => {
      setLoading(true); // Set refreshing to true to show the loading indicator
      fetchDataAndStore(language, setData, setLoading); // Fetch data when pulled down for refresh
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
                <FontAwesome5 name="tasks" size={50} color={COLORS.headerTextColor} />
                <Text style={{fontSize: 30, color: COLORS.headerTextColor, paddingTop: 8,}}>My Tasks</Text>
              </Animated.View>

              <View style={styles.tab_header} >
                <Animated.Text style={[styles.title, titleBlockStyle]}> Tasks </Animated.Text>
                <View style={{flexDirection: "row"}}>
                  <Ionicons name="filter" size={20} color={COLORS.headerTextColor}/>
                  <Ionicons name="search-outline" size={22} color={COLORS.headerTextColor}  style={{paddingHorizontal: 14}} />
                  <Entypo name="dots-three-vertical" size={16} color={COLORS.headerTextColor} style={{paddingTop: 3}}/>
                </View>
              </View>
              
              <Animated.FlatList
                data={data}
                scrollEventThrottle={16}
                renderItem={({item}) => (
                    <TasksItem item={item}></TasksItem>
                )}
                keyExtractor={item => item.id}
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


export default tasks



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
    backgroundColor: COLORS.headerBgColor,
    alignItems: 'center',
    justifyContent: 'center',
  },


  tab_header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: COLORS.headerTextColor,
    verticalAlign: "middle",
    backgroundColor: COLORS.headerBgColor,
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
    color: COLORS.headerTextColor,
    fontSize: 18,
    paddingTop: 3,
  },


});
