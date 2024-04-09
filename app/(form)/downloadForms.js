

import { View, Text, StyleSheet, ActivityIndicator, Pressable, SafeAreaView,  Dimensions, FlatList } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import axios from 'axios';

import * as FileSystem from 'expo-file-system';

import { Link, Stack, router, useNavigation } from 'expo-router'

import { Ionicons, AntDesign, Entypo } from '@expo/vector-icons';
import { FAB, CheckBox } from '@rneui/themed';



import {COLORS} from "../../constants/colors"
import {PATH, URL} from "../../constants/global"
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getForms } from '../../services/api';
API_URL     = "http://127.0.0.1:8000/form_list"


const downloadForms = () => {

  const [downloadProgress, setDownloadProgres] = useState(0)
  const [checkedForms, setCheckedForms] = useState([]);





  const callback = downloadProgress => {
    const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
    setDownloadProgres(progress)
  };
    
  const do_download = () =>  {
  
    checkedForms.forEach( async (item) => {

      console.log(item.downloadUrl)
  
      const downloadResumable = FileSystem.createDownloadResumable(
        item.downloadUrl,
        PATH.form_defn+item.formID,
        {},
        callback
      );
  
      try {
        const { uri } = await downloadResumable.downloadAsync();
        alert('Finished downloading to ', uri);
      } catch (e) {
        console.error(e);
      }
    })

  }


  const handleCheckboxChange = (item) => {
    const isChecked = checkedForms.includes(item);
    if (isChecked) {
      setCheckedForms(checkedForms.filter(i => i !== item));
    } else {
      setCheckedForms([...checkedForms, item]);
    }
  };

  const Item = ({item}) => (

    <View style={styles.item}>
      <CheckBox
        title={item.name + ' : '+ item.formID}
        checked={checkedForms.includes(item)}
        checkedColor={COLORS.fontColor}
        onPress={() => {
          handleCheckboxChange(item);
        }}
      />
    </View>

  );



  const {isLoading, isError, data, error} = useQuery({ 
    queryKey: ['getForms'], 
    queryFn: getForms,
  })
  const queryClient = useQueryClient();

  if (isLoading) {
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
      <Stack.Screen options={
          {
            title: 'Download forms',
            headerTintColor: COLORS.headerTextColor,
            headerStyle: {
              backgroundColor: COLORS.headerBgColor,
              fontWeight: "bold",
            },
          }
      } /> 
               
      <FlatList
        data={data}
        scrollEventThrottle={16}
        renderItem={({item}) => (<Item item={item}></Item>)}
        keyExtractor={item => item.id}
        removeClippedSubviews
        contentContainerStyle={styles.list_container}
        style={styles.list}
        onRefresh={() => queryClient.invalidateQueries({ queryKey: ['getForms'] })}
        refreshing={isLoading}
        
      />

      {checkedForms.length != 0 ? (
      <FAB
        size="large"
        title=""
        color={COLORS.fontColor}
        icon={<AntDesign name="download" size={24} color={COLORS.headerTextColor} />  }
        placement='right'
        onPress={() => {
          console.log('do download')
          do_download()
        }}
      />
      ):(<></>)}

    </SafeAreaView>
  )
}


export default downloadForms

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    paddingVertical: 1,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.backgroundColor,
  },
  item_title: {
    fontSize: 20,
  },
  item_text: {
    fontSize: 12,
  },

  list:{
    flex: 1,
    margin: 0,
    padding: 0,
    backgroundColor: COLORS.backgroundColor,
    borderRadius: 20,
  },

  list_container:{
    paddingVertical: 10,
    backgroundColor: "white",
  },
  
  title: {
    color: COLORS.fontColor,
    fontSize: 18,
    paddingTop: 3,
  },


});
