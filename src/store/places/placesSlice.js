import { createSlice } from '@reduxjs/toolkit';
import data from '../../data/places';

// The initial state includes the list of static places, a map of visited
// statuses keyed by place id, and the id of the last suggested place. The
// list is not persisted to storage to avoid storing duplicate static data.
const initialState = {
  list: data,
  visited: {},
  suggested: null,
};

const placesSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {
    /**
     * Toggle the visited state for a given place id. If the id does not
     * exist in the visited map it will be added with a value of true.
     */
    toggleVisited: (state, action) => {
      const id = action.payload;

      if (!id) return;
      state.visited[id] = !state.visited[id];
    },
    /**
     * Choose a random place from the list and store its id in the state.
     * If there are no places this action does nothing.
     */
    suggestRandomPlace: state => {
      if (!state.list.length) return;
      const random = state.list[Math.floor(Math.random() * state.list.length)];
      state.suggested = random.id;
    },
    /**
     * Reset all visited states and clear any suggestion. This is handy for
     * testing or to allow the user to start over.
     */
    resetVisited: state => {
      state.visited = {};
      state.suggested = null;
    },
  },
});

export const { toggleVisited, suggestRandomPlace, resetVisited } =
  placesSlice.actions;
export default placesSlice.reducer;
