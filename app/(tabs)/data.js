

import { View, Text, StyleSheet, ActivityIndicator, Pressable, SafeAreaView, StatusBar, Dimensions, Touchable, Button, Alert, TextInput, FlatList, Platform } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'



import * as FileSystem from 'expo-file-system';

import { Link, router, useRouter } from 'expo-router'

import { Ionicons, AntDesign, MaterialIcons,MaterialCommunityIcons, Entypo} from '@expo/vector-icons';
import { Badge, FAB } from '@rneui/themed';
import BottomSheet from '@gorhom/bottom-sheet';
import { useMutation } from '@tanstack/react-query'

//import filter from 'lodash.filter';

 

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
import { set } from 'lodash';
import gStyles from '../../components/gStyles';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const data = () => {

    const [data, setData] = useState([])
    const [fulldata, setFulldata] = useState([])
    const [dataStats, setDataStats] = useState({})
    const [isLoading, setLoading] = useState(false)
    const [isError, setError] = useState(false)
    const [selectedItems, setSelectedItems] = useState([]);
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('');
    const [section, setSection] = useState('data')

    const [showSearch, setShowSearch] = useState(false)



    // Bottom Sheet
    //const bottomSheetRef = useRef();
    const bottomSheetRef = useRef(null);
    const finalized_bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['50%', '75%'], []);
    const handleSheetChanges = useCallback((index) => {
      //console.log('handleSheetChanges', index);
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
    console.log('selected',selectedItems,item.id)
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
    }
    
    if(item.status.toUpperCase() == "FINALIZED"){
      return confirmSubmission(item)
    }
    
    if(item.status.toUpperCase() == 'BLANK'){
      return router.push({
        pathname: "../(form)/newForm",
        params: {
          form_fn: item.file_name,
          new_form: 1,
        }
      })
    }

    return router.push({
      pathname: "../(form)/newForm",
      params: {
        form_fn: item.file_name,
        new_form: 1,
      }
    })
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
            setData(fulldata)
            filteredData = fulldata.filter(
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

  const renderFilters = () => {
    return (
      <>
        <View style={{flexDirection:"row",gap:10,paddingTop:10,paddingHorizontal:10}}>
          <Pressable style={[styles.filter_wrp,(filter == '') && styles.filter_wrp_on]} onPress={() => doFilter('')}>
            <Text style={styles.filter_text}>{fulldata.length}</Text>
            <Text style={styles.filter_text}>All</Text>
          </Pressable>
          <Pressable style={[styles.filter_wrp,(filter == 'draft') && styles.filter_wrp_on]} onPress={() => doFilter('draft')}>
            <Text style={styles.filter_text}>{getDataStats(fulldata,'draft')} Draft</Text>
          </Pressable>
          <Pressable style={[styles.filter_wrp,(filter == 'finalized') && styles.filter_wrp_on]} onPress={() => doFilter('finalized')}>
            <Text style={styles.filter_text}>{getDataStats(fulldata,'finalized')} Finalized</Text>
          </Pressable>
          <Pressable style={[styles.filter_wrp,(filter == 'sent') && styles.filter_wrp_on]} onPress={() => doFilter('sent')}>
            <Text style={styles.filter_text}>{getDataStats(fulldata,'sent')} Sent</Text>
          </Pressable>
        </View>
      </>
    )
  }

  const renderSearch = () => {
    if(showSearch){
      return (
        <View style={[styles.pageHeader,]}>
          <View style={{flexDirection:"row", gap: 15, alignItems: "center"}}>
            <AntDesign name="arrowleft" size={22} color="black" onPress={() => { (section == 'data') ? getDataFiles() : getBlankFiles()}}/>
            <View style={{borderColor: "#888", borderWidth: 1, borderRadius: 10, flex:1, paddingVertical:3, paddingHorizontal: 5, flexDirection: "row", alignItems: "center"}}>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                multiline={false}
                value={query}
                onChangeText={(queryText) => {
                  setQuery(queryText)
                  filteredData = fulldata.filter(
                    (item) => item.title.toLowerCase().includes(queryText.toLowerCase())
                  )
                  setData(filteredData)
                  //console.log('filter',data.length,queryText)
                }}
                placeholder="Search..."
                style={{fontSize: 18, paddingVertical: 2, paddingHorizontal:8, flex:1}}
                
              ></TextInput>
              {(data.length != fulldata.length) && <AntDesign name="close" size={18} color="black" onPress={() => {setQuery(''); setData(fulldata)}}/>}
            </View>
            <AntDesign name="delete" size={22} color="black" onPress={() => confirmDeletion()} /> 
          </View>
        </View>
      )        
    }
    if(selectedItems.length != 0){

      return (
        <View style={[styles.pageHeader]}>
           <View style={{flexDirection:"row", gap: 15, alignItems: "center"}}>
            <AntDesign name="arrowleft" size={22} color="black" onPress={
              () => {
                setData(fulldata)
                setQuery('')
                setSelectedItems([])
                setShowSearch(false)
              }
            }/>
            <Text style={{fontSize: 22, color: COLORS.primaryColor, fontWeight: 400}} >{selectedItems.length}</Text>
            {(selectedItems.length != data.length) ? 
                <Text style={{ borderWidth: 1, borderColor: "black", borderRadius: 5, paddingVertical: 4, paddingHorizontal:15}} onPress={() => selectAllItems()}>Select All</Text>
                : 
                <Text style={{ borderWidth: 1, borderColor: "black", borderRadius: 5, paddingVertical: 4, paddingHorizontal:15}} onPress={() => setSelectedItems([])}>Un Select</Text>
            }
          
          </View>
          <View style={{flexDirection: "row",alignItems: "center", gap: 15}}>
            { section == 'data' && <MaterialCommunityIcons name="pin" size={22} color="black" />}
            { section == 'data' && <MaterialCommunityIcons name="archive-arrow-down-outline" size={22} color="black" />}
            <AntDesign name="delete" size={22} color="black" onPress={() => confirmDeletion()} />          
            <Entypo name="dots-three-vertical" size={20} color="#000" onPress={() => handleBSOpenPress()} />
            </View>
        </View>
      )        
    }
    if(section == 'blank'){
      return (
        <View style={[styles.pageHeader,]}>
          <View style={{flexDirection:"row", gap: 15, alignItems: "center"}}>
            <AntDesign name="arrowleft" size={22} color="black" onPress={
              () => {
                getDataFiles()
              }
            }/>
            <Text style={{fontSize: 22, color: COLORS.primaryColor, fontWeight: 400}}>MLFData</Text>
          </View>
          <View style={{flexDirection: "row", gap: 15, alignItems: "center"}}>
            <MaterialIcons name="format-align-justify" size={24} color="black"  onPress={() => getDataFiles()} />
            <AntDesign name="download" size={22} color="#000"  onPress={() => router.push(href='../(form)/downloadForms') } /> 
            <Ionicons name="search-outline" size={22} color="#000" onPress={() => setShowSearch(true)}/>                 
            <Entypo name="dots-three-vertical" size={20} color="#000" onPress={() => handleBSOpenPress()} />
          </View>
        </View>
      )
    }

    return (
      <View style={[styles.pageHeader,{backgroundColor: COLORS.primaryColor}]}>
        <Text style={{fontSize: 22, color: COLORS.headerTextColor, fontWeight: 400}}>MLFData</Text>
        <View style={{flexDirection: "row", gap: 15, alignItems: "center"}}>
          <AntDesign name="form" size={22} color={COLORS.headerTextColor} onPress={() => getBlankFiles()} />
          <AntDesign name="download" size={22} color={COLORS.headerTextColor} onPress={() => router.push(href='../(form)/downloadForms') }/> 
          <Ionicons name="search-outline" size={22} color={COLORS.headerTextColor} onPress={() => setShowSearch(true)}/>                 
          <Entypo name="dots-three-vertical" size={20} color={COLORS.headerTextColor} onPress={() => handleBSOpenPress()} />
        </View>
      </View>
    )
    
  }

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
            const modificationTime = new Date(fileInfo.modificationTime);
            FileSystem.readAsStringAsync(dir_path+val).then(
              (xForm) =>{
                let tForm = JSON.parse(xForm)
                //console.log(val)

                let tmp = {
                  "id": index,
                  "file_name": val,
                  "form_name": tForm.meta.title,
                  "formID": tForm.meta.form_id,
                  "version":  tForm.meta.version,
                  "status":  ('status' in tForm.meta) ? tForm.meta.status : tForm.meta.title,
                  "uuid":  ('uuid' in tForm.meta) ? tForm.meta.uuid : val,
                  "title":  tForm.meta.title,
                  "updated_on":  modificationTime,
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

  const getDataFiles = () => {
    setSection('data')
    setQuery('')
    setSelectedItems([])
    setShowSearch(false)
    getFilesInDirectory(PATH.form_data)
  }

  const getBlankFiles = () => {
    setSection('blank')
    setQuery('')
    setSelectedItems([])
    setShowSearch(false)
    getFilesInDirectory(PATH.form_defn)
  }

  useEffect(() => {
    getDataFiles()
    //getFilesInDirectory(PATH.form_data)
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
    
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaView style={[gStyles.AndroidSafeArea, section != 'data' && {backgroundColor: COLORS.slate}]}>   
        {section == 'data' ? <ExpoStatusBar style="light" /> :  <ExpoStatusBar style="dark" />  }
        <View style={{ flex: 1, backgroundColor: COLORS.backgroundColor}}>
          
            {renderSearch()}
            {section == 'data' && renderFilters()}

            <FlatList
              data={data}
              scrollEventThrottle={16}
              renderItem={(item) => renderItem(item)}
              extraData={selectedItems}
              keyExtractor={(item) => item.file_name}
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
                getBlankFiles()}
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
    </GestureHandlerRootView>
    )
}



export default data

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },


  filter_wrp:{
    borderRadius: 20,
    paddingHorizontal:10,
    paddingVertical:7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.slate,
    gap: 2,
  },
  filter_wrp_on: {
    backgroundColor: COLORS.secondaryColor,
    color: "black",
  },

  filter_text:{
    color: "#666",
    textAlign: 'center',
    fontSize: 14,  
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


  AndroidSafeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  }



});
