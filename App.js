import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import StackNavigator from './StackNavigator';

export default function App() {
  return (
    <>
    <StatusBar style="auto "/>
    <StackNavigator/>
    </>
      
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});