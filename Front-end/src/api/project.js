import axios from "axios";

//GET Projects
export const getProjectList = async (id) => {
  let data = [];
  await axios
    .get(`https://project-socket-backend.vercel.app/project/projects?id=${id}`)
    .then((res) => {
      data = [...res.data.list];
    })
    .catch((err) => {
      console.log(err);
    });
  return data;
};
//Approved Projects
export const getApprovalList = async () => {
  let data = [];
  await axios
    .get(`https://project-socket-backend.vercel.app/project/approvedProjects`)
    .then((res) => {
      data = [...res.data.list];
    })
    .catch((err) => {
      console.log(err);
    });
  return data;
};
//Approve Project
export const approve = async (id) => {
  let data;
  await axios
    .put(`https://project-socket-backend.vercel.app/project/approve?approvedId=${id}`)
    .then((res) => {
      data = res.data.message;
    })
    .catch((err) => {
      console.log(err);
    });
  return data;
};
//Reject Project
export const Delete = async (id) => {
  let data;
  await axios
    .delete(`https://project-socket-backend.vercel.app/project/delete?deletedId=${id}`)
    .then((res) => {
      data = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
  return data;
};
