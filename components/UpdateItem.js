
import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const UpdateItem = ({item}) => {
  return (
    <Link href={{
        pathname: "dynamicForm",
        params: {
          id: item.id,
        },
      }} asChild>
      <Pressable>
        <View style={{padding: 10,}}>
            <Text style={{fontSize: 20}}>{item.title} </Text>
        </View>
      </Pressable>
    </Link>
  )
}


export default UpdateItem

    