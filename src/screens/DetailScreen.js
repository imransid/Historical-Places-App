import React, { useMemo, useRef, useState } from 'react';
import { ScrollView, View, StyleSheet, Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleVisited } from '../store/places/placesSlice';
import {
  Button,
  Card,
  Text,
  Chip,
  Divider,
  useTheme,
} from 'react-native-paper';
import {
  scale,
  verticalScale as vscale,
  moderateScale as mscale,
} from 'react-native-size-matters';
import Shimmer from '../components/Shimmer';

export default function DetailScreen({ route }) {
  const { id } = route.params;
  const theme = useTheme();
  const dispatch = useDispatch();

  const place = useSelector(state =>
    state.places.list.find(p => String(p.id) === String(id)),
  );
  const visited = useSelector(state => !!state.places.visited[id]);

  // image loading state
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(Boolean(place?.image));
  const opacity = useRef(new Animated.Value(0)).current;

  const source = useMemo(() => {
    if (!place?.image) return null;
    if (typeof place.image === 'number') return place.image; // local require(...)
    if (typeof place.image === 'string') return { uri: place.image };
    if (place.image?.uri) return place.image;
    return null;
  }, [place?.image]);

  const onLoadEnd = () => {
    setLoading(false);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  if (!place) {
    return (
      <View
        style={[styles.notFound, { backgroundColor: theme.colors.background }]}
      >
        <Text variant="titleMedium">Place not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.colors.background, padding: scale(12) },
      ]}
    >
      <Card mode="elevated" style={styles.card}>
        {/* Cover area with shimmer skeleton */}
        <View style={styles.coverWrap}>
          {loading && !failed && (
            <Shimmer
              style={StyleSheet.absoluteFill}
              borderRadius={mscale(14)}
            />
          )}

          {source && !failed ? (
            <Animated.Image
              source={source}
              style={[styles.coverImg, { opacity }]}
              resizeMode="cover"
              onLoadStart={() => setLoading(true)}
              onLoadEnd={onLoadEnd}
              onError={e => {
                console.warn('Image failed:', e?.nativeEvent);
                setFailed(true);
                setLoading(false);
              }}
            />
          ) : (
            !loading && (
              <View style={[styles.coverImg, styles.coverPlaceholder]}>
                <Text variant="titleSmall" style={{ opacity: 0.7 }}>
                  No image available
                </Text>
              </View>
            )
          )}
        </View>

        <Card.Content style={{ paddingTop: vscale(10) }}>
          <Text variant="headlineSmall" style={styles.title}>
            {place.name}
          </Text>

          {(place.country || place.location) && (
            <Text variant="bodyMedium" style={styles.subtitle}>
              {place.country || place.location}
            </Text>
          )}

          <View style={styles.row}>
            <Chip
              compact
              icon={visited ? 'check' : 'map-marker-outline'}
              selected={visited}
              onPress={() => dispatch(toggleVisited(id))}
              style={styles.chip}
            >
              {visited ? 'Visited' : 'Not visited'}
            </Chip>

            <Button
              mode={visited ? 'outlined' : 'contained'}
              onPress={() => dispatch(toggleVisited(id))}
              style={styles.visitBtn}
              contentStyle={{ height: vscale(40) }}
              labelStyle={{ fontSize: mscale(14), fontWeight: '700' }}
              icon={visited ? 'close-circle-outline' : 'check-circle-outline'}
            >
              {visited ? 'Mark as Unvisited' : 'Mark as Visited'}
            </Button>
          </View>

          <Divider style={{ marginVertical: vscale(10) }} />

          {!!place.description && (
            <Text variant="bodyLarge" style={styles.desc}>
              {place.description}
            </Text>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(16),
  },
  container: {
    paddingBottom: vscale(24),
  },
  card: {
    borderRadius: mscale(14),
    overflow: 'hidden',
  },
  coverWrap: {
    height: vscale(220),
    backgroundColor: 'rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  coverImg: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: vscale(2),
    fontSize: mscale(22),
    fontWeight: '700',
  },
  subtitle: {
    opacity: 0.7,
    marginBottom: vscale(8),
    fontSize: mscale(13),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vscale(6),
  },
  chip: {
    marginRight: scale(8),
  },
  visitBtn: {
    borderRadius: mscale(10),
  },
  desc: {
    lineHeight: vscale(22),
    fontSize: mscale(14),
  },
});
