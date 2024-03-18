

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

const HEADER_MAX_HEIGHT = Dimensions.get('window').height/2.6;
const HEADER_MIN_HEIGHT = 30;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

import {COLORS} from "../../constants/colors"


import { useStoreState } from 'pullstate';
import { state } from '../../stores/state';


const tasks = () => {

    const [data, setData] = useState([])
    const [isLoading, setLoading] = useState(false)

    language = 'en'

    const Item = ({update}) => (
      <Link href={{
          pathname: "",
          params: {
            id: update.id,
            question: update.title,
            answer: update.title,
          },
        }} asChild>
        <Pressable>
          <View style={styles.item}>
            <View style={{padding: 10,}}>
              <Text style={styles.item_title}>{update.title}</Text>
            </View>
          </View>
        </Pressable>
      </Link>
    );

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
                <FontAwesome5 name="tasks" size={50} color={COLORS.fontColor} />
                <Text style={{fontSize: 30, color: COLORS.fontColor, paddingTop: 8,}}>My Tasks</Text>
              </Animated.View>

              <View style={styles.tab_header} >
                <Animated.Text style={[styles.title, titleBlockStyle]}> Tasks </Animated.Text>
                <View style={{flexDirection: "row"}}>
                  <Ionicons name="filter" size={20} color={COLORS.fontColor}/>
                  <Ionicons name="search-outline" size={22} color={COLORS.fontColor}  style={{paddingHorizontal: 14}} />
                  <Entypo name="dots-three-vertical" size={16} color={COLORS.fontColor} style={{paddingTop: 3}}/>
                </View>
              </View>
              
              <Animated.FlatList
                data={data}
                scrollEventThrottle={16}
                renderItem={({item}) => (
                    <Item update={item}></Item>
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
    color: COLORS.fontColor,
    alignItems: 'center',
    justifyContent: 'center',
  },


  tab_header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: "#f7f2e4",
    verticalAlign: "middle",
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
