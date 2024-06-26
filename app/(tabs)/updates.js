

import { View, Text, StyleSheet, ActivityIndicator, Pressable, SafeAreaView,  Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'


import { fetchNews } from '../../services/api';

import { Ionicons, Octicons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';

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
import { useQuery } from '@tanstack/react-query';
import UpdateItem from '../../components/UpdateItem'
import { FAB } from '@rneui/themed';

const updates = () => {

  const {isPending, isError, data, error} = useQuery({ queryKey: ['news'], queryFn: fetchNews })

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });
  const summaryBlockStyle = useAnimatedStyle(() => {

    return {
      height:   interpolate(scrollY.value,[0,HEADER_MAX_HEIGHT],[HEADER_MAX_HEIGHT,HEADER_MIN_HEIGHT],Extrapolation.CLAMP),
      //marginBottom: interpolate(scrollY.value,[0,200],[0,HEADER_MIN_HEIGHT],Extrapolation.CLAMP)
      //opacity:  interpolate(scrollY.value,[0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],[1, 1, 0],Extrapolation.CLAMP),
        
    }
  });
  const titleBlockStyle = useAnimatedStyle(() => {

    return {
      opacity:  interpolate(scrollY.value,[0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],[0, 1, 1],Extrapolation.CLAMP),     
    }
  });

  if (isPending) {
    return (
      <SafeAreaView style={{ flex: 1,}}>
        <ActivityIndicator  size="large" color="#0000ff" />
      </SafeAreaView>)
  }

  if (isError) {
    return (
      <SafeAreaView style={{ flex: 1,}}>
        <Text>Error: {error.message}</Text>
      </SafeAreaView>)
  }

  return (
    <SafeAreaView style={{ flex: 1,}}>

      <View style={{ flex: 1, backgroundColor: COLORS.backgroundColor}}>
    
        <Animated.View style={[styles.header, summaryBlockStyle ]}>
          <Octicons name="report" size={50} color={COLORS.headerTextColor} />
          <Text style={{fontSize: 30, color: COLORS.headerTextColor, paddingTop: 8,}}>Inbox</Text>
        </Animated.View>

        <View style={styles.tab_header} >
          <Animated.Text style={[styles.title, titleBlockStyle]}> Inbox </Animated.Text>
          <View style={{flexDirection: "row"}}>
            <Ionicons name="filter" size={20} color={COLORS.headerTextColor}/>
            <Ionicons name="search-outline" size={22} color={COLORS.headerTextColor}  style={{paddingHorizontal: 14}} />
            <Entypo name="dots-three-vertical" size={16} color={COLORS.headerTextColor} style={{paddingTop: 3}}/>
          </View>
        </View>

        <Animated.FlatList
          data={data}
          scrollEventThrottle={16}
          renderItem={({item}) => (<UpdateItem item={item}></UpdateItem>)}
          keyExtractor={item => item.id}
          onScroll={onScroll}
          removeClippedSubviews
          contentContainerStyle={styles.list_container}
          style={styles.list}
          //onRefresh={handleRefresh}
          //refreshing={isLoading}
        />
        <FAB
          size="large"
          title=""
          color={COLORS.fontColor}
          icon={<MaterialCommunityIcons name="message-plus-outline" size={24} color={COLORS.headerTextColor} />}
          placement='right'
          onPress={() => {
            console.log('Write Message')
          }}
        />
      </View>
    </SafeAreaView>
  )
}



export default updates



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
    color: COLORS.fontColor,
    alignItems: 'center',
    justifyContent: 'center',
  },


  tab_header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingTop: 40,
    color: "#f7f2e4",
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
