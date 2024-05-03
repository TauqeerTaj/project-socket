import axios from "axios";

//Save Messages
export const saveMessages = async (message) => {
    let data;
    await axios
      .post(`${process.env.REACT_APP_BASE_URL}/messages/saveMessage`, message)
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
    .get(`${process.env.REACT_APP_BASE_URL}/messages/getMessages/${sender}/${chatUser}`)
    .then((res) => {
      data = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
  return data;
};