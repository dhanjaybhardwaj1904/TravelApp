import React, { useEffect } from 'react';
import {
    SafeAreaView, ScrollView, StatusBar, StyleSheet, View, Text, RefreshControl, 
    TextInput, ImageBackground, FlatList, Dimensions, TouchableOpacity, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../const/colors';
import { FAB } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';

const { width } = Dimensions.get('screen');

export default function HomeScreen({ navigation }) {

    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    }

    const dispatch = useDispatch()
    const { data, loading } = useSelector((state) => {
        return state
    })

    const fetchData = () => {
        fetch("https://empty-eel-20.loca.lt/")
            .then(res => res.json())
            .then(results => {
                dispatch({ type: "ADD_DATA", payload: results })
                dispatch({ type: "SET_LOADING", payload: false })
                setRefreshing(false);

            }).catch(err => {
                Alert.alert("someting went wrong")
            })
    }

    useEffect(() => {
        fetchData()
    }, [])

    const categoryIcons = [
        <Icon name="flight" size={25} color={COLORS.primary} />,
        <Icon name="beach-access" size={25} color={COLORS.primary} />,
        <Icon name="near-me" size={25} color={COLORS.primary} />,
        <Icon name="place" size={25} color={COLORS.primary} />,
    ];

    const ListCategories = () => {
        return (
            <View style={style.categoryContainer}>
                {categoryIcons.map((icon, index) => (
                    <View key={index} style={style.iconContainer}>
                        {icon}
                    </View>
                ))}
            </View>
        );
    };

    const Card = ({ place }) => {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate('DetailsScreen', place)}>
                <ImageBackground style={style.cardImage} source={{uri: place.image}}>
                    <Text style={{ color: COLORS.white, fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>{place.name}</Text>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            alignItems: 'flex-end',
                        }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Icon name="place" size={20} color={COLORS.white} />
                            <Text style={{ marginLeft: 5, color: COLORS.white }}>
                                {place.location}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Icon name="star" size={20} color={COLORS.white} />
                            <Text style={{ marginLeft: 5, color: COLORS.white }}>5.0</Text>
                        </View>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        );
    };

    const RecommendedCard = ({ place }) => {
        return (
            <ImageBackground style={style.rmCardImage} source={{uri: place.image}}>
                <Text style={{ color: COLORS.white, fontSize: 22, fontWeight: 'bold', marginTop: 10, }}>{place.name}</Text>
                <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <View style={{ width: '100%', flexDirection: 'row', marginTop: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Icon name="place" size={22} color={COLORS.white} />
                            <Text style={{ color: COLORS.white, marginLeft: 5 }}>
                                {place.location}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Icon name="star" size={22} color={COLORS.white} />
                            <Text style={{ color: COLORS.white, marginLeft: 5 }}>5.0</Text>
                        </View>
                    </View>
                    <Text style={{ color: COLORS.white, fontSize: 13 }}>
                        {place.details}
                    </Text>
                </View>
            </ImageBackground>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <StatusBar translucent={false} backgroundColor={COLORS.primary} />
            <View style={style.header}>
                <Icon name="sort" size={28} color={COLORS.white} />
                <Icon name="notifications-none" size={28} color={COLORS.white} />
            </View>
            <ScrollView 
                showsVerticalScrollIndicator={false} 
                refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }>
                <View
                    style={{
                        backgroundColor: COLORS.primary,
                        height: 120,
                        paddingHorizontal: 20,
                    }}>
                    <View style={{ flex: 1 }}>
                        <Text style={style.headerTitle}>Explore the</Text>
                        <Text style={style.headerTitle}>beautiful places</Text>
                        <View style={style.inputContainer}>
                            <Icon name="search" size={28} />
                            <TextInput placeholder="Search place" style={{ color: COLORS.grey }} />
                        </View>
                    </View>
                </View>
                <ListCategories />
                <Text style={style.sectionTitle}>Places</Text>
                <View>
                    <FlatList
                        keyExtractor={item => item._id}
                        onRefresh={() => fetchData()}
                        refreshing={loading}
                        contentContainerStyle={{ paddingLeft: 20 }}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={data}
                        renderItem={({ item }) => <Card place={item} />}
                    />
                    <Text style={style.sectionTitle}>Recommended</Text>
                    <FlatList
                        keyExtractor={item => item._id}
                        onRefresh={() => fetchData()}
                        refreshing={loading}
                        snapToInterval={width - 20}
                        contentContainerStyle={{ paddingLeft: 20, paddingBottom: 20 }}
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        data={data}
                        renderItem={({ item }) => <RecommendedCard place={item} />}
                    />
                </View>
                <FAB onPress={() => navigation.navigate("CreateScreen")}
                    style={style.fab}
                    small={false}
                    icon="plus"
                    theme={{ colors: { accent: "#006aff" } }}

                />
            </ScrollView>
        </SafeAreaView>
    );
}

const style = StyleSheet.create({
    header: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: COLORS.primary,
    },

    headerTitle: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 23,
    },

    inputContainer: {
        height: 60,
        width: '100%',
        backgroundColor: COLORS.white,
        borderRadius: 10,
        position: 'absolute',
        top: 90,
        flexDirection: 'row',
        paddingHorizontal: 20,
        alignItems: 'center',
        elevation: 12,
    },

    categoryContainer: {
        marginTop: 60,
        marginHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    iconContainer: {
        height: 60,
        width: 60,
        backgroundColor: COLORS.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },

    sectionTitle: {
        marginHorizontal: 20,
        marginVertical: 20,
        fontWeight: 'bold',
        fontSize: 20,
    },

    cardImage: {
        height: 220,
        width: width / 2,
        marginRight: 20,
        padding: 10,
        overflow: 'hidden',
        borderRadius: 10,
    },

    rmCardImage: {
        width: width - 40,
        height: 200,
        marginRight: 20,
        borderRadius: 10,
        overflow: 'hidden',
        padding: 10,
    },

    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});