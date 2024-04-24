import { createSlice } from "@reduxjs/toolkit";

const chatReducer = createSlice({
  name: "chatReducer",
  initialState: {
    chatUser: "",
    chatUserId: "",
    notifiMessage: []
  },

  reducers: {
    chatBoxHandler: (state, action) => {
      state.chatUser = action?.payload?.name;
      state.chatUserId = action.payload.id;
    },
    notifiChatHandler: (state, action) => {
      state.notifiMessage = [...action?.payload];
    },
  },
});
export const { chatBoxHandler, notifiChatHandler } = chatReducer.actions;
export default chatReducer.reducer;
