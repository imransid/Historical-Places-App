import React, { useState, useMemo } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import {
  Surface,
  Text,
  Switch,
  IconButton,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import {
  scale,
  verticalScale as vscale,
  moderateScale as mscale,
} from 'react-native-size-matters';

export default function PlaceListItem({
  item,
  visited,
  onToggle,
  onOpenDetail,
}) {
  const theme = useTheme();
  const [imgError, setImgError] = useState(false);

  const source = useMemo(() => {
    if (!item?.image || imgError) return null;
    if (typeof item.image === 'number') return item.image;
    if (typeof item.image === 'string') return { uri: item.image };
    if (item.image?.uri) return item.image;
    return null;
  }, [item?.image, imgError]);

  return (
    <Surface
      mode="elevated"
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
    >
      <TouchableRipple onPress={onOpenDetail} borderless style={styles.row}>
        <>
          {/* Thumbnail */}
          <View style={styles.thumbWrap}>
            {source ? (
              <Image
                source={source}
                style={styles.thumb}
                resizeMode="cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <View style={[styles.thumb, styles.thumbFallback]}>
                <Text style={{ opacity: 0.6, fontSize: mscale(10) }}>
                  No Image
                </Text>
              </View>
            )}
          </View>

          {/* Texts */}
          <View style={styles.texts}>
            <Text numberOfLines={1} style={styles.title}>
              {item.name}
            </Text>
            {!!item.country || !!item.location ? (
              <Text numberOfLines={1} style={styles.subtitle}>
                {item.country || item.location}
              </Text>
            ) : null}
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <Switch value={visited} onValueChange={onToggle} />
            <IconButton
              icon="chevron-right"
              size={mscale(20)}
              onPress={onOpenDetail}
            />
          </View>
        </>
      </TouchableRipple>
    </Surface>
  );
}

const TH = vscale(64);

const styles = StyleSheet.create({
  card: {
    borderRadius: mscale(14),
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(10),
    minHeight: TH,
  },
  thumbWrap: {
    width: TH,
    height: TH,
    borderRadius: mscale(12),
    overflow: 'hidden',
    marginRight: scale(10),
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  thumbFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    flex: 1,
    paddingRight: scale(8),
  },
  title: {
    fontSize: mscale(15),
    fontWeight: '700',
    marginBottom: vscale(2),
  },
  subtitle: {
    fontSize: mscale(12),
    opacity: 0.65,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
