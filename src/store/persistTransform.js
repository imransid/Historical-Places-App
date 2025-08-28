import { createTransform } from 'redux-persist';

export const placesMinimalTransform = createTransform(
  (inboundState, key) => {
    return {
      visited: inboundState.visited,
      suggested: inboundState.suggested,
    };
  },

  (outboundState, key) => {
    return {
      list: [],
      visited: outboundState.visited || {},
      suggested: outboundState.suggested ?? null,
    };
  },
  { whitelist: ['places'] },
);
