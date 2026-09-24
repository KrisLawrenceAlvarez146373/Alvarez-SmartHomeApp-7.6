import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './src/navigation/DrawerNavigator';
import { IoTProvider } from './src/context/IoTContext';

export default function App() {
  return (
    <IoTProvider >
      <NavigationContainer>
        <DrawerNavigator />
      </NavigationContainer>
    </IoTProvider>

  );
}