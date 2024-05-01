

import { View, Text, StyleSheet, ActivityIndicator, Pressable, SafeAreaView,  FlatList, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'

import * as FileSystem from 'expo-file-system';

import { Link, Stack, router, useNavigation } from 'expo-router'

import { Ionicons, AntDesign, Entypo } from '@expo/vector-icons';
import { FAB } from '@rneui/themed';


import {COLORS} from "../../constants/colors"
import {PATH, URL} from "../../constants/global"
import DataItem from '../../components/DataItem';
import { deleteFile } from '../../services/files';



const listForms = () => {

  const [data, setData] = useState({})
  const [isLoading, setLoading] = useState(false)
  const [selectedItems, setSelectedItems] = useState([]);


  language = 'en'

  _getFilesInDirectory = async () => {
    
    setLoading(true)
    let files = [];
    const directoryUri = PATH.form_defn;
    let dir = await FileSystem.readDirectoryAsync(directoryUri);

    let index = 0
    for(const file of dir){

      index = index+1
      const fileUri = `${directoryUri}/${file}`;
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      //console.log('ze info',fileInfo)
      const modificationTime = new Date(fileInfo.modificationTime);
      const fileContents = await FileSystem.readAsStringAsync(fileUri);
      let tForm = JSON.parse(fileContents)
      let tmp = {
        "id": index,
        "file_name": file,
        "form_name": tForm.meta.name,
        "formID": tForm.meta.id,
        "uuid": file,
        "version":  tForm.meta.version,
        "status":  tForm.meta.title,
        "title":  tForm.meta.title,
        "updated_on":  modificationTime,
      }
      files.push(tmp);
    }

    setData(files)
    setLoading(false)
  }


  _getFilesInDirectory1 = async () => {
    
    setLoading(true)
    //setError(false)
    let files = [];
    
    FileSystem.readDirectoryAsync(PATH.form_defn).then(
      (dir) => {            
        dir.forEach((val, index) => {
          // read json file
          path = PATH.form_defn+val
          // check if path is a directory
          FileSystem.getInfoAsync(path).then(
            (fileInfo) => {
              if(!fileInfo.isDirectory){
                modificationTime = fileInfo.modificationTime ? new Date(fileInfo.modificationTime).toDateString() : undefined
                FileSystem.readAsStringAsync(path).then(
                  (xForm) =>{
                    let tForm = JSON.parse(xForm)
                    let tmp = {
                      "id": index,
                      "file_name": val,
                      "form_name": tForm.meta.title,
                      "formID": tForm.meta.form_id,
                      "version":  tForm.meta.version,
                      "status":  tForm.meta.title,
                      "title":  tForm.meta.title,
                      "updated_on":  modificationTime, //fileInfo.modificationTime,
                    }
                    files.push(tmp);
                  }
                ).catch(
                  (e) => {
                    console.log(e)
                    setError(true)
                  }
                  
                )  
              }
            }
          ).catch(
            (e) => {
              console.log(e)
            }
          )  
        });
      }
    ).catch(
      (e) => {
        console.log(e)
      }
    )

    setData(files)
    setLoading(false)
  }
      
  const confirmDeletion = () => {
    Alert.alert('From Deletion', 'Are you sure you want to delete form(s) on your phone', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { 
        text: 'OK', 
        onPress: () => {
          count   = 0
          total_selected = selectedItems.length
          selectedItems.forEach((index) => {
            fn = data[index].file_name
            console.log('deleting ....',fn)
            if(deleteFile(PATH.form_defn+fn)){
              console.log('reload data')
              count++
            }

          });

          _getFilesInDirectory();
          setSelectedItems([])
          console.log('Delete forms')
        }
      },
    ]);
  }

  const confirmSubmission = () => {
    Alert.alert('From Submission', 'Are you sure you want to submit the form to the server', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { 
        text: 'OK', 
        onPress: () => console.log('Sending Form to Server')},
    ]);
  }


  
  const deSelectItems = () => {
    setSelectedItems([]);
  }
  const selectItems = (item) => {
    if (selectedItems.includes(item.id)) {
      const newListItems = selectedItems.filter(
        listItem => listItem !== item.id,
      );
      return setSelectedItems([...newListItems]);
    }
    setSelectedItems([...selectedItems, item.id]);
  };
  
  const handlePress = (item) => {


    if (selectedItems.length != 0) {
      return selectItems(item);
    }

    return router.push({
      pathname: "../(form)/newForm",
      params: {
        form_fn: item.file_name,
        new_form: 1,
      }
    })
    
  }

  const renderItem = ({ item }) => (
    <DataItem
      item={item}
      onPress={() => handlePress(item)}
      onLongPress={() => selectItems(item)}
      isSelected={selectedItems.includes(item.id)}
    />
  );

  useEffect(() => {
    _getFilesInDirectory();
  }, []);

  const handleRefresh = () => {
    setLoading(true); // Set refreshing to true to show the loading indicator
    _getFilesInDirectory();
    //fetchDataAndStore(language, setData, setLoading); // Fetch data when pulled down for refresh
  };


  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1,}}>
        <ActivityIndicator  size="large" color="#0000ff" />
      </SafeAreaView>)
  }

   
  return (
    <SafeAreaView style={{ flex: 1,}}>
      <Stack.Screen options={
        {
          title: 'Avaialable forms',
          headerTintColor: COLORS.headerTextColor,
          headerStyle: {
            backgroundColor: COLORS.headerBgColor,
            fontWeight: "bold",
          },
          //headerRight: () => <Entypo name="dots-three-vertical" size={16} color={COLORS.headerTextColor} style={{paddingTop: 3}} onPress={() => handleBSOpenPress()} />,
        }
      } />            
          
          
      <FlatList
        data={data}
        renderItem={(item) => renderItem(item)}
        extraData={selectedItems}
        keyExtractor={(item) => item.file_name}
        removeClippedSubviews
        contentContainerStyle={styles.list_container}
        style={styles.list}
        refreshing={isLoading}
        
      />

      <FAB
        size="large"
        title=""
        color={COLORS.fontColor}
        icon={
          (
            selectedItems.length ? 
            <AntDesign name="delete" size={24} color={COLORS.headerTextColor} /> :  
            <AntDesign name="download" size={24} color={COLORS.headerTextColor} />  
          )
        }
        placement='right'
        onPress={() => {
          selectedItems.length ? 
          confirmDeletion() :
          router.push(href='../(form)/downloadForms')}
        }
      />
    </SafeAreaView>
  )
}


export default listForms

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  


});
