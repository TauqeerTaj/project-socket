import React, {useState, useEffect} from 'react'
import axios from 'axios'
import ClipLoader from "react-spinners/ClipLoader";
import './style.css'
import { useNavigate, useLocation } from 'react-router-dom'

function ProjectList() {
    const navigate = useNavigate()
    const {state} = useLocation()

    const [list, setList]= useState([])
    const [loading, setLoading] = useState(false)

    const getProjects = () => {
        setLoading(true)
        axios.get(`http://localhost:8080/project/projects?id=${state.user.id}`)
        .then(res => {
            setLoading(false)
            setList([...res.data.list])
        })
        .catch(err => {
            console.log(err)
        })
    }

    useEffect(()=>{
        getProjects()
    },[])

    const clickHandler = (details) => {
        navigate('/project-details', {
            state: {
                ...details,
                user: state?.user
            }
        })
    }
    const truncate = (str, maxlength) => {
        return (str.length > maxlength) ?
          str.slice(0, maxlength - 1) + '…' : str;
      }
    return (
        <div className='projectList'>
                        <div className='spinner'>
                            <ClipLoader
                                color="green"
                                loading={loading}
                                size={50}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            />
                        </div>
                        <ul>
                            {list?.map(project => (
                                <li onClick={() => clickHandler(project)}>
                                    <div>
                                        <h3>Name:</h3>
                                        <span>{project.projectName}</span>
                                    </div>
                                    <div>
                                        <h3>Description:</h3>
                                        <span>{truncate(project.projectDescription, 400)}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                </div>
    )
}

export default ProjectList
