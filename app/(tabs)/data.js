

import { View, Text, StyleSheet, ActivityIndicator, Pressable, SafeAreaView,  Dimensions, Touchable, Button } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import * as FileSystem from 'expo-file-system';

import { fetchDataAndStore, retrieveStoredData } from '../../services/updates'
import { Link, router } from 'expo-router'

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

const HEADER_MAX_HEIGHT = Dimensions.get('window').height/2.6;
const HEADER_MIN_HEIGHT = 30;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

import {COLORS} from "../../constants/colors"

import { PATH } from '../../constants/global';


const data = () => {

    const [data, setData] = useState({})
    const [isLoading, setLoading] = useState(false)
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

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


    language = 'en'

    _getFilesInDirectory = async() => {
      
      let files = [];
      let dir = await FileSystem.readDirectoryAsync(PATH.form_data);

      dir.forEach((val) => {
        // read json file
        FileSystem.readAsStringAsync(PATH.form_data+val).then(
          (xForm) =>{
            let tForm = JSON.parse(xForm)
            console.log(tForm.meta.name)
            let tmp = {
              "file_name": val,
              "form_name": tForm.meta.name,
              "formID": tForm.meta.id,
              "version":  tForm.meta.version,
              "status":  tForm.meta.status,
              "uuid":  tForm.meta.uuid,
            }
            files.push(tmp);
          }
        ).catch(
          (e) => {console.log(e)}
        )  
      
      });
      console.log(files)
      setData(files)
      setLoading(false)

      ;
    }

    const Item = ({item}) => (
        <Pressable onPress={getLinkAction(item)}>
          <View style={styles.item}>
            <View style={{padding: 10,}}>
              <Text style={{fontSize: 18,color: "black"}}>{item.formID}</Text>
              <Text style={{fontSize: 16, color: "#444",}}>{item.form_name}</Text>
              <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <Text style={{fontSize: 12, color: getTextColor(item.status),}}>{item.status.toUpperCase()}</Text>
                <Text style={{fontSize: 14, color: "#aaa",}}> created on</Text>
              </View>
            </View>
          </View>
        </Pressable>
    );

    const getTextColor = (status) => {
      if(status.toUpperCase == "SENT") return COLORS.fontColor;
      else if(status.toUpperCase() == "FINALIZED") return "#346e43";
      else return "#94794a"
    }

    const getLinkAction = (item) => {
      if(item.status.toUpperCase() == "SENT"){
        return () => router.push({
          pathname: "../(form)/manageForm",
          params: {
            form_fn: item.file_name,
          }
        })
      }else if(item.status.toUpperCase() == "FINALIZED"){
        return () => finalized_bottomSheetRef.current?.snapToIndex(0)
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

    useEffect(() => {
      _getFilesInDirectory();
    }, []);

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
                <View style={{flexDirection: "row"}}>
                  <Ionicons name="search-outline" size={24} color={COLORS.fontColor} />
                  <MaterialCommunityIcons name="dots-vertical" size={23} color={COLORS.fontColor} onPress={() => handleBSOpenPress()} />
                </View>

              </View>
              
              <Animated.FlatList
                data={data}
                scrollEventThrottle={16}
                renderItem={({item}) => (
                    <Item item={item}></Item>
                )}
                keyExtractor={item => item.file_name}
                onScroll={onScroll}
                removeClippedSubviews
                contentContainerStyle={styles.list_container}
                style={styles.list}
                onRefresh={handleRefresh}
                refreshing={isLoading}
                
              />

              <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                backgroundStyle={{backgroundColor: "#ddd"}}
                enablePanDownToClose={true}
              >
                <View style={styles.bs_wrp}>

                  <Link href="../(form)/listForms" style={styles.bs_item_wrp} asChild>
                    <Pressable> 
                      <View style={{flexDirection: "row"}}>
                        <MaterialCommunityIcons name="file-document-edit-outline" size={26} color={COLORS.fontColor} />
                        <Text style={styles.bs_item_element}>Fill Blank Form</Text>
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

                  <Link href="../(form)/listForms" style={styles.bs_item_wrp} asChild>
                    <Pressable> 
                      <View style={{flexDirection: "row"}}>
                        <MaterialCommunityIcons name="file-remove-outline" size={26} color={COLORS.fontColor} />
                        <Text style={styles.bs_item_element}>Delete Empty Form</Text>
                      </View>
                    </Pressable>
                  </Link>

                  <Link href="../(form)/downloadForms" style={styles.bs_item_wrp}  asChild>
                    <Pressable>
                      <View style={{flexDirection: "row"}}>
                        <MaterialCommunityIcons name="file-download-outline" size={26} color={COLORS.fontColor} />
                        <Text style={styles.bs_item_element}>Download Empty Form</Text>
                      </View>
                    </Pressable>
                  </Link>

                  <Pressable onPress={() => bottomSheetRef.current?.close() } style={styles.bs_item_wrp} >
                    <View style={{flexDirection: "row"}}>
                      <MaterialCommunityIcons name="close-box-outline" size={26} color={COLORS.fontColor} />
                      <Text style={[styles.bs_item_element, styles.bs_item_cancel]}>CLOSE</Text>
                    </View>
                  </Pressable>


                </View>
              </BottomSheet>


              <BottomSheet
                ref={finalized_bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                backgroundStyle={{backgroundColor: "#ddd"}}
                enablePanDownToClose={true}
              >
                <View style={styles.bs_wrp}>

                  <Text style={{fontSize: 24, padding: 15, textAlign: "center"}}>Are you sure you want to submit the form to the server</Text>
                  <Pressable onPress={() => alert('sending forms now') } style={styles.bs_item_wrp} >
                    <View style={{flexDirection: "row"}}>
                      <MaterialCommunityIcons name="close-box-outline" size={26} color={COLORS.fontColor} />
                      <Text style={[styles.bs_item_element, styles.bs_item_cancel]}>Yes</Text>
                    </View>
                  </Pressable>
                  <Pressable onPress={() => finalized_bottomSheetRef.current?.close() } style={styles.bs_item_wrp} >
                    <View style={{flexDirection: "row"}}>
                      <MaterialCommunityIcons name="close-box-outline" size={26} color={COLORS.fontColor} />
                      <Text style={[styles.bs_item_element, styles.bs_item_cancel]}>No</Text>
                    </View>
                  </Pressable>

                </View>


              </BottomSheet>




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
