import { useState } from 'react';
import { Dimensions, Text, View, input, TextInput, StyleSheet, Button, Alert, Image, Pressable } from 'react-native'
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { Input, Slider } from '@rneui/base';
import { Ionicons, AntDesign, MaterialIcons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Camera, CameraType } from 'expo-camera';
import * as Location from 'expo-location'
import { COLORS } from '../constants/colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import Moment from 'moment';

import { Permissions } from 'expo';

export default function FormFields(props, index, update, formLang) {
  
  //const [image, setImage] = useState(null)
  //const [location, setLocation] = useState(null);

  //TODO: check for permission
  //const [permission, requestPermission] = Camera.useCameraPermissions();

  //capturing photo
  const getPhoto = async (source) => {

    try {
      // Ask the user for the permission to access the camera
      
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        alert("You've refused to allow this appp to access your camera!");
        return;
      }
      let cameraResp = null
      if(source == 'camera'){
         cameraResp = await ImagePicker.launchCameraAsync({
          allowsEditing: false,
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          quality: 1,
        });
      }else{
        cameraResp = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: false,
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          quality: 1,
        });
      }

      if (!cameraResp.canceled) {
        result = cameraResp.assets[0];
        update(index, {
          uri: result.uri,
          name: result.uri.substring(result.uri.lastIndexOf('/') + 1, result.uri.length),
          type: 'image/jpeg',
        });
      }
    } catch (e) {
      Alert.alert("Error Uploading Image " + e.message);
      console.log(e.message)
    }
  };

  //Record Video
  const recordVideo = async () => {

  };

  //capturing Location
  const getLocation = async () => {
    let {status} = await Location.requestForegroundPermissionsAsync();

    if(status !== 'granted'){
      console.log("Please grant location permission");
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});

    loc   = currentLocation.coords.longitude + ',' + currentLocation.coords.latitude + ',' + currentLocation.coords.accuracy
    update(index, loc);

  };
  
  const getDate = () => {

    DateTimePickerAndroid.open({
      value: props.val =='' ? new Date() : new Date(props.val),
      onChange,
      mode: 'date',
      is24Hour: true,
    });
  }

  const onChange = (event, selectedDate) => {
    update(index, selectedDate);
  };

  //returning view
  if (props.type === 'group') {

    // top label of the group 
    return (
      <View style={styles.item_wrp} key={index}>
        <Text style={styles.group_label}>{props['label'+formLang]}</Text>
        {props['hint'+formLang] != null && <Text style={styles.item_hint}>{props['hint'+formLang]}</Text>}
      </View>
    )
  }


  else if (props.type === 'integer') {

    return (
      <View style={styles.item_wrp} key={index}>
        <Text style={styles.item_label}>{props['label'+formLang]}</Text>
        {props['hint'+formLang] != null && <Text style={styles.item_hint}>{props['hint'+formLang]}</Text>}
        <TextInput
          inputMode="numeric"
          style={styles.input}
          name={props.name}
          value={props.val}
          onChangeText={(e) => { update(index, e); }}
        />
        {props.error && <Text style={styles.item_error}>{ props['constraint_message'+formLang]}</Text>}
      </View>
    )
  }


  else if (props.type === 'note') {

    // top label of the group 
    return (
      <View style={styles.item_wrp} key={index}>
        <Text style={styles.note_label}>{props['label'+formLang]}</Text>
        {props['hint'+formLang] != null && <Text style={styles.item_hint}>{props['hint'+formLang]}</Text>}
      </View>
    )
  }

  else if (props.type === 'text') {
    return (
      <View style={styles.item_wrp} key={index}>
        <Text style={styles.item_label}>{props['label'+formLang]}</Text>
        {props['hint'+formLang] != null && <Text style={styles.item_hint}>{props['hint'+formLang]}</Text>}
        <TextInput
          multiline={true}
          numberOfLines={5}
          //textAlignVertical={'top'}
          style={styles.input}
          //placeholder={props['label'+formLang]}
          name={props.name}
          value={props.val}
          onChangeText={(e) => { update(index, e); }}
        />
      {props.error && <Text style={styles.item_error}>{ props['constraint_message'+formLang] != null ? props['constraint_message'+formLang] : "Input Required"}</Text>}
      </View>
    )
  }

  else if (props.type === "geopoint") {
    return (
      <View style={styles.item_wrp} key={index}>
        <Text style={styles.item_label}>{props['label'+formLang]}</Text>
        {props['hint'+formLang] != null && <Text style={styles.item_hint}>{props['hint'+formLang]}</Text>}
        <Text style={styles.item_text}>{props.val =='' ? "No Location Specified" : props.val.toString()} </Text>
        <Pressable onPress={() => getLocation()} style={styles.button} >
            <Text style={styles.button_text}>{props.val =='' ? "Set Location" : "Change Location"}</Text> 
        </Pressable>
        {props.error && <Text style={styles.item_error}>{ props['constraint_message'+formLang] != null ? props['constraint_message'+formLang] : "Input Required"}</Text>}
      </View>
    )
  }


  else if (props.type === 'date') {

    //console.log('date string', props.val, typeof(props.val))
    //console.log(props)
    return (
      <View style={styles.item_wrp} key={index}>
        <Text style={styles.item_label}>{props['label'+formLang]}</Text>
        {props['hint'+formLang] != null && <Text style={styles.item_hint}>{props['hint'+formLang]}</Text>}
        <Text style={styles.item_text}>{props.val == '' ? "No Date Specified" : new Date(props.val).toDateString()} </Text>
        <Pressable onPress={() => getDate()} style={styles.button} >
            <Text style={styles.button_text}>Select Date</Text> 
        </Pressable>
        {props.error && <Text style={styles.item_error}>{ props['constraint_message'+formLang] != null ? props['constraint_message'+formLang] : "Input Required"}</Text>}
      </View>
    )
  }

  
  else if (props.type === "image") {
    return (
      <View style={styles.item_wrp} key={index}>
        <Text style={styles.item_label}>{props['label'+formLang]} </Text>
        {props['hint'+formLang] != null && <Text style={styles.item_hint}>{props['hint'+formLang]}</Text>}
        <View style={{flexDirection: "row", marginTop: 5, gap: 10}}>
          <Pressable onPress={() => getPhoto('camera')} style={styles.button} >
            <Text style={styles.button_text}>Take Photo</Text> 
          </Pressable>
          <Pressable onPress={() => getPhoto('gallery')} style={styles.button} >
            <Text style={styles.button_text}>Pick Image</Text> 
          </Pressable>
        </View>
        {props.val != '' && (
          <View style={{paddingVertical: 3}}><Image source={{ uri: props.val.uri }} style={styles.image} /></View>
        )}
      </View>
    )
  }

  //{image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}

  else if (props.type === "video") {
    return (
      <View style={styles.item_wrp} key={index}>
        <Text style={styles.item_label}>{props['label'+formLang]} </Text>
        {props['hint'+formLang] != null && <Text style={styles.item_hint}>{props['hint'+formLang]}</Text>}
        <Button title="Record Video" onPress={recordVideo} />
      </View>
    )
  }

  else if (props.type === 'password') {
    return (
      <View style={styles.item_wrp} key={index}>
        <Text style={styles.item_label}>{props['label'+formLang]}</Text>
        {props['hint'+formLang] != null && <Text style={styles.item_hint}>{props['hint'+formLang]}</Text>}
        <TextInput
          secureTextEntry={true}
          style={styles.input}
          placeholder={props['label'+formLang]}
          value={props.val}
          onChange={(e) => { update(index, e.nativeEvent.text) }}
        />
        {props.error && <Text style={styles.item_error}>{ props['constraint_message'+formLang]}</Text>}
      </View>
    )
  }

  else if (props.type === 'email') {
    return (
      <View style={styles.item_wrp} key={index}>
        <Text style={styles.item_label}>{props['label'+formLang]}</Text>
        {props['hint'+formLang] != null && <Text style={styles.item_hint}>{props['hint'+formLang]}</Text>}
        <TextInput
          inputMode="email"
          style={styles.input}
          placeholder={props['label'+formLang]}
          value={props.val}
          onChangeText={text => update(index, text)}
        />
        {props.error && <Text style={styles.item_error}>{ props['constraint_message'+formLang]}</Text>}
      </View>
    )
  }

  else if (props.type === 'range') {

    // get paramenters
    let p = props.parameters
    return (
      <View style={styles.item_wrp} key={index}>
        <Text style={styles.item_label}>{props['label'+formLang]}</Text>
        {props['hint'+formLang] != null && <Text style={styles.item_hint}>{props['hint'+formLang]}</Text>}
        <Slider
          value={props.val}
          onValueChange={text => update(index, text)}
          maximumValue={10}
          minimumValue={0}
          step={1}
          allowTouchTrack
        />
        {props.error && <Text style={styles.item_error}>{ props['constraint_message'+formLang]}</Text>}
      </View>
    )

  }

  

  else if (props.type === 'select_one') {

    if(props.options == null){
      return (<View key={index}><Text>Error in Form at {index}</Text></View>)
    }

    const renderItem = item => {
      return (
        <View style={styles.select_item_wrp}>
          <Text style={styles.select_item_text}>{item['label'+formLang]}</Text>
          {item.name === props.val && (
            <AntDesign
              style={styles.icon}
              color="black"
              name="Safety"
              size={20}
            />
          )}
        </View>
      );
    };

    return (
      <View style={styles.item_wrp} key={index}>
        <Text style={styles.item_label}>{props['label'+formLang]}</Text>
        {props['hint'+formLang] != null && <Text style={styles.item_hint}>{props['hint'+formLang]}</Text>}
        <Dropdown
          style={styles.input}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={props.options}
          search
          maxHeight={300}
          labelField={"label"+formLang}
          valueField="name"
          placeholder="Select item"
          searchPlaceholder="Search..."
          value={props.val}
          onChange={
            (element) => {
              update(index, element.name)
            }
          }
          renderLeftIcon={() => (
            <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
          )}
          renderItem={renderItem}
        />
        {props.error && <Text style={styles.item_error}>{ props['constraint_message'+formLang]}</Text>}
      </View>
    )

  }



  if (props.type === 'select' || props.type === 'select_multiple') {

    if(props.options == null){
      return (<View key={index}><Text>Error in Form at {index}</Text></View>)
    }


    return (
      <View style={styles.item_wrp} key={index}>
        <Text style={styles.item_label}>{props['label'+formLang]}</Text>
        {props['hint'+formLang] != null && <Text style={styles.item_hint}>{props['hint'+formLang]}</Text>}
        <MultiSelect
          style={styles.input}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          search
          data={props.options}
          labelField={'label'+formLang}
          valueField="name"
          placeholder="Select item"
          searchPlaceholder="Search..."
          value={props.val}
          onChange={(element) => update(index, element)}
          renderLeftIcon={() => (<AntDesign style={styles.icon} color="black" name="Safety" size={20} />)}
          selectedStyle={styles.selectedStyle}
        />
        {props.error && <Text style={styles.item_error}>{ props['constraint_message'+formLang]}</Text>}
      </View>
    );
  }

  else {
    return null

  //   return (
  //     <View style={styles.item_wrp} key={index}>
  //       <Text style={styles.item_label}>{props['label'+formLang]}</Text>
  //       {props['hint'+formLang] != null && <Text style={styles.item_hint}>{props['hint'+formLang]}</Text>}
  //       <TextInput style={styles.input} placeholder={props['label'+formLang]} name={props.name} value={props.val} onChangeText={(e) => { update(index, e); }} />
  //       {props.error && <Text style={styles.item_error}>{ props['constraint_message'+formLang]}</Text>}
  //     </View>
  //   )

  }
};





const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item_wrp: {
    paddingVertical: 7,
  },
  item_label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  item_hint: {
    fontSize: 14,
    fontStyle: "italic",
  },
  item_error: {
    fontSize: 14,
    fontStyle: "italic",
    color: COLORS.primaryColor,
  },
  item_text:{
    fontSize: 14,
    paddingVertical:3,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },

  group_label: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.fontColor,
  },


  note_label: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#444",
  },

  item_input: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    paddingVertical: 3,
  },
  input: {
    height: 40,
    marginVertical: 4,
    borderWidth: 1,
    fontSize: 18,
    borderColor: COLORS.borderColor,
    padding: 10,
  },

  btn: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    backgroundColor: COLORS.backgroundColor,
    padding: 10,
  },
  button:{
    paddingVertical: 8, 
    paddingHorizontal: 20, 
    borderRadius: 5,
    flex: 1,
    backgroundColor: COLORS.slate,
  },

  button_text:{
    color: "#000",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontSize: 16,
  },

  input: {
    height: 40,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    padding: 10, 
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  placeholderStyle: {
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  selectedStyle: {
    borderRadius: 12,
  },

  select_item_text: {
    paddingVertical: 4,
    paddingHorizontal:2,
    fontSize: 16,
  },
  select_item_wrp:{
    paddingVertical: 1,
  },

  image: {
    marginTop: 5,
    width: Dimensions.get('window').width, // Set the width to 80% of the screen width
    aspectRatio: 1, // Maintain the aspect ratio of the image
  },


});