import { StyleSheet, Image, View } from 'react-native'
import React from 'react'

const Index = () => {
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image style={styles.logo} source={require('../../assets/images/splashScreen.png')} />
            </View>
        </View>
    )
}

export default Index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    logoContainer: {
        flex: 1,
    },
    logo: {
        height: '100%',
        width: '100%',
    },
})
