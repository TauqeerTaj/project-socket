import React,{useEffect} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './style.css'

function ProjectDetails() {
    const {state} = useLocation()
    const navigate = useNavigate()

    useEffect(()=> {
        window.scrollTo(0, 0)
    },[])

    const buttonClickHandler = () => {
        navigate('/dashboard', {
            state: state.user
        })
    }

    const approveProject = (id) => {
        axios.put(`http://localhost:8080/project/approve?approvedId=${id}`)
        .then(res => {
            console.log('approved:', res)
            navigate('/projects', {
                state: {
                    user:{...state.user}
                }
            })
        })
        .catch(err => {
            console.log(err)
        })
    }
    return (
        <div className='project-details'>
            <header>
                <button onClick={buttonClickHandler} className='back'>Back</button>
                <h1>Project Details</h1>
                <div className='action'>
                    <button className='approve' onClick={() => approveProject(state?._id ?? state?.id)}>
                        Approve
                    </button>
                    <button className='reject'>
                        Reject
                    </button>
                </div>
            </header>
            <div className='content'>
                <div className='details-header'>
                    <div>
                        <h3>Project:</h3>
                        <span>{state?.projectName ?? state?.topic}</span>
                    </div>
                    <div>
                        <h3>Name:</h3>
                        <span>{state.category.name}</span>
                    </div>
                </div>
                <div className='description'>
                    <h3>Description:</h3>
                    <span>{state.projectDescription ?? state?.description}</span>
                </div>
            </div>
        </div>
    )
}

export default ProjectDetails
