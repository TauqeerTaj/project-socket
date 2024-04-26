import axios from "axios";

//Save Messages
export const saveMessages = async (message) => {
    let data;
    await axios
      .post(`http://localhost:8080/messages/saveMessage`, message)
      .then((res) => {
        data = res.data.message;
      })
      .catch((err) => {
        console.log(err);
      });
    return data;
  };

  //GET Messages
export const getMessages = async (sender, chatUser) => {
  let data;
  await axios
    .get(`http://localhost:8080/messages/getMessages/${sender}/${chatUser}`)
    .then((res) => {
      data = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
  return data;
};