import { createSlice } from '@reduxjs/toolkit';

const sessionSlice = createSlice({
  name: 'session',
  initialState: { sessionId: null },
  reducers: {
    setSessionId: (state, action) => {
      state.sessionId = action.payload;
    },
    clearSessionId: (state) => {
      state.sessionId = null;
    },
  },
});

export const { setSessionId, clearSessionId } = sessionSlice.actions;
export default sessionSlice.reducer;
