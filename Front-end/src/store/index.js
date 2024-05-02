import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./reducers/chatReducer";
export default configureStore({
  reducer: {
    chat: chatReducer,
  },
});
