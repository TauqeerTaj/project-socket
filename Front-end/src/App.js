import Routing from "./router";
import "./App.css";
import Chat from "./components/chat";
import { useSelector } from "react-redux";

function App() {
  const state = useSelector((state) => state.chat);
  return (
    <>
      <Routing />
      {state.chatUser && <Chat />}
    </>
  );
}

export default App;
