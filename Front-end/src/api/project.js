import axios from "axios"

//GET Projects
export const getProjectList = async(id) => {
    let data = []
    await axios.get(`http://localhost:8080/project/projects?id=${id}`)
    .then(res => {
        console.log('refactor response:', res)
        data = [...res.data.list]
    })
    .catch(err => {
        console.log(err)
    })
    return data
}
//Approve Projects
export const getApprovalList = async() => {
    let data = [];
    await axios.get(`http://localhost:8080/project/approvedProjects`)
    .then(res => {
        data = [...res.data.list]
    })
    .catch(err => {
        console.log(err)
    })
    return data;
}
//Approve Project
export const approve = async(id) => {
    let data;
    await axios.put(`http://localhost:8080/project/approve?approvedId=${id}`)
    .then(res => {
        data = res.data.message
    })
    .catch(err => {
        console.log(err)
    })
    return data
}
//Reject Project
export const Delete = async(id) => {
    let data;
    await axios.delete(`http://localhost:8080/project/delete?deletedId=${id}`)
    .then(res => {
        data = {
            message: 'Project has been rejected!'
        }
    })
    .catch(err => {
        console.log(err)
    })
    return data
}