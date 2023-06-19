/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState, memo} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import api from './api/api';
import Icon from 'react-native-vector-icons/Entypo';

type Cards = {
  id: string;
  title: string;
  image: string;
  difficult: string;
  tags: Array<string>;
  podcastName: string;
  duration: number;
};

function App(): JSX.Element {
  const [cards, setCards] = useState<Array<Cards>>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const [search, setSearch] = useState('');

  const filter = (searchString: string) => {
    return cards.filter(
      item =>
        item.title.includes(searchString) ||
        item.podcastName.includes(searchString),
    );
  };

  const fetchCards = async () => {
    if (noData) {
      return;
    }
    if (pageNumber !== 1) {
      setLoading(true);
    }
    try {
      const response = await api.getCards(pageNumber, pageSize);
      if (response.data.success) {
        const prevDataList = cards;
        const receivedDataList: Cards = response.data.list;
        let newDataList = prevDataList.concat(receivedDataList);
        setCards(newDataList);
        setPageNumber((prev, props) => prev + 1);
        setLoading(false);
      } else {
        setNoData(true);
        setLoading(false);
      }
    } catch (e) {
      setNoData(true);
      setLoading(false);
      console.log(e, '//');
    }
  };
  // console.log(cards);
  useEffect(() => {
    fetchCards();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        placeholder="Search"
        style={{
          height: 40,
          margin: 12,
          // borderWidth: 1,
          padding: 10,
          width: 300,
          justifyContent: 'center',
          alignSelf: 'center',
          borderRadius: 20,
          backgroundColor: '#EDEDED',
        }}
        onChangeText={text => setSearch(text)}
      />
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={filter(search)}
        onEndReached={async () => await fetchCards()}
        renderItem={({item, index}) => {
          if (item !== null) {
            return (
              <>
                <View key={index} style={styles.item}>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      style={{
                        width: 76,
                        height: 76,
                        borderRadius: 10,
                        marginTop: 10,
                      }}
                      source={{
                        uri: item.image,
                      }}
                    />
                    <View style={{padding: 10, flexShrink: 1}}>
                      <Text
                        style={{
                          color: '#838383',
                          fontSize: 12,
                          fontWeight: 400,
                          lineHeight: 15,
                          textAlign: 'left',
                        }}>
                        {item.podcastName}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          lineHeight: 17,
                        }}>
                        {item.title}
                      </Text>
                      <View style={{flexDirection: 'row', marginTop: 5}}>
                        <Text>
                          <Icon
                            style={{alignSelf: 'flex-start'}}
                            size={16}
                            name={'star'}
                            color={'#F5B100'}
                          />
                        </Text>
                        <Text
                          style={{
                            color: '#4F4F4F',
                            fontSize: 13,
                            fontWeight: 400,
                            lineHeight: 17,
                            textAlign: 'left',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            paddingLeft: 2,
                          }}>
                          4.2
                        </Text>
                        <Text
                          style={{
                            marginLeft: 15,
                            color: '#4F4F4F',
                            fontSize: 11,
                            fontWeight: 700,
                            lineHeight: 13,
                            textAlign: 'left',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            paddingTop: 2,
                          }}>
                          {item.difficult}
                        </Text>
                        <Text
                          style={{
                            marginLeft: 15,
                            color: '#4F4F4F',
                            fontSize: 11,
                            fontWeight: 400,
                            lineHeight: 13,
                            textAlign: 'left',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            paddingTop: 2,
                          }}>
                          3 days ago
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
                    {item.tags && item.tags !== null
                      ? item.tags.map((tag, i) => <Text key={i}>#{tag} </Text>)
                      : null}
                  </View>
                </View>
              </>
            );
          } else {
            return null;
          }
        }}
      />
      {noData ? <Text style={{alignSelf: 'center'}}>No more data</Text> : null}
      {loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    // marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    // marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    // marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    flex: 1,
    maxWidth: 400,
    padding: 20,
    // marginVertical: 8,
    // marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF2F8',
    borderTopWidth: 1,
    borderTopColor: '#EFF2F8',
  },
});

export default memo(App);
