import { Text, View, input, TextInput, StyleSheet} from 'react-native'
import {Picker} from '@react-native-picker/picker';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { Input } from '@rneui/base';
import { Ionicons, AntDesign, MaterialIcons,MaterialCommunityIcons, Entypo} from '@expo/vector-icons';


export default function FormFields(props, index, update) {

    if(props.as === 'input'){
        return (
            <View style={styles.item_wrp} key={index}>
                <Text style={styles.item_label }> {props.label} </Text>
                <TextInput style={styles.input} placeholder={props.label} name={props.name} value={props.val} onChangeText={(e) => { update(index,e);}}/>
            </View>
        )
    }

    if(props.as === 'password'){
        return (
            <View style={styles.item_wrp} key={index}>
                <Text style={styles.item_label }> {props.label} </Text>
                <TextInput style={styles.input} placeholder={props.label} value={props.val} onChange={(e) => {update(index,e.nativeEvent.text)}}/>
            </View>
        )
    }

    if(props.as === 'email'){
        return (
            <View style={styles.item_wrp} key={index}>
                <Text style={styles.item_label }> {props.label} </Text>
                <TextInput style={styles.input} placeholder={props.label} value={props.val} onChangeText={text => update(index,text) }  />
            </View>
        )
    }

    if(props.as === "location"){
      return(
        <View style={styles.item_wrp} key={index}>
          <Text style={styles.item_label }>{props.label}</Text>
          
        </View>
      )
    }

    if(props.as === "image"){
      return(
        <View style={styles.item_wrp} key={index}>
          <Text style={styles.item_label }>{props.label} </Text>
          
        </View>
      )
    }

    if(props.as === "video"){
      return(
        <View style={styles.item_wrp} key={index}>
          <Text style={styles.item_label }>{props.label} </Text>

        </View>
      )
    }

    if(props.as === 'select2'){

        let options = props.options.map( (element, key) => <Picker.Item label={element.label} value={element.value} key={index+'_'+key} /> )
        return (
            <View style={styles.item_wrp} key={index}>
                <Text style={styles.item_label }> {props.label} </Text>
                <Picker
                    selectedValue={props.val}
                    mode="dropdown"
                    onValueChange={(itemValue, itemIndex) => update(index,itemValue)}>
                    {options}
                </Picker>
            </View>
        )
    }

    if(props.as === 'select1'){

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
                <Text style={styles.item_label }> {props.label} </Text>
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
                    onChange={(element) => update(index,element.value)}
                    renderLeftIcon={() => (
                        <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
                    )}
                    renderItem={renderItem}
                />
            </View>
        )

    }



    if(props.as === 'select'){
        return (
            <View style={styles.item_wrp} key={index}>
              <Text style={styles.item_label }> {props.label} </Text>
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
                onChange={(element) => update(index,element)}
                renderLeftIcon={() => ( <AntDesign style={styles.icon} color="black" name="Safety" size={20} /> )}
                selectedStyle={styles.selectedStyle}
              />
            </View>
          );

    }
};





const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    item_wrp: {
      paddingVertical: 5,
    },
    item_label:{
        fontSize: 18,
        paddingBottom: 3,
    },
    item_input: {
        fontSize: 18,
        borderWidth: 1,
        borderColor: "#CCC",
        paddingVertical: 3,
        
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },



    dropdown: {
        height: 50,
        backgroundColor: 'transparent',
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
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