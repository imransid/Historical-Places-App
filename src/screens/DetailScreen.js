import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  Button,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleVisited } from '../store/places/placesSlice';

export default function DetailScreen({ route }) {
  const { id } = route.params;
  const dispatch = useDispatch();
  const place = useSelector(state => state.places.list.find(p => p.id === id));
  const visited = useSelector(state => !!state.places.visited[id]);

  if (!place) {
    return (
      <View style={styles.container}>
        <Text>Place not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: place.image }} style={styles.image} />
      <Text style={styles.title}>{place.name}</Text>
      <Text style={styles.desc}>{place.description}</Text>
      <Button
        title={visited ? 'Mark as Unvisited' : 'Mark as Visited'}
        onPress={() => dispatch(toggleVisited(id))}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  desc: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
  },
});
