import { Dimensions } from "react-native";

export const HEADER_MAX_HEIGHT = Dimensions.get('window').height/2.6;
export const HEADER_MIN_HEIGHT = 0;
export const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

