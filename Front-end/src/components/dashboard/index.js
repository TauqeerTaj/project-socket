import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import socketIo from "socket.io-client";
import axios from 'axios'
import ClipLoader from "react-spinners/ClipLoader";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import Header from '../header/Header';
import './dashboard.css'

let socket;
const ENDPOINT = "http://localhost:8080";

function Dashboard() {
    const { state } = useLocation()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [list, setList] = useState([])
    const [socketId, setSocketId] = useState('')
    const [projectList, setProjectList] = useState([])
    const [countData, setCountData] = useState([])
    const [count, setCount] = useState(false)
    const [showNotification, setShowNotification] = useState(false)
    const [validation, setValidation] = useState(false)
    const [selectedMember, setSelectedMember] = useState("")
    const [project, setProject] = useState({
        topic: '',
        category: {
            id: '',
            name: ''
        },
        searchCategory: '',
        description: ''
    })
    const [sendMessage, setSendMessage] = useState([])
    const [category] = useState(
        state?.category === "Supervisor" ? 'student'
            : 'supervisor')
    const getProjects = () => {
        axios.get(`http://localhost:8080/project/projects?id=${state.id}`)
        .then(res => {
            setLoading(false)
            setProjectList([...res.data.list])
        })
        .catch(err => {
            console.log(err)
        })
    }
    useEffect(() => {
        console.log('state:', state.id)
        setLoading(true)
        axios.get(`http://localhost:8080/auth/${category}s`)
            .then(res => {
                setLoading(false)
                setList([...res.data.list])
            })
            .catch(err => {
                console.log(err)
            })
            getProjects()
        // axios.get(`http://localhost:8080/project/projects`)
        //     .then(res => {
        //         setLoading(false)
        //         setProjectList([...res.data.list])
        //     })
        //     .catch(err => {
        //         console.log(err)
        //     })
        socket = socketIo(ENDPOINT, { transports: ['websocket'] })
        socket.on('connect', () => {
            console.log('socket id:', socket.id, state?.id)
            setSocketId(socket.id)
        })
        socket.emit('joined', { user: state?.id })
        socket.on('userJoined', (data) => {
        })
        socket.on('leave', (data) => {
            console.log(data.user, data.message)
        })
        return () => {
            socket.emit('disconn');
            socket.off();
        }
    }, [])
    const countHandler = () => {
        if(countData.length > 0){
            setSendMessage([...sendMessage, ...countData])
            setShowNotification(!showNotification)
        }
        if(countData.length > 0 || sendMessage.length > 0){
            setShowNotification(!showNotification)
        }
        setCountData([])
        setCount(false)
    }
    const submitHandler = async (e) => {
        e.preventDefault()
        if(project.topic === '' || project.category.name === '' || project.description===''){
            setValidation(true)
            return
        }
        const payload = {
            ...project,
            category: {
                name: state.name,
                id: selectedMember
            }
        }
        await axios.post('http://localhost:8080/project/studentData', payload)
        socket.emit('message', { message: { ...payload, receiver_id: selectedMember }, id: socketId });
        setProject({
            ...payload,
            topic: '',
            category: {
                name: '',
                id: ''
            },
            searchCategory: '',
            description: ''

        })
    }
    const memberHandler = (name, id) => {
        setProject(project => ({ 
            ...project,
            category: {
                name: name,
                id: id
            }
        }))
        setSelectedMember(id)

    }
    const changeHandler = async (e) => {
        setProject(project => ({ ...project, [e.target.name]: e.target.value }))
        if (e.target.name === 'searchCategory') {
            const searchResult = await axios.get(`http://localhost:8080/search/category?name=${e.target.value}`)
            setList([...searchResult.data])
        }

    }
    useEffect(() => {
        socket.on('sendMessage', (data) => {
            if (data.receiver_id === state?.id) {
                setCountData([...countData, data]);
                setCount(true)
                getProjects()
            }
        })
    }, [countData])
    return (
        <div className='dashboard'>
            {
                state?.category === "Supervisor" ?
                <><Header /><Navigate to='/projects' state={{ list: projectList, user: state }} /></> :
                <div className='bottom-content'>
                    <div className='form-section'>
                        <form onSubmit={(e) => submitHandler(e)}>
                            <div>
                                <label>Topic</label>
                                <input type='text' name='topic' onChange={changeHandler} value={project.topic}/>
                                {validation && project.topic === '' && <error>Please enter project topic</error>}
                            </div>
                            <div>
                                <label>{category}</label>
                                <input type='text' readOnly value={project.category.name} name='category' />
                                {validation && project.category.name === '' && <error>{`Please enter ${state.category}`}</error>}
                            </div>
                            <div>
                                <label>Description</label>
                                <textarea name='description' onChange={changeHandler} value={project.description}/>
                                {validation && project.description === '' && <error>Please enter project description</error>}
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
                                return <li key={i} onClick={() => memberHandler(item.firstName+item.lastName, item._id)}>
                                    <div>
                                        {item.firstName}-{item.lastName}
                                    </div>
                                    <div>
                                        <img src={item.profileImage} alt='profile'/>
                                    </div>
                                </li>
                            }
                            )}
                        </ul>
                    </div>
                </div>
            }
            <header>
                <div>
                    <img src={state?.profile} className='profile' alt='profile'/>
                    <h2>
                        {state?.name}
                    </h2>
                </div>
                <div>
                    <h3>{state?.category}</h3>
                </div>
                <div className='logout'>
                    {countData.length > 0 && count && <count onClick={countHandler}>{countData.length}</count> }
                    <FontAwesomeIcon icon={faBell} onClick={countHandler}/>
                    <span onClick={() => {
                        localStorage.removeItem('token')
                        navigate('/')
                        socket.emit('disconn');
                        socket.off();
                    }}>Logout</span>
                    {
                        showNotification &&
                        <div className='notification'>
                            {
                                sendMessage?.map(notifi => (
                                    <div className='content'>
                                        <div>
                                            <strong>Project:</strong>
                                            <span>{notifi.topic}</span>
                                        </div><div>
                                            <strong>Sender:</strong>
                                            <span>{notifi.category.name}</span>
                                        </div>
                                    </div>
                                ))
                            }

                        </div>
                    }
                </div>
            </header>
        </div>
    )
}

export default Dashboard
