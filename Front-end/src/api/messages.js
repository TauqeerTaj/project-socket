import axios from "axios";

//Approve Project
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