import { StyleSheet, Text, View } from 'react-native'

import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'

import { fetchChat } from '../../services/api';
import { URL } from '../../constants/global';
import axios from 'axios';



const InstanceChat = ({ route }) => {

  const { form_file_name } = route.params;
  const instanceID  = form_file_name

  const [messages, setMessages] = useState([])

  const onSend = useCallback((messages = []) => {

    const submitData = async (messages) => {
      try {
        const formData = new FormData()
        formData.append('message', messages[0].text)
        const response = await axios.post(URL.messages+'/form/'+instanceID, formData);
        return response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if(submitData(messages)){
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, messages),
      )
    }

  }, [])

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(URL.messages+'/form/'+instanceID);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

  }, [])

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: 5,
      }}
    />
  )
}

export default InstanceChat

