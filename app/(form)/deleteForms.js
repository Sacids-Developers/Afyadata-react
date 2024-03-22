import { SafeAreaView, Text, View } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import { Stack } from 'expo-router'

import { useQuery } from '@tanstack/react-query';
import { getFilesInDirectory } from '../../services/files';
import { FlatList } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native';
import { PATH } from '../../constants/global';
import { FAB, CheckBox } from '@rneui/themed';



const deleteForms = () => {   


    const [formList, setFormList] = useState([])
    const [filesChosen, setFilesChosen] = useState(false)

    const {isPending, isError, data, error} = useQuery({ queryKey: ['listFormDefns3'], queryFn: () => getFilesInDirectory(PATH.form_defn) })
    
    if (isPending) {
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
        <Stack.Screen options={{title: 'Delete Forms'}} />
        <FlatList
            data={data}
            scrollEventThrottle={16}
            renderItem={({item}) => (<Item item={item} />)}
            keyExtractor={item => item.file_name}
        
        />
      </SafeAreaView>
    )
  
}

export default deleteForms