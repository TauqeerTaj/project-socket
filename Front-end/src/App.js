import Routing from "./router";
import "./App.css";
import Chat from "./components/chat";
import { useSelector } from "react-redux";

function App() {
  const state = useSelector((state) => state.chat);
  console.log("show chat:", state.chatUser)
  return (
    <>
      <Routing />
      <div className="chat-popup">{state?.chatUser.map(item => item.id && <Chat user={item} />)}</div>
    </>
  );
}

export default App;
