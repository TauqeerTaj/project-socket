import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import socketIo from "socket.io-client";
import axios from 'axios'
import ClipLoader from "react-spinners/ClipLoader";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
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
    const [count, setCount] = useState(false)
    const [showNotification, setShowNotification] = useState(false)
    const [validation, setValidation] = useState(false)
    const [selectedMember, setSelectedMember] = useState("")
    const [project, setProject] = useState({
        topic: '',
        category: '',
        searchCategory: '',
        description: ''
    })
    const [sendMessage, setSendMessage] = useState([])
    const [category] = useState(
        state?.category === "Supervisor" ? 'student'
            : 'supervisor')
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
        console.log('clickeddd...')
        if(sendMessage.length > 0){
            setShowNotification(!showNotification)
        }
        setCount(false)
    }
    const submitHandler = async (e) => {
        e.preventDefault()
        if(project.topic === '' || project.category === '' || project.description===''){
            setValidation(true)
            return
        }
        await axios.post('http://localhost:8080/project/studentData', project)
        socket.emit('message', { message: { ...project, receiver_id: selectedMember }, id: socketId });
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
    useEffect(() => {
        socket.on('sendMessage', (data) => {
            if (data.receiver_id === state?.id) {
                setSendMessage([...sendMessage, data]);
                setCount(true)
            }
            console.log('sendMessagedata:', data, sendMessage);
        })
        return () => {
            socket.off();
        }
    }, [sendMessage])
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
                    {sendMessage.length > 0 && count && <count onClick={countHandler}>{sendMessage.length}</count> }
                    <FontAwesomeIcon icon={faBell} onClick={countHandler}/>
                    <span onClick={() => navigate('/')}>Logout</span>
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
                                            <span>{notifi.category}</span>
                                        </div>
                                    </div>
                                ))
                            }

                        </div>
                    }
                </div>
            </header>
            <div className='bottom-content'>
                <div className='form-section'>
                    <form onSubmit={(e) => submitHandler(e)}>
                        <div>
                            <label>Topic</label>
                            <input type='text' name='topic' onChange={changeHandler} />
                            {validation && project.topic === '' && <error>Please enter project topic</error>}
                        </div>
                        <div>
                            <label>{category}</label>
                            <input type='text' readOnly value={project.category} name='category' />
                            {validation && project.category === '' && <error>{`Please enter ${state.category}`}</error>}
                        </div>
                        <div>
                            <label>Description</label>
                            <textarea name='description' onChange={changeHandler} />
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
