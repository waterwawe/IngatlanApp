import React, { useState, useEffect } from 'react';
import { ApiCallMessage } from '../Api';
import UserList from './userlist';
import Chat from './chat';
import { Card } from 'react-bootstrap';

export default function Messages({ match }) {
    //Állapotváltozók
    const [activeUser, setActiveUser] = useState("");
    const [users, setUsers] = useState([]);

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
            if (match.params.user) {
                setActiveUser(match.params.user);
            }
        }
    }

    const refresh = () => {
        if (match.params.user) {
            setActiveUser(match.params.user);
        }
    }

    useEffect(() => {
        //Felhasználók listájának lekérése az API-tól.
        getUsers();
    }, [activeUser])

    return (
        <div className="d-flex justify-content-center">
            <Card className="col-md-11 col-lg-9" bg="light" variant="light">
                <Card.Body className="messages-container">
                    {users.length === 0 ? "You haven't recieved any messages yet." : <><UserList userlist={users} activeUser={activeUser} refresh={refresh} />
                        {activeUser ? <Chat otherUser={activeUser} /> : <></>}
                    </>}
                </Card.Body>
            </Card>
        </div>
    );
}