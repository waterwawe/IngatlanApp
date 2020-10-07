import React, { useEffect, useState } from 'react';
import { ApiCallItem } from '../Api';
import { Card } from 'react-bootstrap';
import Map from './detailmap';

export default function SearchMap() {

    const [latitude, setLatitude] = useState();
    const [longitude, setLongitude] = useState();
    const [ingatlans, setIngatlans] = useState([]);

    const distance = 1;

    const getIngatlans = async (coords) => {
        console.log(coords);
        const response = await fetch(`${ApiCallItem}/bylocation?longitude=${coords.longitude}&latitude=${coords.latitude}&distance=${distance}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const data = await response.json();
            setIngatlans(data);
        }
    }

    const getCurrentLocation = async () => {
        if (navigator && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                const coords = pos.coords;
                console.log(coords);
                setLongitude(coords.longitude);
                setLatitude(coords.latitude);
                getIngatlans(coords);
            });
        }
    }

    useEffect(() => {
        getCurrentLocation();
    }, [])


    return (
        <div className="d-flex justify-content-center">
            <Card className="col-md-11 col-lg-9" bg="light" variant="light">
                <Card.Body className="edit-map">
                <Map center={{
                    lat: latitude,
                    lng: longitude
                }} ingatlans={ingatlans} />
                </Card.Body>
            </Card>
        </div>
    );
}