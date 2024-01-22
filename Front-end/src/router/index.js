import React, {useState} from 'react'
import {Routes, Route, useNavigate} from "react-router-dom";
import Signup from '../components/form/signup';
import Signin from '../components/form/signin';
import Dashboard from '../components/dashboard';
import ProjectDetails from '../components/project/project-details/ProjectDetails';
import ProjectList from '../components/project/project-list/ProjectList';
import Header from '../components/header/Header'

function Routing() {
    const navigate = useNavigate()
    let token = localStorage.getItem('token')

    const [listLoader, setListLoader] = useState(false)

    React.useEffect(()=>{
        if(!token){
            navigate('/')
        }
    },[])

    const projectListHandler = (data) => {
        setListLoader(data)
    }

    return (
        <>
            {token ?
            <>
            <Header listHandler = {projectListHandler}/>
            <Routes>
            <Route path='/dashboard' element={<Dashboard />}></Route>
            <Route path='/projects' element={<ProjectList listLoader={listLoader}/>}></Route>
            <Route path='/project-details' element={<ProjectDetails />}></Route>
            </Routes>
            </>:
            <Routes>
            <Route path='/' element={<Signin/>}></Route>
            <Route path='/signup' element={<Signup/>}></Route>
            </Routes>
            }
        </>
    )
}

export default Routing
