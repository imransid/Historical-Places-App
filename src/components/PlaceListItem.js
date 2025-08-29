// components/PlaceListItem.js
import React from 'react';
import { View } from 'react-native';
import { List, Divider, Switch } from 'react-native-paper';
import {
  scale,
  verticalScale as vscale,
  moderateScale as mscale,
} from 'react-native-size-matters';

const iconForPlace = id => {
  switch (String(id).toLowerCase()) {
    case 'greatwall':
      return 'castle';
    case 'machupicchu':
      return 'earth';
    case 'colosseum':
      return 'bank';
    case 'pyramidsofgiza':
    case 'pyramids':
      return 'castle'; // swap to something you like
    case 'tajmahal':
      return 'bank'; // or 'temple-hindu' if you have it
    default:
      return 'map-marker';
  }
};

export default function PlaceListItem({
  item,
  visited,
  onToggle,
  onOpenDetail,
}) {
  return (
    <View>
      <List.Item
        title={item.name}
        description={item.country || item.location}
        left={props => <List.Icon {...props} icon={iconForPlace(item.id)} />}
        right={() => <Switch value={visited} onValueChange={onToggle} />}
        onPress={onOpenDetail}
        style={{ paddingVertical: vscale(8), paddingHorizontal: scale(4) }}
        titleStyle={{ fontSize: mscale(16), fontWeight: '700' }}
        descriptionStyle={{ fontSize: mscale(12), opacity: 0.7 }}
      />
      <Divider />
    </View>
  );
}
