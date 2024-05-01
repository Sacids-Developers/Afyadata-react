import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'


import * as FileSystem from 'expo-file-system';

import { Link, Stack, router, useNavigation } from 'expo-router'

import { AntDesign} from '@expo/vector-icons';
import { FAB } from '@rneui/themed';
import { SafeAreaView, ActivityIndicator, StyleSheet, Text, View, FlatList } from 'react-native'


import {COLORS} from "../../constants/colors"
import { PATH } from '../../constants/global';
import DataItem from '../../components/DataItem';
import { getFilesInDirectory } from '../../services/data';



const deleteForms = () => {   

    const [data, setData] = useState([])
    const [dataStats, setDataStats] = useState({})
    const [isLoading, setLoading] = useState(false)
    const [isError, setError] = useState(false)
    const [selectedItems, setSelectedItems] = useState([]);




    const renderItem = ({ item }) => (
      <DataItem
        item={item}
        onPress={() => handlePress(item)}
        onLongPress={() => selectItems(item)}
        isSelected={selectedItems.includes(item.id)}
      />
    );

    const handleRefresh = () => {
      getFilesInDirectory(PATH.form_data,setData,setLoading,setError);
    };
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

      // delete item
  
    }

    useEffect( () =>{
      getFilesInDirectory(PATH.form_defn,setData,setLoading,setError);
    })


    if (isLoading) {
        return (
            <SafeAreaView style={{ flex: 1,}}>
                <ActivityIndicator  size="large" color="#0000ff" />
            </SafeAreaView>)
    }

    if (isError) {
        return (
            <SafeAreaView style={{ flex: 1,}}>
                <Text>Error: </Text>
            </SafeAreaView>)
    }

    const Item = ({item}) => (

        <View style={styles.item}>
          <CheckBox
            title={item.name + ' : '+ item.formID}
            checked={item.checked}
            checkedColor={COLORS.fontColor}
            onPress={() => {
              const items = [...formList] // <-- shallow copy to show we're not mutating state
              const currentItemIndex = items.findIndex(v => v.id === item.id) // <-- lookup by something unique on the item like an ID. It's better to lookup rather than assume the array indexes are ordered the same.
              items[currentItemIndex].checked = !items[currentItemIndex].checked
              setData(items);
              handleCheck();
    
            }}
          />
        </View>
    
    );


  const handleCheck = () => {

    setFilesChosen(false)
    formList.forEach((item) => {
      if(item.checked){
        setFilesChosen(true)
      }
    })

  }
    
    return (
      <SafeAreaView>
        
        <Stack.Screen 
          options={{title: 'Delete Forms'}} 
        />
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
            router.push(href='../(form)/listForms')}
          }
        />

      </SafeAreaView>
    )
  
}

export default deleteForms

const styles = StyleSheet.create({
  container: {
    flex: 1,
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






});
