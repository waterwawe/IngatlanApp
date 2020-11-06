import React, { useEffect, useState } from 'react';
import { Container, Alert } from 'react-bootstrap';
import ManageThumbnail from './Managethumbnail';
import { getLoggedIn } from '../Services/AccountService';
import { getEstates } from '../Services/EstateService';

export default function Manage() {

    const [estates, setestates] = useState([]);
    const [done, setDone] = useState(false);
    const [error, setError] = useState(false);

    const getUserEstates = async () => {
        let username;

        const response = await getLoggedIn();
        const data = await response.json();
        if (data.isLoggedIn)
            username = data.userName;

        if (username) {
            if (0 < username.length) {
                if (!done) {
                    let queryobj = {owner: username};
                    const response = await getEstates(queryobj);
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
        getUserEstates();
    }, [])

    return (
        <Container className="estate-manage-list">
            {error ? <Alert show={true}>No matches found</Alert> : estates.map((estate) => {
                return (<ManageThumbnail key={estate.id} estate={estate} />);
            })}
        </Container>
    );
}
