import React, { useState, useEffect } from 'react';
import { ApiCallAccount } from '../Api';
import { Card, Row } from 'react-bootstrap';

export default function Profile({ isSignedin }) {

    const [user, setUser] = useState({});

    const getProfile = async () => {
        const response = await fetch(ApiCallAccount + "/profile", {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        setUser(data);
    }

    useEffect(() => {
        if (isSignedin)
            getProfile();
    }, [isSignedin])

    return (
        <div className="ingatlan-list">{isSignedin ?
            <Card className="ingatlan-list-card justify-content-space-between col-sm-11 col-md-8 col-lg-6">
                <Card.Title>{user.userName}'s profile</Card.Title>
                <Card.Body className="justify-content-start">
                    <Row><p><b>Username: </b> {user.userName}</p></Row>
                    <Row><p><b>Full name: </b> {'' + user.firstName + '  ' + user.lastName}</p></Row>
                    <Row><p><b>E-mail Address: </b> {user.email}</p></Row>
                </Card.Body>
                <Card></Card>
            </Card>
        : <p>You are not logged in.</p>}
        </div>
    );
}