import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Octicons from 'react-native-vector-icons/Octicons';

const Index = () => {

    const languages = [
        // 'ଓଡ଼ିଆ',
        // 'English',
        // 'हिन्दी',
        // 'मराठी',
        // 'ગુજરાતી',
        // 'தமிழ்',
        // 'ਪੰਜਾਬੀ',
        // 'తెలుగు',
        // 'বাংলা',
        // 'ಕನ್ನಡ',
        // 'മലയാളം',
        'English',
        'ଓଡ଼ିଆ Odia',
        // 'हिन्दी Hindi',
        // 'मराठी Marathi',
        // 'ગુજરાતી Gujarati',
        // 'தமிழ் Tamil',
        // 'ਪੰਜਾਬੀ Punjabi',
        // 'తెలుగు Telugu',
        // 'বাংলা Bangla',
        // 'ಕನ್ನಡ Kannada',
        // 'മലയാളം Malayalam'
    ];

    const navigation = useNavigation();
    const [selectedLanguage, setSelectedLanguage] = useState('English');

    const handleLanguageSelect = async (language) => {
        setSelectedLanguage(language);
        console.log("language", language);
        await AsyncStorage.setItem('selectedLanguage', language);
        if (language === 'ଓଡ଼ିଆ Odia') {
            navigation.navigate('OdiaHomePage');
        } else if (language === 'English') {
            navigation.navigate('Home');
        }
    };

    useEffect(() => {
        const fetchLanguage = async () => {
            try {
                const language = await AsyncStorage.getItem('selectedLanguage');
                if (language) {
                    setSelectedLanguage(language);
                }
            } catch (error) {
                console.error('Error checking selected language:', error);
            }
        };

        fetchLanguage();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.headerPart}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 3, marginLeft: 10 }}>Language</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.imageContainer}>
                <Image source={require('../../assets/images/ratha.jpeg')} style={styles.iamge} />
            </View>
            <View style={{ backgroundColor: '#FFBE00', flex: 1, justifyContent: 'center' }}>
                <View style={styles.languageContainer}>
                    {languages.map((language, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.languageButton,
                                selectedLanguage === language && styles.selectedLanguageButton,
                            ]}
                            onPress={() => handleLanguageSelect(language)}
                            activeOpacity={0.8}
                        >
                            <Text style={[
                                styles.languageButtonText,
                                selectedLanguage === language && styles.selectedLanguageButtonText,
                            ]}>{language}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    )
}

export default Index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#FFBE00',
    },
    headerPart: {
        width: '100%',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#B7070A',
        paddingVertical: 13,
        paddingHorizontal: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 13,
        elevation: 5
    },
    imageContainer: {
        backgroundColor: '#FFBE00',
        height: 300,
        width: '100%'
    },
    iamge: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    languageContainer: {
        // width: '90%',
        alignSelf: 'center',
        // flexDirection: 'row',
        // flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20,
    },
    languageButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        margin: 5,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    selectedLanguageButton: {
        backgroundColor: '#B7070A',
    },
    languageButtonText: {
        fontSize: 20,
        textAlign: 'center',
        color: '#333',
    },
    selectedLanguageButtonText: {
        color: '#fff',
    },
    continueButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginHorizontal: 10,
        borderRadius: 10,
        backgroundColor: '#B7070A',
    },
    continueButtonText: {
        fontSize: 17,
        fontWeight: '600',
        textAlign: 'center',
        color: '#fff',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
})
