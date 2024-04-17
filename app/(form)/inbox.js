

import { View, Text, StyleSheet, ActivityIndicator, Pressable, SafeAreaView,  Dimensions, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'


import { fetchDataAndStore, retrieveStoredData } from '../../services/updates'
import { Link } from 'expo-router'
import { Ionicons, Octicons, Entypo} from '@expo/vector-icons';

import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";


import {COLORS} from "../../constants/colors"


import { useStoreState } from 'pullstate';
import { state } from '../../stores/state';


const updates = () => {

    const [data, setData] = useState([])
    const [isLoading, setLoading] = useState(false)

    language = 'en'

    const Item = ({update, index}) => {  
        console.log(index);
        if(index == 0){
          return (
            <Text style={{
              paddingVertical: 80, 
              fontSize: 20, 
              paddingHorizontal: 20, 
              backgroundColor: "#eee",
              marginHorizontal: 20,
              marginTop: 20,
              borderRadius: 20,
              color: "maroon",
            }}>Inbox</Text>
          )
        }
        return (
          <Link href={{
              pathname: "dynamicForm",
              params: {
                id: update.id,
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
        )
  };

    useEffect(() => {
      fetchDataAndStore(language, setData, setLoading); // Fetch data when the app is online
      retrieveStoredData(setData, setLoading); // Retrieve stored data when the app is offline
    }, []);

    const handleRefresh = () => {
      setLoading(true); // Set refreshing to true to show the loading indicator
      fetchDataAndStore(language, setData, setLoading); // Fetch data when pulled down for refresh
    };

   

    return (
      <SafeAreaView style={{ flex: 1,}}>
        { isLoading ? 
          (<ActivityIndicator  size="large" color="#0000ff" />):
          (              
          <View style={{ flex: 1, backgroundColor: COLORS.backgroundColor}}>
            

              <View style={styles.header} >
                <Text style={styles.title}> Inbox </Text>
                <View style={{flexDirection: "row"}}>
                  <Ionicons name="filter" size={20} color={COLORS.fontColor}/>
                  <Ionicons name="search-outline" size={22} color={COLORS.fontColor}  style={{paddingHorizontal: 14}} />
                  <Entypo name="dots-three-vertical" size={16} color={COLORS.fontColor} style={{paddingTop: 3}}/>
                </View>
              </View>
               
              <FlatList
                data={data}
                scrollEventThrottle={16}
                renderItem={({item, index}) => (     
                    <Item update={item} index={index}></Item>
                )}
                keyExtractor={item => item.id}
                removeClippedSubviews
                contentContainerStyle={styles.list_container}
                style={styles.list}
                //onRefresh={handleRefresh}
                refreshing={isLoading}
                
              />
          </View>
          )
        }
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
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical:12,
    color: "#f7f2e4",
    verticalAlign: "middle",
  },

  list:{
    flex: 1,
    margin: 0,
    padding: 0,
    backgroundColor: COLORS.backgroundColor,
  },

  list_container:{
    backgroundColor: "white",
  },
  
  title: {
    color: COLORS.fontColor,
    fontSize: 18,
    paddingTop: 3,
  },


});
