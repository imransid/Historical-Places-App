import React from 'react';
import { View, Button, FlatList, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleVisited, suggestRandomPlace } from '../store/places/placesSlice';

/**
 * HomeScreen displays a list of historical places. Users can mark places as
 * visited using a switch on each list item and can ask the app to suggest a
 * random place to explore. The suggestion can then be opened directly.
 */
export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const places = useSelector(state => state.places.list);
  const visited = useSelector(state => state.places.visited);
  const suggested = useSelector(state => state.places.suggested);

  const onToggle = id => dispatch(toggleVisited(id));
  const onSuggest = () => dispatch(suggestRandomPlace());
  const onOpenDetail = id => navigation.navigate('Detail', { id });

  return (
    <View style={styles.container}>
      {/* Button to suggest a random place */}
      <Button title="Suggest Random Place" onPress={onSuggest} />
      {/* When a suggestion exists, allow the user to open it quickly */}
      {suggested && (
        <View style={styles.suggestedContainer}>
          <Button
            title="Open Suggested"
            onPress={() => onOpenDetail(suggested)}
          />
        </View>
      )}
      <FlatList
        data={places}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <></>
          // <PlaceListItem
          //   item={item}
          //   visited={!!visited[item.id]}
          //   onToggle={() => onToggle(item.id)}
          //   onOpenDetail={() => onOpenDetail(item.id)}
          // />
        )}
        // Give each list row a unique key and remove default separators.
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  suggestedContainer: {
    marginVertical: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
});
