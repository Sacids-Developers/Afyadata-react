 
 

import { View, Text, StyleSheet, ActivityIndicator, Pressable, SafeAreaView,  Dimensions } from 'react-native'
import React from 'react'


import {COLORS} from "../constants/colors"
import { Ionicons, Octicons, Entypo } from '@expo/vector-icons';

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


const scrollY = useSharedValue(0);
  
const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
});

const summaryBlockStyle = useAnimatedStyle(() => {

    return {
        height:   interpolate(scrollY.value,[0,HEADER_MAX_HEIGHT],[HEADER_MAX_HEIGHT,HEADER_MIN_HEIGHT],Extrapolation.CLAMP),
        opacity:  interpolate(scrollY.value,[0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],[1, 1, 0],Extrapolation.CLAMP),    
    }
});


const titleBlockStyle = useAnimatedStyle(() => {

    return {
    opacity:  interpolate(scrollY.value,[0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],[0, 1, 1],Extrapolation.CLAMP),     
    }
});


export default function pheader(icon, title){
    return (
        <>
            <Animated.View style={[styles.header, summaryBlockStyle ]}>
                <Octicons name="report" size={50} color={COLORS.fontColor} />
                <Text style={{fontSize: 30, color: COLORS.fontColor, paddingTop: 8,}}>{title}</Text>
            </Animated.View>
        </>
    )
}















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
  