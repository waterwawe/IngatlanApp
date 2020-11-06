import React, { useEffect, useState } from 'react';
import { ApiCallItem } from '../Api';
import { Card } from 'react-bootstrap';
import Map from './DetailMap';

export default function SearchMap() {

    const [latitude, setLatitude] = useState();
    const [longitude, setLongitude] = useState();
    const [estates, setestates] = useState([]);

    const distance = 1;

    const getestates = async (coords) => {
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
            setestates(data);
        }
    }

    //Jelenlegi helyzet elkérése a böngészőtől
    const getCurrentLocation = async () => {
        if (navigator && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                const coords = pos.coords;
                setLongitude(coords.longitude);
                setLatitude(coords.latitude);
                getestates(coords);
            });
        }
    }

    useEffect(() => {
        getCurrentLocation();
    }, [])


    return (
        <div className="d-flex justify-content-center">
            <Card className="col-md-11 col-lg-9" bg="light" variant="light">
                <Card.Body className="big-map">
                <Map center={{
                    lat: latitude,
                    lng: longitude
                }} estates={estates} />
                </Card.Body>
            </Card>
        </div>
    );
}