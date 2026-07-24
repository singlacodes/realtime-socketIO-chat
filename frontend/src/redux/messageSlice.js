import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload || [];
    },
    appendMessage: (state, action) => {
      if (!action.payload) return;
      const list = state.messages || [];
      const exists = list.some((m) => m._id && m._id === action.payload._id);
      if (!exists) {
        state.messages = [...list, action.payload];
      }
    },
  },
});

export const { setMessages, appendMessage } = messageSlice.actions;
export default messageSlice.reducer;
