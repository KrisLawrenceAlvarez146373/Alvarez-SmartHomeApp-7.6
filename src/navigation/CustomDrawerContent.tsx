import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import {
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';

import { Ionicons } from '@expo/vector-icons';

export default function CustomDrawerContent(props: any) {
    return (
        <DrawerContentScrollView
            {...props}
            contentContainerStyle={styles.container}
        >

            {/* Header */}
            <View style={styles.header}>

                <View style={styles.logoContainer}>
                    <Ionicons
                        name="hardware-chip-outline"
                        size={40}
                    />
                </View>

                <Text style={styles.title}>
                    IoT Home
                </Text>

                <Text style={styles.subtitle}>
                    Smart Environment
                </Text>

            </View>

            {/* Navigation Items */}
            <View style={styles.menu}>
                <DrawerItemList {...props} />
            </View>

        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    header: {
        padding: 20,
        alignItems: 'center',
    },

    logoContainer: {
        marginBottom: 10,
    },

    title: {
        fontSize: 22,
        fontWeight: 'bold',
    },

    subtitle: {
        fontSize: 13,
        marginTop: 4,
    },

    menu: {
        marginTop: 10,
    },

});