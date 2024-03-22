import { StyleSheet, Text, View, Pressable, Alert } from 'react-native'
import React from 'react'
import { COLORS } from '../constants/colors';
import { router } from 'expo-router'

// confirm 
const confirmSubmission = () =>
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


const getLinkAction = (item) => {
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

const DataItem = ({item}) => {
  return (
    <Pressable onPress={getLinkAction(item)}>
      <View style={styles.item}>
        <View style={{flexDirection: "row"}}>
          <View style={{paddingLeft: 0,}}>
            <Text style={{fontSize: 15,color: "black" }}>{item.title} date </Text>
            <Text style={{fontSize: 12, color: "#aaa",}}>{item.uuid}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  )
}

export default DataItem

const styles = StyleSheet.create({


  item: {
    paddingVertical: 10,
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

})