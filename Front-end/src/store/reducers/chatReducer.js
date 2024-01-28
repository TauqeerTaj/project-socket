import { createSlice } from "@reduxjs/toolkit";

const chatReducer = createSlice({
  name: "chatReducer",
  initialState: {
    chatUser: "",
    chatUserId: "",
  },

  reducers: {
    chatBoxHandler: (state, action) => {
      state.chatUser = action.payload.name;
      state.chatUserId = action.payload.id;
    },
  },
});
export const { chatBoxHandler } = chatReducer.actions;
export default chatReducer.reducer;
