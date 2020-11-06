import React, { useEffect, useState } from 'react';
import { ApiCallAccount, ApiCallItem } from '../Api';
import { Container, Alert } from 'react-bootstrap';
import ManageThumbnail from './Managethumbnail';

export default function Manage() {

    const [estates, setestates] = useState([]);
    const [done, setDone] = useState(false);
    const [error, setError] = useState(false);

    const getestates = async () => {
        let username;

        const response = await fetch(ApiCallAccount + "/isloggedin", {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Accept-Encoding': 'gzip, deflate, br'
            }
        });
        const data = await response.json();
        if (data.isLoggedIn)
            username = data.userName;

        if (username) {
            if (0 < username.length) {
                if (!done) {
                    const response = await fetch(`${ApiCallItem}/?owner=${username}`, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    });
                    if (response.ok) {
                        setError(false);
                        const json = await response.json();
                        setestates(json);
                        setDone(true);
                    }
                    else {
                        setError(true);
                    }
                }
            }
        }
        else
            setError(true);
    }

    useEffect(() => {
        getestates();
    }, [])

    return (
        <Container className="estate-manage-list">
            {error ? <Alert show={true}>No matches found</Alert> : estates.map((estate) => {
                return (<ManageThumbnail key={estate.id} estate={estate} />);
            })}
        </Container>
    );
}
