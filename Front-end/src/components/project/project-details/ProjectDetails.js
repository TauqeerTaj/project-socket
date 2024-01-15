import React,{useEffect} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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
    return (
        <div className='project-details'>
            <header>
                <button onClick={buttonClickHandler}>Back</button>
                <h1>Project Details</h1>
            </header>
            <div className='content'>
                <div className='details-header'>
                    <div>
                        <h3>Project:</h3>
                        <span>{state?.projectName}</span>
                    </div>
                    <div>
                        <h3>Name:</h3>
                        <span>{state.category.name}</span>
                    </div>
                </div>
                <div className='description'>
                    <h3>Description:</h3>
                    <span>{state.projectDescription}</span>
                </div>
            </div>
        </div>
    )
}

export default ProjectDetails
