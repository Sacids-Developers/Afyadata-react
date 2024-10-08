

import { View, Text, StyleSheet, ActivityIndicator, Pressable, SafeAreaView,  Dimensions, FlatList, Alert, TouchableOpacity } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import axios from 'axios';

import * as FileSystem from 'expo-file-system';

import { Link, Stack, router, useNavigation } from 'expo-router'

import { Ionicons, AntDesign, Entypo } from '@expo/vector-icons';
import { FAB, CheckBox } from '@rneui/themed';



import {COLORS} from "../../constants/colors"
import {PATH, URL} from "../../constants/global"
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchForms } from '../../services/api';
import gStyles from '../../components/gStyles';
import ExpoStatusBar from 'expo-status-bar/build/ExpoStatusBar';
const downloadForms = () => {

  const [downloadProgress, setDownloadProgres] = useState(0)
  const [checkedForms, setCheckedForms] = useState([]);





  const callback = downloadProgress => {
    const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
    setDownloadProgres(progress)
  };
    
  const do_download = () =>  {
  
    let fail = false
    checkedForms.forEach( async (item) => {

      const downloadResumable = FileSystem.createDownloadResumable(
        item.downloadUrl,
        PATH.form_defn+item.formID,
        {},
        callback
      );
  
      try {
        const { uri } = await downloadResumable.downloadAsync();
      } catch (e) {
        fail = true
        console.error(e);
      }
    })
    
    if(!fail) finalizeDownload();

  }

  const finalizeDownload = () => {
    Alert.alert('Download Successful', 'Do you want to fill out new form now', [
      {
        text: 'No',
        onPress: () => {
          console.log('Cancel Pressed'),
          router.back(),
          router.back()
        },
        style: 'cancel',
      },
      { 
        text: 'Yes', 
        onPress: () => {
          router.back()
        }
      },
    ]);
  }



  const handleCheckboxChange = (item) => {
    console.log(item)
    const isChecked = checkedForms.includes(item);
    if (isChecked) {
      setCheckedForms(checkedForms.filter(i => i !== item));
    } else {
      setCheckedForms([...checkedForms, item]);
    }
  };

  const Item = ({item}) => (

    <TouchableOpacity
      onPress={() => handleCheckboxChange(item)}
      style={[styles.item, checkedForms.includes(item) && styles.selectedItem]}
    >
    <View style={{flexDirection: "row",alignItems: "center"}}>
      <View style={[styles.icon, checkedForms.includes(item) && {backgroundColor: COLORS.primaryColor}]}>
        {checkedForms.includes(item) ? <AntDesign name="check" size={24} color="white" /> :  <Text style={{fontSize: 18, color: "white"}}>{item.name[0].toUpperCase()}</Text>}
      </View>
      <View style={{paddingLeft: 0, flexDirection: "column",gap:2}}>
        <Text style={{fontSize: 17,color: "#000", fontWeight: "500" }}>{item.name} </Text>
        <Text style={{fontSize: 15, color: "#999",}}>Last Update: { item.updated_on == undefined ? 'N/A' : moment(item.updated_on).format('Do MMMM YY, H:mm')}</Text>
      </View>
    </View>
  </TouchableOpacity>

  );

  const Item1 = ({item}) => (

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

  const renderHeader = () => {
    
    if(checkedForms.length != 0){

      return (
        <View style={[styles.pageHeader,{backgroundColor: COLORS.primaryColor}]}>
           <View style={{flexDirection:"row", gap: 15, alignItems: "center"}}>
            <AntDesign name="arrowleft" size={22} color={COLORS.headerTextColor} onPress={() => {router.back()}}/>
            <Text style={{fontSize: 22, color: COLORS.headerTextColor, fontWeight: 400}} >{checkedForms.length}</Text>
            {(checkedForms.length != data.length) ? 
                <Text style={{ borderWidth: 1, color: COLORS.headerTextColor, borderColor: COLORS.headerTextColor, borderRadius: 5, paddingVertical: 4, paddingHorizontal:15}} onPress={() => selectAllItems()}>Select All</Text>
                : 
                <Text style={{ borderWidth: 1, color: COLORS.headerTextColor, borderColor: COLORS.headerTextColor, borderRadius: 5, paddingVertical: 4, paddingHorizontal:15}} onPress={() => setCheckedForms([])}>Un Select</Text>
            }
          
          </View>
          <View style={{flexDirection: "row",alignItems: "center", gap: 15}}>
            <AntDesign name="download" size={22} color={COLORS.headerTextColor} onPress={() => do_download()} />          
          </View>
        </View>
      )        
    }
    return (
      <View style={[styles.pageHeader,{backgroundColor: COLORS.primaryColor}]}>
        <AntDesign name="arrowleft" size={22} color={COLORS.headerTextColor} onPress={() => {router.back()}}/>
        <Text style={{fontSize: 22, color: COLORS.headerTextColor, fontWeight: 400}}>Download Forms</Text>
        <View style={{flexDirection: "row", gap: 15, alignItems: "center"}}>
        </View>
      </View>
    )
    
  }


  const {isLoading, isError, data, error} = useQuery({ 
    queryKey: ['fetchForms'], 
    queryFn: fetchForms,
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
    <SafeAreaView style={[gStyles.AndroidSafeArea,]}>
      <ExpoStatusBar />
      <Stack.Screen options={
          {
            headerShown: false,
          }
      } /> 
      {renderHeader()}
      <FlatList
        data={data}
        scrollEventThrottle={16}
        renderItem={({item}) => (<Item item={item}></Item>)}
        keyExtractor={item => item.id}
        removeClippedSubviews
        contentContainerStyle={styles.list_container}
        style={styles.list}
        onRefresh={() => queryClient.invalidateQueries({ queryKey: ['fetchForms'] })}
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
  },

  list_container:{
    marginTop: 15,
    backgroundColor: "white",
  },
  
  title: {
    color: COLORS.fontColor,
    fontSize: 18,
    paddingTop: 3,
  },

  item: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomColor: COLORS.backgroundColor,
  },
  item_title: {
    fontSize: 16,
  },
  item_text: {
    fontSize: 12,
  },
  selectedItem: {
    backgroundColor: COLORS.secondaryColor,
    borderRadius: 0,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
    color:"white",
    backgroundColor: "#999",
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },


  pageHeader:{
    paddingHorizontal: 15, 
    paddingVertical:15, 
    flexDirection:"row",
    justifyContent:"space-between", 
    alignItems: "center", 
    backgroundColor: COLORS.slate,
    borderBottomColor: COLORS.slate,
    borderBottomWidth: 1,
  },

});
