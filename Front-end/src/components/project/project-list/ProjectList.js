import React, {useState, useEffect} from 'react'
import axios from 'axios'
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import './style.css'

function ProjectList({listLoader}) {
    const navigate = useNavigate()
    const {state} = useLocation()

    const [list, setList]= useState([])
    const [loading, setLoading] = useState(false)
    const [toggleApproved, setToggleApproved] = useState(false)

    const getProjects = () => {
        setLoading(true)
        setToggleApproved(false)
        axios.get(`http://localhost:8080/project/projects?id=${state.user.id}`)
        .then(res => {
            setLoading(false)
            setList([...res.data.list])
        })
        .catch(err => {
            console.log(err)
        })
    }
    const getApprovedProjects = () => {
        setLoading(true)
        setToggleApproved(true)
        axios.get(`http://localhost:8080/project/approvedProjects`)
        .then(res => {
            setLoading(false)
            setList([...res.data.list])
        })
        .catch(err => {
            console.log(err)
        })
    }

    useEffect(()=>{
        console.log('loader:', listLoader)
        getProjects()
    },[listLoader])

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
                <h1>Projects <a onClick={!toggleApproved ? getApprovedProjects : getProjects}>{!toggleApproved ? 'Approved projects' : 'All projects'}<FontAwesomeIcon icon={faArrowRight}/></a></h1>
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
                        <li onClick={() => clickHandler(project)} className={toggleApproved ? 'approved' : ''}>
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
