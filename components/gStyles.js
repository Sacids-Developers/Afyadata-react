import { StyleSheet, Platform, StatusBar } from 'react-native';
import {COLORS} from '../constants/colors';
export default StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: COLORS.primaryColor,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  }
});