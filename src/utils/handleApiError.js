import { Alert } from "react-native";
export default function handleApiError(error){
    if(typeof error === 'string'){
        Alert.alert('Error', error);
    }
    else if(error?.message){
        Alert.alert('Error', error.message);
    }
    else{
        Alert.alert('Error', 'Something Went Wrong. Please try again.');
    }
}