import React,{useEffect} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { approve,Delete } from '../../../api/project'
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

    const approveProject = async(id) => {
        const data = await approve(id)
        if(data){
            navigate('/projects', {
                state: {
                    user:{...state.user}
                }
            })
        }
    }
    const deleteProject = async(id) => {
        const data = await Delete(id)
        if(data.message){
            navigate('/projects', {
                state: {
                    user:{...state.user}
                }
            })
        }
    }
    return (
        <div className={state.approved ? 'project-details approved' : 'project-details'}>
            <header>
                <button onClick={buttonClickHandler} className='back'>Back</button>
                <h1>Project Details</h1>
                <div className='action'>
                    <button className='approve' onClick={() => approveProject(state?._id ?? state?.id)}>
                        Approve
                    </button>
                    <button className='reject' onClick={() => deleteProject(state?._id ?? state?.id)}>
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
