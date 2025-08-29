import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Banner, useTheme, Divider } from 'react-native-paper';
import {
  scale,
  verticalScale as vscale,
  moderateScale as mscale,
} from 'react-native-size-matters';

import { toggleVisited, suggestRandomPlace } from '../store/places/placesSlice';
import PlaceListItem from '../components/PlaceListItem';

export default function HomeScreen({ navigation }) {
  const theme = useTheme();
  const dispatch = useDispatch();

  const places = useSelector(state => state.places.list);
  const visited = useSelector(state => state.places.visited);
  const suggested = useSelector(state => state.places.suggested);

  const onToggle = useCallback(id => dispatch(toggleVisited(id)), [dispatch]);
  const onSuggest = useCallback(
    () => dispatch(suggestRandomPlace()),
    [dispatch],
  );
  const onOpenDetail = useCallback(
    id => navigation.navigate('Detail', { id }),
    [navigation],
  );

  const keyExtractor = useCallback(item => String(item.id), []);
  const renderItem = useCallback(
    ({ item }) => (
      <PlaceListItem
        item={item}
        visited={!!visited[item.id]}
        onToggle={() => onToggle(item.id)}
        onOpenDetail={() => onOpenDetail(item.id)}
      />
    ),
    [visited, onToggle, onOpenDetail],
  );

  const ItemSeparator = useMemo(() => () => <Divider />, []);
  const ListEmpty = useMemo(
    () => () =>
      (
        <View style={styles.emptyWrap}>
          <Button icon="database-search" mode="outlined" onPress={onSuggest}>
            No places yet — suggest one
          </Button>
        </View>
      ),
    [onSuggest],
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Suggest button */}
      <Button
        mode="contained"
        onPress={onSuggest}
        style={styles.suggestBtn}
        contentStyle={{ height: vscale(44) }}
        labelStyle={{ fontSize: mscale(14), fontWeight: '700' }}
        icon="lightbulb-on-outline"
      >
        Suggest Random Place
      </Button>

      {/* Suggestion banner */}
      <Banner
        visible={!!suggested}
        icon="compass-outline"
        style={styles.banner}
        actions={
          suggested
            ? [
                {
                  label: 'Open',
                  onPress: () => onOpenDetail(suggested),
                },
              ]
            : []
        }
      >
        {suggested
          ? `Suggested place id: ${suggested}`
          : 'Get a random historical place to explore.'}
      </Banner>

      {/* List of places using your PlaceListItem */}
      <FlatList
        data={places}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={{ paddingBottom: vscale(16) }}
        // (optional) improves performance if rows are similar height
        // getItemLayout={(data, index) => ({
        //   length: vscale(56),
        //   offset: vscale(56) * index,
        //   index,
        // })}
        removeClippedSubviews
        initialNumToRender={10}
        windowSize={7}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(12),
    paddingTop: vscale(12),
  },
  suggestBtn: {
    borderRadius: mscale(10),
    marginBottom: vscale(8),
  },
  banner: {
    marginBottom: vscale(8),
    borderRadius: mscale(10),
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vscale(24),
  },
});
