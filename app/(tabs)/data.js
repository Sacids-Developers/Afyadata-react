

import { View, Text, StyleSheet, ActivityIndicator, Pressable, SafeAreaView,  Dimensions, Touchable, Button, Alert, TextInput } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'


import * as FileSystem from 'expo-file-system';

import { Link, router, useRouter } from 'expo-router'

import { Ionicons, AntDesign, MaterialIcons,MaterialCommunityIcons, Entypo} from '@expo/vector-icons';
import { FAB } from '@rneui/themed';
import BottomSheet from '@gorhom/bottom-sheet';
import { useMutation } from '@tanstack/react-query'
import filter from 'lodash.filter';

 

import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";


import {COLORS} from "../../constants/colors"
import { PATH } from '../../constants/global';
import DataItem from '../../components/DataItem';
import { HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT, HEADER_SCROLL_DISTANCE } from '../../constants/dimensions';
import { deleteFile } from '../../services/files';
import { submitFormData } from '../../services/api';
import { saveFormToFile } from '../../services/utils';
import { getFilesInDirectory } from '../../services/data';

const data = () => {

    const [data, setData] = useState([])
    const [fulldata, setFulldata] = useState([])
    const [dataStats, setDataStats] = useState({})
    const [isLoading, setLoading] = useState(false)
    const [isError, setError] = useState(false)
    const [selectedItems, setSelectedItems] = useState([]);
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('');



    // Bottom Sheet
    //const bottomSheetRef = useRef();
    const bottomSheetRef = useRef(null);
    const finalized_bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['50%', '75%'], []);
    const handleSheetChanges = useCallback((index) => {
      console.log('handleSheetChanges', index);
    }, []);
    const handleBSOpenPress = () => {
      bottomSheetRef.current?.snapToIndex(0)
    }


  const mutation = useMutation({
    mutationFn: (formData) => { submitFormData(formData) },
    onSuccess: (data) => {
      // update  view directly via setQueryData
      console.log('success',data)
    },
    onError: (error, variables, context) => {
      console.log('error',error);
    },
  });

 
  const getDataStats = (files, stat) => {
    let filtered = files.filter(item => item['status'].toLowerCase() === stat);
    return filtered.length
  }
  const handleRefresh = () => {
    getFilesInDirectory(PATH.form_data,setData,setLoading,setError);
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

  const sendAllFinalizedForms = () => {
    return(
      Alert.alert('From Submission', 'Are you sure you want to submit all forms to the server', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { 
          text: 'OK', 
          onPress: () => {
            let count = 0
            total_selected = selectedItems.length
            console.log('total_selected',total_selected)
            data.forEach((item) => {
              console.log('sending ....',item.file_name)
              if(sendFormToServer(item)){
                console.log('Sending form ',index, item.file_name)
                count++
              }
            });
            if(count){
              alert('Sent '+count+' forms to the server')
            }else{
              alert('Sent Failed')
            }
            handleRefresh()
          }
        },
      ])
    )
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
            if(deleteFile(PATH.form_data+fn)){
              console.log('reload data')
              count++
            }

          });

          getFilesInDirectory(PATH.form_data,setData,setLoading,setError);
          setSelectedItems([])
          console.log('Delete forms')
        }
      },
    ]);
  }

  const confirmSubmission = (item) => {
    Alert.alert('From Submission', 'Are you sure you want to submit the form to the server', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { 
        text: 'OK', 
        onPress: () => {
          if(sendFormToServer(item)){
            handleRefresh()
          }
        }
      },
    ]);
  }

  const sendFormToServer = (item) => {
    console.log('item',item)
    // open file from async storage
    const file_path = PATH.form_data+item.file_name;
    console.log(file_path)
    FileSystem.readAsStringAsync(file_path).then(
      (xForm) =>{
        let tForm = JSON.parse(xForm)
        // loop through tform
        const uuid      = tForm['meta']['uuid']
        const jform     = {}
        const formData  = new FormData()

        for(const page in tForm.pages){
          for(const field_name in tForm.pages[page]['fields']){
            if(tForm.pages[page]['fields'][field_name]['type'] == "image"){
              jform[field_name]   = tForm.pages[page]['fields'][field_name]['val']['name']
              formData.append(field_name, tForm.pages[page]['fields'][field_name]['val'])
            }else if(Array.isArray(tForm.pages[page]['fields'][field_name]['val'])){
              //console.log('is array')
              jform[field_name]   = tForm.pages[page]['fields'][field_name]['val'].join(",")
            }else{
              jform[field_name]   = tForm.pages[page]['fields'][field_name]['val']
            }
          }      
        }
        formData.append('data', JSON.stringify(jform))
        formData.append('meta', JSON.stringify(tForm.meta))
        //console.log(JSON.stringify(jform,null,4))

        response = submitFormData(formData).then(
          (response) => {
            if(!response){
              tForm.meta.status = 'sent'
              saveFormToFile(item.uuid,JSON.stringify(tForm,null,2))
              return true
            }
            return false
          }
        )
      }
    ).catch(
      (e) => {
        console.log(e)
        return false
      }
    )

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

  const selectAllItems = () => {
    const allItems = data.map(({ id }) => id);
    setSelectedItems([...allItems])
  }
  
  const handlePress = (item) => {

    if (selectedItems.length != 0) {
      return selectItems(item);
    }

    if(item.status.toUpperCase() == "SENT"){
      //console.log("IN DATA",item)
      return router.push({
        pathname: "../(form)/"+item.file_name,
        params: {
          form_fn: item.file_name,
          title: item.title,
        }
      })
    }else if(item.status.toUpperCase() == "FINALIZED"){
      return confirmSubmission(item)
    }else{
      return router.push({
        pathname: "../(form)/newForm",
        params: {
          form_fn: item.file_name,
          new_form: 0,
        }
      })
    }
  }

  const doFilter = (text) => {
    setFilter(text)
    deSelectItems()
    //setData(fulldata)
    filteredData = fulldata.filter(
      (item) => item.status.toLowerCase().includes(text.toLowerCase())
    )
    //console.log(filteredData)
    setData(filteredData)
  }
  const renderFilterOptions = () => {

    if(selectedItems.length == data.length && selectedItems.length != 0){
      return (
        <Pressable style={styles.filter_options_wrp} onPress={() => deSelectItems()} >
          <Text style={styles.filter_options_text}>Unselect All </Text>
        </Pressable>
      )
    }

    if(selectedItems.length != 0){
      return (
        <Pressable style={styles.filter_options_wrp} onPress={() => selectAllItems()} >
          <Text style={styles.filter_options_text}>Select All Items</Text>
        </Pressable>
      )
    }

    if(filter.toLowerCase() == 'finalized'){   
      return (
        <Pressable style={styles.filter_options_wrp} onPress={() => sendAllFinalizedForms()} >
          <Text style={styles.filter_options_text}>Send All Finalized</Text>
        </Pressable>
      )
    }

    return (
      <View style={styles.filter_options_wrp} >
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="always"
          onChangeText={(queryText) => {
            filteredData = data.filter(
              (item) => item.status.toLowerCase().includes(queryText.toLowerCase())
            )
            setData(filteredData)
          }}
          placeholder="Search"
          style={[styles.filter_options_text,{width: '100%'}]}
        ></TextInput>
      </View> 
    )
  }

  const renderItem = ({ item }) => (
    <DataItem
      item={item}
      onPress={() => handlePress(item)}
      onLongPress={() => selectItems(item)}
      isSelected={selectedItems.includes(item.id)}
    />
  );

  const getFilesInDirectory = async (dir_path) => {
  
    setLoading(true)
    setError(false)
    let files = [];
    let dir = await FileSystem.readDirectoryAsync(dir_path);

    dir.forEach((val, index) => {
      // read json file
      path = dir_path+val
      // console.log(path)
      // check if path is a directory
      FileSystem.getInfoAsync(path).then(
        (fileInfo) => {
          if(!fileInfo.isDirectory){
            FileSystem.readAsStringAsync(PATH.form_data+val).then(
              (xForm) =>{
                let tForm = JSON.parse(xForm)
                //console.log(val)
                let tmp = {
                  "id": index,
                  "file_name": val,
                  "form_name": tForm.meta.title,
                  "formID": tForm.meta.form_id,
                  "version":  tForm.meta.version,
                  "status":  tForm.meta.status,
                  "uuid":  tForm.meta.uuid,
                  "title":  tForm.meta.title,
                  "updated_on":  tForm.meta.updated_on,
                  "created_on":  tForm.meta.created_on,
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


    setData(files)
    setFulldata(files)
    setLoading(false)
    return files
  }

  useEffect(() => {

    getFilesInDirectory(PATH.form_data)

  }, []);


  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1,}}>
        <ActivityIndicator  size="large" color="#0000ff" />
      </SafeAreaView>)
  }

  if (isError) {
    return (
      <SafeAreaView style={{ flex: 1,}}>
        <Text>Error:</Text>
      </SafeAreaView>)
  }

  return (
      <SafeAreaView style={{ flex: 1,}}>         
        <View style={{ flex: 1, backgroundColor: COLORS.backgroundColor}}>
          
            <Animated.View style={[styles.header, summaryBlockStyle ]}>
              <AntDesign name="database" size={50} color={COLORS.headerTextColor}  />
              <Text style={{fontSize: 30, color: COLORS.headerTextColor, paddingTop: 8,}}>Reported Data</Text>
              <View style={{flexDirection: "row", gap: 10, width: '85%', paddingTop:20}}>

                <Pressable style={[styles.filter_wrp,(filter == '') ? {backgroundColor: COLORS.hightlightColor} : {backgroundColor: "transparent"}]} onPress={() => doFilter('')}>
                  <Text style={[styles.filter_text,{fontSize: 20}]}>{fulldata.length}</Text>
                  <Text style={[styles.filter_text,{fontSize: 12}]}>All</Text>
                </Pressable>
                <Pressable style={[styles.filter_wrp,(filter == 'draft') ? {backgroundColor: COLORS.hightlightColor} : {backgroundColor: "transparent"}]} onPress={() => doFilter('draft')}>
                  <Text style={[styles.filter_text,{fontSize: 20}]}>{getDataStats(fulldata,'draft')}</Text>
                  <Text style={[styles.filter_text,{fontSize: 12}]}>Draft </Text>
                </Pressable>
                <Pressable style={[styles.filter_wrp,(filter == 'finalized') ? {backgroundColor: COLORS.hightlightColor} : {backgroundColor: "transparent"}]} onPress={() => doFilter('finalized')}>
                  <Text style={[styles.filter_text,{fontSize: 20}]}>{getDataStats(fulldata,'finalized')}</Text>
                  <Text style={[styles.filter_text,{fontSize: 12}]}>Finalized </Text>
                </Pressable>
                <Pressable style={[styles.filter_wrp,(filter == 'sent') ? {backgroundColor: COLORS.hightlightColor} : {backgroundColor: "transparent"}]} onPress={() => doFilter('sent')}>
                  <Text style={[styles.filter_text,{fontSize: 20}]}>{getDataStats(fulldata,'sent')}</Text>
                  <Text style={[styles.filter_text,{fontSize: 12}]}>Sent</Text>
                </Pressable>
              </View>
              
              {renderFilterOptions()}
            </Animated.View>

            <View style={styles.tab_header} >
              <Animated.Text style={[styles.title, titleBlockStyle]}> My Data </Animated.Text>
              <View style={{flexDirection: "row"}}>
                <Ionicons name="search-outline" size={22} color={COLORS.headerTextColor}  style={{paddingHorizontal: 14}} onPress={() => router.push('../(form)/searchForms')}/>                 
                <Entypo name="dots-three-vertical" size={16} color={COLORS.headerTextColor} style={{paddingTop: 3}} onPress={() => handleBSOpenPress()} />
              </View>
            </View>
            
            <Animated.FlatList
              data={data}
              scrollEventThrottle={16}
              renderItem={(item) => renderItem(item)}
              extraData={selectedItems}
              keyExtractor={(item) => item.file_name}
              onScroll={onScroll}
              removeClippedSubviews
              contentContainerStyle={styles.list_container}
              style={styles.list}
              onRefresh={() => getFilesInDirectory(PATH.form_data,setData,setLoading,setError)}
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
                  <AntDesign name="form" size={24} color={COLORS.headerTextColor} />  
                )
              }
              placement='right'
              onPress={() => {
                selectedItems.length ? 
                confirmDeletion() :
                router.push(href='../(form)/listForms')}
              }
            />

            <BottomSheet
              ref={bottomSheetRef}
              index={-1}
              snapPoints={snapPoints}
              onChange={handleSheetChanges}
              backgroundStyle={{backgroundColor: COLORS.backgroundColor}}
              enablePanDownToClose={true}
            >
              <View style={styles.bs_wrp}>

                <Pressable 
                  onPress={ 
                    () => {
                      bottomSheetRef.current?.close();
                      router.push('../(form)/listForms');
                    }
                  }
                  style={styles.bs_item_wrp}
                > 
                  <View style={{flexDirection: "row"}}>
                    <MaterialCommunityIcons name="file-document-edit-outline" size={26} color={COLORS.fontColor} />
                    <Text style={styles.bs_item_element}>Fill New Form</Text>
                  </View>
                </Pressable>

                <Pressable
                  onPress={ 
                    () => {
                      bottomSheetRef.current?.close();
                      router.push('../(form)/listForms');
                    }
                  }
                  style={styles.bs_item_wrp}
                > 
                  <View style={{flexDirection: "row"}}>
                    <MaterialCommunityIcons name="file-send-outline" size={26} color={COLORS.fontColor} />
                    <Text style={styles.bs_item_element}>Send Finalized Forms</Text>
                  </View>
                </Pressable>

                <Pressable
                  onPress={ 
                    () => {
                      bottomSheetRef.current?.close();
                      router.push('../(form)/deleteForms');
                    }
                  }
                  style={styles.bs_item_wrp}
                > 
                  <View style={{flexDirection: "row"}}>
                    <MaterialCommunityIcons name="file-remove-outline" size={26} color={COLORS.fontColor} />
                    <Text style={styles.bs_item_element}>Delete Form</Text>
                  </View>
                </Pressable>

                <Pressable
                  onPress={ 
                    () => {
                      bottomSheetRef.current?.close();
                      router.push('../(form)/downloadForms');
                    }
                  }
                  style={styles.bs_item_wrp}
                >
                  <View style={{flexDirection: "row"}}>
                    <MaterialCommunityIcons name="file-download-outline" size={26} color={COLORS.fontColor} />
                    <Text style={styles.bs_item_element}>Download Form</Text>
                  </View>
                </Pressable>

                <Pressable onPress={() => bottomSheetRef.current?.close() } style={styles.bs_item_wrp} >
                  <View style={{flexDirection: "row"}}>
                    <MaterialCommunityIcons name="close-box-outline" size={26} color={COLORS.fontColor} />
                    <Text style={[styles.bs_item_element, styles.bs_item_cancel]}>Close</Text>
                  </View>
                </Pressable>


              </View>
            </BottomSheet>
        </View>
      </SafeAreaView>
    )
}


export default data

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingVertical: 2,
    color: COLORS.headerTextColor,
    verticalAlign: "middle",
    backgroundColor: COLORS.headerBgColor,
  },

  filter_wrp:{
    borderColor: COLORS.headerTextColor,
    borderRadius: 5,
    padding: 3,
    borderWidth: 1,
    flex: 1,
  },

  filter_text:{
    color: COLORS.headerTextColor,
    textAlign: 'center', 
  },

  filter_options_wrp:{
    backgroundColor: 'transparent',
    padding: 2,
    marginVertical: 10,
    borderRadius: 5,
    borderWidth:1,
    borderColor: COLORS.headerTextColor,
    width: '85%',
  },

  filter_options_text:{ 
    color: COLORS.headerTextColor, 
    fontSize: 18, 
    padding:5,
    textAlign: 'center', 
  },

  list:{
    flex: 1,
    margin: 0,
    padding: 0,
    backgroundColor: COLORS.backgroundColor,
    borderRadius: 20,
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

  bs_item_wrp:{
    paddingVertical: 11,
    paddingHorizontal:15,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },

  bs_item_element: {
    paddingHorizontal:15,
    color: "#333",
    fontSize: 18,
  },

  bs_item_cancel: {
    color: COLORS.fontColor,
  },

  bs_wrp:{
    flex: 1, 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    paddingTop:20,
  },





});
