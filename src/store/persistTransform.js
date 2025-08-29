import { createTransform } from 'redux-persist';
import data from '../data/places';

export const placesMinimalTransform = createTransform(
  (inboundState, key) => {
    return {
      visited: inboundState.visited,
      suggested: inboundState.suggested,
    };
  },

  (outboundState, key) => {
    return {
      list: data,
      visited: outboundState.visited || {},
      suggested: outboundState.suggested ?? null,
    };
  },
  { whitelist: ['places'] },
);
