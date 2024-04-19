

import { View, Text, StyleSheet, ActivityIndicator, Pressable, SafeAreaView,  FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, Redirect } from 'expo-router'

import { Ionicons, AntDesign, MaterialIcons } from '@expo/vector-icons';

import {COLORS} from "../../constants/colors"
import { LinearGradient } from 'expo-linear-gradient';



import { useStoreState } from 'pullstate';
import { state } from '../../stores/state';

let settings = [
  //{id: 6, title: 'Profile', icon: 'badge', link_to: 'hapa'},
  {id: 5, title: 'Server', icon: 'computer', link_to: 'hapa'},
  {id: 1, title: 'Language', icon: 'language', link_to: 'hapa'},
  {id: 3, title: 'Symptoms', icon: 'swipe', link_to: 'hapa'},
  {id: 4, title: 'One Health Repository', icon: 'pageview', link_to: 'hapa'},
  {id: 7, title: 'About AfyaData', icon: 'badge', link_to: 'hapa'},
  {id: 6, title: 'Sign Out', icon: 'badge', link_to: 'hapa'},

]

const more_settings = () => {

    const [data, setData] = useState([])
    const [isLoading, setLoading] = useState(false)

  language = 'en';

    const Item = ({setting}) => (
      <Link href={{
          pathname: "",
          params: {
            id: setting.id,
            title: setting.title,
          },
        }} asChild>
        <Pressable>
              <Text style={styles.item_title}>{setting.title}</Text>
        </Pressable>
      </Link>
    );



    return (
      <SafeAreaView style={{ flex: 1,}}>           
          <LinearGradient 
            colors={['#852933','#852933', '#a83440', '#bd2030','#801b25']}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={{ flex: 1,  backgroundColor: COLORS.headerBgColor}}
          >
            <View style={{flex: 5}}>

            </View>
            <FlatList
              data={settings}
              renderItem={({item}) => (<Item setting={item}></Item>)}
              keyExtractor={item => item.id}
              removeClippedSubviews
              refreshing={isLoading}
            />
            <View style={{flex: 1}}></View>
          </LinearGradient>
      </SafeAreaView>
    )
}


export default more_settings



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item_title: {
    fontSize: 26,
    fontWeight: "bold",
    paddingLeft: 30,
    paddingVertical: 10,
    color: COLORS.headerTextColor,
  },
  item_text: {
    fontSize: 12,
  },

  
  title: {
    color: COLORS.headerTextColor,
    fontSize: 18,
    paddingTop: 3,
  },


});
