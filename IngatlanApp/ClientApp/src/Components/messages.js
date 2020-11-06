import React, { useState, useEffect } from 'react';
import { getUsers } from '../Services/MessageService';
import UserList from './UserList';
import Chat from './Chat';
import { Card } from 'react-bootstrap';

export default function Messages({ match }) {

    const [activeUser, setActiveUser] = useState("");
    const [users, setUsers] = useState([]);

    const getOtherUsers = async () => {
        const response = await getUsers();
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
        getOtherUsers();
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