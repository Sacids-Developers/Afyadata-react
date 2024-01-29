import { useState } from 'react';
import { Text, View, input, TextInput, StyleSheet } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { Input, Slider } from '@rneui/base';
import { Ionicons, AntDesign, MaterialIcons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';


export default function FormFields(props, index, update) {
  const [image, setImage] = useState(null)
  const [location, setLocation] = useState(null);

  //TODO: check for permission


  //take photo
  const takePhoto = async () => {
    try {
      const cameraResp = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
      });

      if (!cameraResp.canceled) {
        const { uri } = cameraResp.assets[0];
        const fileName = uri.split("/").pop();

        //TODO: save image for background uploading


      }
    } catch (e) {
      Alert.alert("Error Uploading Image " + e.message);
    }
  };

  //capturing Location
  const getLocation = async () => {
    const userLocation = await Location.getCurrentPositionAsync();

    //TODO: save location parameters


    return userLocation.coords;
  };




  //returning view
  if (props.type === 'group') {

    // top label of the group 
    return (
      <View style={styles.item_wrp} key={index}>
        <Text style={styles.group_label}>{props.label}</Text>
      </View>
    )
  }
  else if (props.type === 'integer') {
    return (
      <View style={styles.item_wrp} key={index}>
        <Text style={styles.item_label}>{props.label}</Text>
        <Text style={styles.item_hint}>{props.hint}</Text>
        <TextInput
          inputMode="numeric"
          style={styles.input}
          //placeholder={props.label} 
          name={props.name}
          value={props.val}
          onChangeText={(e) => { update(index, e); }}
        />
      </View>
    )
  }

  else if (props.type === 'note') {

    // top label of the group 
    return (
      <View style={styles.item_wrp} key={index}>
        <Text style={styles.note_label}>{props.label}</Text>
      </View>
    )
  }


  else if (props.type === 'text') {
    return (
      <View style={styles.item_wrp} key={index}>
        <Text style={styles.item_label}>{props.label}</Text>
        <Text style={styles.item_hint}>{props.hint}</Text>
        <TextInput
          multiline={true}
          numberOfLines={5}
          //textAlignVertical={'top'}
          style={styles.input}
          placeholder={props.label}
          name={props.name}
          value={props.val}
          onChangeText={(e) => { update(index, e); }}
        />
      </View>
    )
  }

  if (props.as === "location") {
    return (
      <View style={styles.item_wrp} key={index}>
        <Text style={styles.item_label}>{props.label}</Text>
        <Button title="Get Location" onPress={getLocation} />
      </View>
    )
  }

  if (props.as === "image") {
    return (
      <View style={styles.item_wrp} key={index}>
        <Text style={styles.item_label}>{props.label} </Text>
        <Button title="Pick Image" onPress={takePhoto} />
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      </View>
    )
  }

  if (props.as === "video") {
    return (
      <View style={styles.item_wrp} key={index}>
        <Text style={styles.item_label}>{props.label} </Text>

      </View>
    )
  }

  else if (props.type === 'password') {
    return (
      <View style={styles.item_wrp} key={index}>
        <Text style={styles.item_label}>{props.label}</Text>
        <Text style={styles.item_hint}>{props.hint}</Text>
        <TextInput
          secureTextEntry={true}
          style={styles.input}
          placeholder={props.label}
          value={props.val}
          onChange={(e) => { update(index, e.nativeEvent.text) }}
        />
      </View>
    )
  }

  else if (props.type === 'email') {
    return (
      <View style={styles.item_wrp} key={index}>
        <Text style={styles.item_label}>{props.label}</Text>
        <Text style={styles.item_hint}>{props.hint}</Text>
        <TextInput
          inputMode="email"
          style={styles.input}
          placeholder={props.label}
          value={props.val}
          onChangeText={text => update(index, text)}
        />
      </View>
    )
  }



  else if (props.type === 'range') {

    // get paramenters
    let p = props.parameters
    return (
      <View style={styles.item_wrp} key={index}>
        <Text style={styles.item_label}>{props.label}</Text>
        <Text style={styles.item_hint}>{props.hint}</Text>
        <Slider
          value={props.val}
          onValueChange={text => update(index, text)}
          maximumValue={10}
          minimumValue={0}
          step={1}
          allowTouchTrack
        />
      </View>
    )

  }


  else if (props.type === 'select_one') {

    const renderItem = item => {
      return (
        <View style={styles.item}>
          <Text style={styles.textItem}>{item.label}</Text>
          {item.value === props.val && (
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
        <Text style={styles.item_label}>{props.label}</Text>
        <Text style={styles.item_hint}>{props.hint}</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={props.options}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select item"
          searchPlaceholder="Search..."
          value={props.val}
          onChange={(element) => update(index, element.value)}
          renderLeftIcon={() => (
            <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
          )}
          renderItem={renderItem}
        />
      </View>
    )

  }



  if (props.as === 'select') {


    return (
      <View style={styles.item_wrp} key={index}>
        <Text style={styles.item_label}>{props.label}</Text>
        <Text style={styles.item_hint}>{props.hint}</Text>
        <MultiSelect
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          search
          data={props.options}
          labelField="label"
          valueField="value"
          placeholder="Select item"
          searchPlaceholder="Search..."
          value={props.val}
          onChange={(element) => update(index, element)}
          renderLeftIcon={() => (<AntDesign style={styles.icon} color="black" name="Safety" size={20} />)}
          selectedStyle={styles.selectedStyle}
        />
      </View>
    );
  }

  else {

    return (
      <View style={styles.item_wrp} key={index}>
        <Text style={styles.item_label}>{props.label}</Text>
        <Text style={styles.item_label}>{props.hint}</Text>
        <TextInput style={styles.input} placeholder={props.label} name={props.name} value={props.val} onChangeText={(e) => { update(index, e); }} />
      </View>
    )

  }
};





const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item_wrp: {
    paddingVertical: 5,
  },
  item_label: {
    fontSize: 18,
  },
  item_hint: {
    fontSize: 15,
    fontStyle: "italic",
  },

  group_label: {
    fontSize: 18,
    color: "maroon",
  },


  note_label: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#444",
  },

  item_input: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: "gray",
    paddingVertical: 3,

  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
  },



  dropdown: {
    height: 40,
    backgroundColor: 'transparent',
    borderColor: 'gray',
    margin: 12,
    padding: 2,
    borderWidth: 1,
  },
  placeholderStyle: {
    fontSize: 16,
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



});