

import { View, Text, StyleSheet, ActivityIndicator, Pressable, SafeAreaView,  Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'

import { Link } from 'expo-router'

import { Ionicons, AntDesign, MaterialIcons } from '@expo/vector-icons';

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

let settings = [
  {id: 1, title: 'Language', icon: 'language', link_to: 'hapa'},
  {id: 2, title: 'moja', icon: 'autorenew', link_to: 'hapa'},
  {id: 3, title: 'mbili', icon: 'autorenew', link_to: 'hapa'},
  {id: 4, title: 'server', icon: 'autorenew', link_to: 'hapa'},
  {id: 5, title: 'projects', icon: 'autorenew', link_to: 'hapa'},
  {id: 6, title: 'profile', icon: 'autorenew', link_to: 'hapa'},
  {id: 7, title: 'theme', icon: 'autorenew', link_to: 'hapa'},
]


const data = () => {

    const [data, setData] = useState([])
    const [isLoading, setLoading] = useState(false)

    language = 'en'

    const Item = ({setting}) => (
      <Link href={{
          pathname: "",
          params: {
            id: setting.id,
            title: setting.title,
          },
        }} asChild>
        <Pressable>
          <View style={styles.item}>
            <View style={{padding: 10, flexDirection: "row"}}>
              <MaterialIcons name={setting.icon} size={24} color="black" />
              <Text style={styles.item_title}>{setting.title}</Text>
            </View>
          </View>
        </Pressable>
      </Link>
    );

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
                data={settings}
                scrollEventThrottle={16}
                renderItem={({item}) => (
                    <Item setting={item}></Item>
                )}
                keyExtractor={item => item.id}
                onScroll={onScroll}
                removeClippedSubviews
                contentContainerStyle={styles.list_container}
                style={styles.list}
                refreshing={isLoading}
                
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
    paddingLeft: 25,
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
