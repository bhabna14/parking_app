import { SafeAreaView, ScrollView, StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Alert, Animated, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Linking } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Octicons from 'react-native-vector-icons/Octicons';

import moment from 'moment';

const Index = (props) => {

    const vvipData = [
        {
            id: 1,
            parking_name: 'ଗଙ୍ଗାଧର ଉଚ୍ଚ ବିଦ୍ୟାଳୟ',
            parking_address: 'ଗଙ୍ଗାଧର ଉଚ୍ଚ ବିଦ୍ୟାଳୟ , ପୁରୀ, ଓଡ଼ିଶା - ୭୫୨୦୦୧',
            parking_photo_url: require('../../assets/images/gadhadarhs.png'),
            map_url: 'https://maps.app.goo.gl/HFmFrzQHVSNBAzhp6'
        },
        {
            id: 2,
            parking_name: 'ବାରବାଟୀ କଲ୍ୟାଣୀ ମଣ୍ଡପ',
            parking_address: 'ବାରବାଟୀ କଲ୍ୟାଣୀ ମଣ୍ଡପ, ଲୋକନାଥ ମନ୍ଦିର ରାସ୍ତାରେ, ପୁରୀ, ଓଡ଼ିଶା - ୭୫୨୦୦୧',
            parking_photo_url: require('../../assets/images/barabatikalayanmandap.png'),
            map_url: 'https://maps.app.goo.gl/vH465ENw5tS48ZB49'
        },
        {
            id: 3,
            parking_name: 'ଲୋକନାଥ ମନ୍ଦିର ପାର୍କିଂ',
            parking_address: 'ଲୋକନାଥ ମନ୍ଦିର ପାର୍କିଂ, ଲୋକନାଥ ମନ୍ଦିର ରାସ୍ତାରେ, ପୁରୀ, ଓଡ଼ିଶା - ୭୫୨୦୦୧',
            parking_photo_url: require('../../assets/images/lokanathtempleparking.png'),
            map_url: 'https://maps.app.goo.gl/HUVPZtz6bXJAH2Fb6'
        },
    ];

    const navigation = useNavigation();
    const [refreshing, setRefreshing] = React.useState(false);
    const [spinner, setSpinner] = useState(false);
    const [activeTab, setActiveTab] = useState('fourWheeler');
    const [fourWheelerData, setFourWheelerData] = useState([]);
    const [twoWheelerData, setTwoWheelerData] = useState([]);
    const [liveDarshanData, setLiveDarshanData] = useState([]);
    const [currentNeeti, setCurrentNeeti] = useState({});
    const [notices, setNotices] = useState({});
    const opacity = useRef(new Animated.Value(1)).current;

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
            getAllData();
            console.log("Refreshing Successful");
        }, 2000);
    }, []);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]),
        ).start();
    }, [opacity]);

    const openUrl = (url) => {
        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    return Linking.openURL(url);
                } else {
                    Alert.alert('Error', 'Unable to open URL');
                }
            })
            .catch((err) => console.error('An error occurred', err));
    };

    const getAllData = async () => {
        try {
            setSpinner(true);
            const response = await fetch('http://panji.mandirparikrama.com/api/parking-app', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            const responseData = await response.json();
            if (responseData.status === 200) {
                setSpinner(false);
                const parkingData = responseData.data_odia.parkings_odia;
                const fourWheelerData = parkingData.filter(item => item.vehicle_type === 'four_wheeler');
                const twoWheelerData = parkingData.filter(item => item.vehicle_type === 'two_wheeler');
                setFourWheelerData(fourWheelerData);
                setTwoWheelerData(twoWheelerData);
                setLiveDarshanData(responseData.data_odia.youtube_urls);
                setNotices(responseData.data_odia.notices_odia);
                setCurrentNeeti(responseData.data_odia.current_niti_odia);
            } else {
                setSpinner(false);
                console.log('Unexpected response status:', responseData.status);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            Alert.alert('Error', 'Failed to fetch data from API');
            setSpinner(false);
        }
    };

    useEffect(() => {
        // const interval = setInterval(() => {
        //     getAllData();
        // }, 300000);

        // Call getAllData initially
        getAllData();

        // Cleanup interval on component unmount
        // return () => clearInterval(interval);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerPart}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={{ marginRight: 5 }}>
                        <Octicons name="three-bars" color={'#fff'} size={25} />
                    </TouchableOpacity>
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600', marginLeft: 10 }}>ରଥ ଯାତ୍ରା</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Entypo name="language" color={'#fff'} size={25} />
                    {/* <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500', marginLeft: 10, letterSpacing: 1 }}>Odia</Text> */}
                </TouchableOpacity>
            </View>
            <View style={{ backgroundColor: '#FFBE00', height: 230, width: '100%' }}>
                <Image source={require('../../assets/images/3rathas.jpg')} style={{ width: '100%', height: '100%', resizeMode: 'cover', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }} />
            </View>
            {/* {notices.notice &&
                <View style={{ backgroundColor: '#B7070A', width: '100%', paddingVertical: 10 }}>
                    <Animated.Text style={[styles.neonText, { opacity }]}>
                        {notices.notice}
                    </Animated.Text>
                </View>
            } */}
            {spinner === true ?
                <View style={{ width: '100%', height: '100%', alignSelf: 'center', backgroundColor: 'FFC500', paddingTop: 150 }}>
                    <ActivityIndicator size={30} color="#fff" />
                    <Text style={{ color: '#fff', fontSize: 19, fontWeight: '600', textAlign: 'center' }}>Loading...</Text>
                </View>
                :
                <View style={styles.bodyPart}>
                    <ScrollView style={{ flex: 1, width: '100%' }} refreshControl={< RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                        {/* {currentNeeti &&
                            <View style={{ backgroundColor: '#B7070A', width: '95%', alignSelf: 'center', marginTop: 15, marginBottom: 5, borderRadius: 10, paddingVertical: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, shadowRadius: 13, elevation: 5 }}>
                                <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 3 }}>{currentNeeti.niti_name}</Text>
                                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center' }}>ଆରମ୍ଭ ସମୟ: {moment(currentNeeti.start_time).format('HH:mm A')}</Text>
                            </View>
                        } */}
                        <View style={styles.parkingTitle}>
                            <Entypo name="location" color={'#fff'} size={22} />
                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 5 }}>ପାର୍କିଂ ସ୍ଥାନ</Text>
                        </View>
                        <View style={{ backgroundColor: '#FFC500', width: '95%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <TouchableOpacity style={{ backgroundColor: '#fcd544', borderRadius: 5, alignItems: 'center', padding: 10, shadowColor: '#000', shadowOffset: { width: 2, height: 3 }, shadowOpacity: 1, shadowRadius: 13, elevation: 2 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ color: '#B7070A', fontSize: 16, fontWeight: 'bold', marginRight: 6 }}>ଭି.ଭି.ଆଇ.ପି. ଏବଂ କାର ପାସ୍ ଧାରୀ ପାର୍କିଂ</Text>
                                    <MaterialCommunityIcons name="car" color={'#B7070A'} size={26} />
                                </View>
                                <View style={{ backgroundColor: '#B7070A', width: '100%', height: 2, marginTop: 5 }} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: '95%', alignSelf: 'center', marginTop: 10 }}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                scrollEnabled={false}
                                data={vvipData}
                                numColumns={2}
                                keyExtractor={(key) => key.id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => openUrl(item.map_url)} style={styles.itemContainer}>
                                        <View style={styles.imageContainer}>
                                            <Image source={item.parking_photo_url} style={styles.image} />
                                        </View>
                                        <View style={styles.textContainer}>
                                            <Text style={styles.itemTitle}>{item.parking_name}</Text>
                                            <Text style={styles.itemSubtitle}>{item.parking_address}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                        <View style={{ backgroundColor: '#FFC500', width: '95%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => setActiveTab('fourWheeler')} style={{ width: '49%', backgroundColor: '#fcd544', borderRadius: 5, alignItems: 'center', padding: 10, shadowColor: '#000', shadowOffset: { width: 2, height: 3 }, shadowOpacity: 1, shadowRadius: 13, elevation: activeTab === 'fourWheeler' ? 2 : 0 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ color: activeTab === 'fourWheeler' ? '#B7070A' : '#444545', fontSize: activeTab === 'fourWheeler' ? 16 : 15, fontWeight: 'bold', marginRight: 6 }}>ଚାରି ଚକିଆ ବାହନ</Text>
                                    <MaterialCommunityIcons name="car" color={activeTab === 'fourWheeler' ? '#B7070A' : '#444545'} size={26} />
                                </View>
                                <View style={{ backgroundColor: activeTab === 'fourWheeler' ? '#B7070A' : '#444545', width: '100%', height: activeTab === 'fourWheeler' ? 2 : 1, marginTop: 5 }} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setActiveTab('twoWheeler')} style={{ width: '49%', backgroundColor: '#fcd544', borderRadius: 5, alignItems: 'center', padding: 10, shadowColor: '#000', shadowOffset: { width: 2, height: 3 }, shadowOpacity: 1, shadowRadius: 13, elevation: activeTab === 'twoWheeler' ? 2 : 0 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ color: activeTab === 'twoWheeler' ? '#B7070A' : '#444545', fontSize: activeTab === 'twoWheeler' ? 16 : 15, fontWeight: 'bold', marginRight: 6 }}>ଦୁଇ ଚକିଆ ବାହନ</Text>
                                    <MaterialCommunityIcons name="bike" color={activeTab === 'twoWheeler' ? '#B7070A' : '#444545'} size={26} />
                                </View>
                                <View style={{ backgroundColor: activeTab === 'twoWheeler' ? '#B7070A' : '#444545', width: '100%', height: activeTab === 'twoWheeler' ? 2 : 1, marginTop: 5 }} />
                            </TouchableOpacity>
                        </View>
                        {activeTab === 'fourWheeler' ?
                            <View style={{ width: '95%', alignSelf: 'center', marginTop: 10 }}>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    scrollEnabled={false}
                                    data={fourWheelerData}
                                    numColumns={2}
                                    keyExtractor={(key) => key.id.toString()}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity onPress={() => openUrl(item.map_url)} style={styles.itemContainer}>
                                            <View style={styles.imageContainer}>
                                                <Image source={{ uri: item.parking_photo_url }} style={styles.image} />
                                                {/* <View style={{ position: 'absolute', top: 8, right: 10, backgroundColor: '#28a745', borderRadius: 6, flexDirection: 'row', paddingVertical: 2, paddingHorizontal: 4 }}>
                                                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>{item.parking_availability}</Text>
                                                </View> */}
                                            </View>
                                            <View style={styles.textContainer}>
                                                <Text style={styles.itemTitle}>{item.parking_name}</Text>
                                                <Text style={styles.itemSubtitle}>{item.parking_address}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                            :
                            <View style={{ width: '95%', alignSelf: 'center', marginTop: 10 }}>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    scrollEnabled={false}
                                    data={twoWheelerData}
                                    numColumns={2}
                                    keyExtractor={(key) => key.id.toString()}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity onPress={() => openUrl(item.map_url)} style={styles.itemContainer}>
                                            <View style={styles.imageContainer}>
                                                <Image source={{ uri: item.parking_photo_url }} style={styles.image} />
                                                {/* <View style={{ position: 'absolute', top: 8, right: 10, backgroundColor: '#28a745', borderRadius: 6, flexDirection: 'row', paddingVertical: 2, paddingHorizontal: 4 }}>
                                                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>{item.parking_availability}</Text>
                                                </View> */}
                                            </View>
                                            <View style={styles.textContainer}>
                                                <Text style={styles.itemTitle}>{item.parking_name}</Text>
                                                <Text style={styles.itemSubtitle}>{item.parking_address}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        }
                        <View style={{ width: '95%', alignSelf: 'center', marginBottom: 10 }}>
                            <Text style={{ color: '#000', fontSize: 20, fontWeight: 'bold', marginBottom: 5, marginLeft: 5 }}>ସିଧା ପ୍ରସାରଣ :</Text>
                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                horizontal
                                data={liveDarshanData}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <View style={styles.iframeSection}>
                                        <YoutubePlayer
                                            height={'100%'}
                                            width={'100%'}
                                            play={false}
                                            videoId={item.youtube_url}
                                        />
                                    </View>
                                )}
                            />
                        </View>
                    </ScrollView>
                </View>
            }
        </SafeAreaView>
    );
};

export default Index;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerPart: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#B7070A',
        paddingVertical: 13,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 13,
        elevation: 5,
    },
    neonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 255, 255, 0.75)', // neon color
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    bodyPart: {
        flex: 1,
        backgroundColor: '#FFC500',
    },
    imageContainer: {
        width: '100%',
        height: 120,
    },
    image: {
        width: '100%',
        height: '100%',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
    textContainer: {
        padding: 10,
        width: '96%',
        alignSelf: 'center',
        alignItems: 'flex-start',
    },
    itemContainer: {
        width: '48%',
        marginHorizontal: 3,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 13,
        elevation: 5,
        marginBottom: 20,
    },
    itemTitle: {
        color: '#000',
        fontSize: 15,
        fontWeight: 'bold',
    },
    itemSubtitle: {
        color: '#000',
        fontSize: 13,
        fontWeight: '300',
        textTransform: 'capitalize'
    },
    iframeSection: {
        width: 300,
        height: 180,
        padding: 10,
        alignItems: 'center',
        marginHorizontal: 5,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 13,
        elevation: 5,
        marginVertical: 6,
    },
    parkingTitle: {
        backgroundColor: '#B7070A',
        marginVertical: 10,
        paddingLeft: 20,
        paddingVertical: 10,
        width: 130,
        borderTopRightRadius: 20,
        borderBottomEndRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 13,
        elevation: 5
    }
});
