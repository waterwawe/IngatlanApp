import React, { useState, useEffect } from 'react';
import { Card, Row } from 'react-bootstrap';
import { getProfile } from '../Services/AccountService';

export default function Profile({ isSignedin }) {

    const [user, setUser] = useState({});

    const getUserProfile = async () => {
        const response = await getProfile();
        if (response.ok) {
            const data = await response.json();
            setUser(data);
        }
    }

    useEffect(() => {
        if (isSignedin)
            getUserProfile();
    }, [isSignedin])

    return (
        <div className="estate-list">{isSignedin ?
            <Card className="estate-list-card justify-content-space-between col-sm-11 col-md-8 col-lg-6">
                <Card.Title>{user.userName}'s profile</Card.Title>
                <Card.Body className="justify-content-start">
                    <Row><p><b>Username: </b> {user.userName}</p></Row>
                    <Row><p><b>Full name: </b> {'' + user.firstName + '  ' + user.lastName}</p></Row>
                    <Row><p><b>E-mail Address: </b> {user.email}</p></Row>
                    <Row><p><b>Credits: </b> {user.credits}</p></Row>
                </Card.Body>
                <Card></Card>
            </Card>
            : <p>You are not logged in.</p>}
        </div>
    );
}