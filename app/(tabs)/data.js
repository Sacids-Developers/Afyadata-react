

import { View, Text, StyleSheet, ActivityIndicator, Pressable, SafeAreaView,  Dimensions, Touchable, Button, Alert } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'


import * as FileSystem from 'expo-file-system';

import { fetchDataAndStore, retrieveStoredData } from '../../services/updates'
import { Link, router, useRouter } from 'expo-router'

import { Ionicons, AntDesign, MaterialIcons,MaterialCommunityIcons, Entypo} from '@expo/vector-icons';
import { FAB } from '@rneui/themed';
import BottomSheet from '@gorhom/bottom-sheet';

 

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


const data = () => {

    const [data, setData] = useState({})
    const [isLoading, setLoading] = useState(false)
    const [isError, setError] = useState(false)
    const [selectedItems, setSelectedItems] = useState([]);


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


    

    _getFilesInDirectory = async() => {
      
      setLoading(true)
      setError(false)
      let files = [];
      let dir = await FileSystem.readDirectoryAsync(PATH.form_data);

      dir.forEach((val, index) => {
        // read json file
        FileSystem.readAsStringAsync(PATH.form_data+val).then(
          (xForm) =>{
            let tForm = JSON.parse(xForm)
            console.log(tForm.meta)
            let tmp = {
              "id": index,
              "file_name": val,
              "form_name": tForm.meta.name,
              "formID": tForm.meta.id,
              "version":  tForm.meta.version,
              "status":  tForm.meta.status,
              "uuid":  tForm.meta.uuid,
              "title":  tForm.meta.title,
            }
            files.push(tmp);
          }
        ).catch(
          (e) => {
            console.log(e)
            setError(true)
          }
          
        )  
      
      });
      setData(files)
      setLoading(false)
    }


    const handleRefresh = () => {
      setLoading(true); // Set refreshing to true to show the loading indicator
      _getFilesInDirectory();
      //fetchDataAndStore(language, setData, setLoading); // Fetch data when pulled down for refresh
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
              tmp_list = data
              tmp_list.slice(index, 1)
              setData(tmp_list)
              count++
            } 
          });

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
    if(item.status.toUpperCase() == "SENT"){
      return () => router.push({
        pathname: "../(form)/manageForm",
        params: {
          form_fn: item.file_name,
        }
      })
    }else if(item.status.toUpperCase() == "FINALIZED"){
      return () => confirmSubmission()
    }else{


      return () => router.push({
        pathname: "../(form)/newForm",
        params: {
          form_fn: item.file_name,
          new_form: "0",
        }
      })
    }
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
        <View style={{ flex: 1, backgroundColor: COLORS.backgroundColor}}>
          
            <Animated.View style={[styles.header, summaryBlockStyle ]}>
              <AntDesign name="database" size={50} color={COLORS.headerTextColor}  />
              <Text style={{fontSize: 30, color: COLORS.headerTextColor, paddingTop: 8,}}>Reported Data</Text>
            </Animated.View>

            <View style={styles.tab_header} >
              <Animated.Text style={[styles.title, titleBlockStyle]}> My Data </Animated.Text>
              <View style={{flexDirection: "row"}}>
                <Ionicons name="filter" size={20} color={COLORS.headerTextColor}/>
                <Ionicons name="search-outline" size={22} color={COLORS.headerTextColor}  style={{paddingHorizontal: 14}} />
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
              onRefresh={handleRefresh}
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

                <Link href="../(form)/listForms" style={styles.bs_item_wrp} asChild>
                  <Pressable> 
                    <View style={{flexDirection: "row"}}>
                      <MaterialCommunityIcons name="file-document-edit-outline" size={26} color={COLORS.fontColor} />
                      <Text style={styles.bs_item_element}>Fill New Form</Text>
                    </View>
                  </Pressable>
                </Link>

                <Link href="../(form)/listForms" style={styles.bs_item_wrp} asChild>
                  <Pressable> 
                    <View style={{flexDirection: "row"}}>
                      <MaterialCommunityIcons name="file-send-outline" size={26} color={COLORS.fontColor} />
                      <Text style={styles.bs_item_element}>Send Finalized Forms</Text>
                    </View>
                  </Pressable>
                </Link>

                <Link href="../(form)/deleteForms" style={styles.bs_item_wrp} asChild>
                  <Pressable> 
                    <View style={{flexDirection: "row"}}>
                      <MaterialCommunityIcons name="file-remove-outline" size={26} color={COLORS.fontColor} />
                      <Text style={styles.bs_item_element}>Delete Form</Text>
                    </View>
                  </Pressable>
                </Link>

                <Link href="../(form)/downloadForms" style={styles.bs_item_wrp}  asChild>
                  <Pressable>
                    <View style={{flexDirection: "row"}}>
                      <MaterialCommunityIcons name="file-download-outline" size={26} color={COLORS.fontColor} />
                      <Text style={styles.bs_item_element}>Download Form</Text>
                    </View>
                  </Pressable>
                </Link>

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
    paddingVertical: 10,
    color: COLORS.headerTextColor,
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
