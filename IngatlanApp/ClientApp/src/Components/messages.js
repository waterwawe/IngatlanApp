import React,{useState,useEffect} from 'react';
import {ApiCallMessage} from '../Api';
import UserList from './userlist';
import Chat from './chat';
import {Card} from 'react-bootstrap';

export default function Messages({match}){
    const[activeUser, setActiveUser] = useState("");
    const[users, setUsers] = useState([]);

    const getUsers = async () => {
        const response = await fetch(`${ApiCallMessage}/users`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            method: 'GET'
        });
        if (response.ok) {
            const json = await response.json();
            setUsers(json);
            if(match.params.user)
                setActiveUser(match.params.user);
        }
    }

    const refresh = () =>{
        return null;
    }

    useEffect(() => {
        if(match.params.user !== activeUser){
        getUsers();
        }
    }, [refresh])

    return(
        <div className="d-flex justify-content-center">
        <Card className="col-md-11 col-lg-9" bg="light" variant="light">
            <Card.Body className="messages-container">
                <UserList userlist={users} activeUser={activeUser} refresh={refresh}/>
                {activeUser? <Chat otherUser={activeUser}/> : <></>}
            </Card.Body>
        </Card>
        </div>
    );
}