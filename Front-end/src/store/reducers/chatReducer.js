import { createSlice } from "@reduxjs/toolkit";

const chatReducer = createSlice({
  name: "chatReducer",
  initialState: {
    chatUser: "",
  },

  reducers: {
    chatBoxHandler: (state, action) => {
      state.chatUser = action.payload;
    },
  },
});
export const { chatBoxHandler } = chatReducer.actions;
export default chatReducer.reducer;
