import React from 'react'
import './style.css'
import { useNavigate } from 'react-router-dom'

function ProjectList({list, user}) {
    const navigate = useNavigate()
    const clickHandler = (details) => {
        navigate('/project-details', {
            state: {
                ...details,
                user: user
            }
        })
    }
    return (
        <div className='projectList'>
                        <ul>
                            {list?.map(project => (
                                <li onClick={() => clickHandler(project)}>
                                    <div>
                                        <h3>Name:</h3>
                                        <span>{project.projectName}</span>
                                    </div>
                                    <div>
                                        <h3>Description:</h3>
                                        <span>{project.projectDescription}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                </div>
    )
}

export default ProjectList
