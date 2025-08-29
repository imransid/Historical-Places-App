import React, { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  Banner,
  Button,
  FAB,
  Searchbar,
  SegmentedButtons,
  Text,
  useTheme,
} from 'react-native-paper';
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

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'visited' | 'unvisited'

  const onToggle = useCallback(id => dispatch(toggleVisited(id)), [dispatch]);
  const onSuggest = useCallback(
    () => dispatch(suggestRandomPlace()),
    [dispatch],
  );
  const onOpenDetail = useCallback(
    id => navigation.navigate('Detail', { id }),
    [navigation],
  );

  const suggestedPlace = useMemo(
    () => places.find(p => String(p.id) === String(suggested)),
    [places, suggested],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return places.filter(p => {
      const matchQ = !q || p.name.toLowerCase().includes(q);
      const isVisited = !!visited[p.id];
      const matchF =
        filter === 'all' ||
        (filter === 'visited' && isVisited) ||
        (filter === 'unvisited' && !isVisited);
      return matchQ && matchF;
    });
  }, [places, visited, query, filter]);

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

  const ListEmpty = useMemo(
    () => () =>
      (
        <View style={styles.emptyWrap}>
          <Text style={{ opacity: 0.6, marginBottom: vscale(8) }}>
            Nothing matches your search.
          </Text>
          <Button
            icon="lightbulb-on-outline"
            mode="outlined"
            onPress={onSuggest}
          >
            Suggest Random Place
          </Button>
        </View>
      ),
    [onSuggest],
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header tools */}
      <Searchbar
        placeholder="Search places..."
        value={query}
        onChangeText={setQuery}
        style={styles.search}
        inputStyle={{ fontSize: mscale(14) }}
      />

      <SegmentedButtons
        value={filter}
        onValueChange={setFilter}
        style={styles.segmented}
        buttons={[
          { value: 'all', label: 'All', icon: 'earth' },
          { value: 'visited', label: 'Visited', icon: 'check' },
          {
            value: 'unvisited',
            label: 'Unvisited',
            icon: 'map-marker-off-outline',
          },
        ]}
      />

      {/* Suggestion banner */}
      <Banner
        visible={!!suggested}
        icon="compass-outline"
        style={styles.banner}
        actions={
          suggested
            ? [{ label: 'Open', onPress: () => onOpenDetail(suggested) }]
            : []
        }
      >
        {suggestedPlace
          ? `Suggested: ${suggestedPlace.name}`
          : suggested
          ? `Suggested place id: ${suggested}`
          : 'Get a random historical place to explore.'}
      </Banner>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={{ paddingBottom: vscale(96) }}
        ItemSeparatorComponent={() => <View style={{ height: vscale(8) }} />}
        removeClippedSubviews
        initialNumToRender={12}
        windowSize={7}
      />

      {/* Floating Suggest FAB */}
      <FAB
        icon="lightbulb-on-outline"
        label="Suggest"
        onPress={onSuggest}
        style={styles.fab}
        variant="primary"
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
  search: {
    marginBottom: vscale(8),
    borderRadius: mscale(12),
  },
  segmented: {
    marginBottom: vscale(8),
  },
  banner: {
    marginBottom: vscale(8),
    borderRadius: mscale(12),
  },
  fab: {
    position: 'absolute',
    right: scale(16),
    bottom: vscale(20),
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vscale(32),
  },
});
