import { createSlice } from "@reduxjs/toolkit";

const chatReducer = createSlice({
  name: "chatReducer",
  initialState: {
    chatUser: [],
    notifiMessage: []
  },

  reducers: {
    chatBoxHandler: (state, action) => {
      if (action.payload.close) {
        const filteredChat = state.chatUser.filter(item => item.id !== action.payload.id)
        state.chatUser = [...filteredChat]
      } else {
        const array = state.chatUser.some((item) => {
          return item.id === action.payload.id
        })
        if(!array){
          state.chatUser = [...state.chatUser, action.payload]
        }
      }
    },
    notifiChatHandler: (state, action) => {
      state.notifiMessage = [...action?.payload];
    },
  },
});
export const { chatBoxHandler, notifiChatHandler } = chatReducer.actions;
export default chatReducer.reducer;
