import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import openSocket from 'socket.io-client'
import axios from 'axios'
import ClipLoader from "react-spinners/ClipLoader";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import './dashboard.css'

const ENDPOINT = "http://localhost:8080";
let socket;

function Dashboard() {
    const { state } = useLocation()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [list, setList] = useState([])
    const [socketId, setSocketId] = useState('')
    const [messages, setMessages] = useState([])
    const [projectList, setProjectList] = useState([])
    const [socketConnected, setSocketConnected] = useState(false)
    const [selectedMember, setSelectedMember] = useState("")
    const [project, setProject] = useState({
        topic: '',
        category: '',
        searchCategory: '',
        description: ''
    })
    const [category] = useState(
        state?.category === "Supervisor" ? 'student'
            : 'supervisor')
    useEffect(() => {
        socket = openSocket(ENDPOINT, {transports: ['websocket']})
        
        socket.on('connect', () => {
            setSocketId(socket.id)
            console.log('socket id:', socket.id)
        })
        socket.emit('joined', { user: state })
        socket.on('userJoined', (data) => {
            setMessages([...messages, data]);
            console.log(data.user, data.message, messages);
        })
    }, [])

    useEffect(() => {
        setLoading(true)
        axios.get(`http://localhost:8080/auth/${category}s`)
            .then(res => {
                setLoading(false)
                setList([...res.data.list])
            })
            .catch(err => {
                console.log(err)
            })
        axios.get(`http://localhost:8080/project/projects`)
            .then(res => {
                setLoading(false)
                setProjectList([...res.data.list])
            })
            .catch(err => {
                console.log(err)
            })
        // socket = openSocket('http://localhost:8080')


    }, [])
    const submitHandler = async (e) => {
        e.preventDefault()
        await axios.post('http://localhost:8080/project/studentData', project)
    }
    const memberHandler = (firstName, lastName, id) => {
        setProject(project => ({ ...project, ['category']: `${firstName}-${lastName}` }))
        setSelectedMember(id)

    }
    const changeHandler = async (e) => {
        setProject(project => ({ ...project, [e.target.name]: e.target.value }))
        if (e.target.name === 'searchCategory') {
            const searchResult = await axios.get(`http://localhost:8080/search/category?name=${e.target.value}`)
            setList([...searchResult.data])
        }

    }
    return (
        <div className='dashboard'>
            <header>
                <div>
                    <img src={state?.profile} className='profile' />
                    <h2>
                        {state?.name}
                    </h2>
                </div>
                <div>
                    <h3>{state?.category}</h3>
                </div>
                <div className='logout'>
                    <FontAwesomeIcon icon={faBell} />
                    <span onClick={() => navigate('/')}>Logout</span>
                    <div className='notification'>

                    </div>
                </div>
            </header>
            <div className='bottom-content'>
                <div className='form-section'>
                    <form onSubmit={(e) => submitHandler(e)}>
                        <div>
                            <label>Topic</label>
                            <input type='text' name='topic' onChange={changeHandler} />
                        </div>
                        <div>
                            <label>{category}</label>
                            <input type='text' readOnly value={project.category} name='category' />
                        </div>
                        <div>
                            <label>Description</label>
                            <textarea name='description' onChange={changeHandler} />
                        </div>
                        <button type='submit' onClick={(e) => submitHandler(e)}>Send</button>
                    </form>
                </div>
                <div className='right-content'>
                    <div className='search'>
                        <label>Search Category</label>
                        <input type='search' name='searchCategory' onChange={changeHandler} value={project.searchCategory} />
                    </div>
                    <ul>
                        <ClipLoader
                            color="green"
                            loading={loading}
                            size={50}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                        {list.map((item, i) => {
                            return <li key={i} onClick={() => memberHandler(item.firstName, item.lastName, item._id)}>
                                <div>
                                    {item.firstName}-{item.lastName}
                                </div>
                                <div>
                                    <img src={item.profileImage} />
                                </div>
                            </li>
                        }
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
