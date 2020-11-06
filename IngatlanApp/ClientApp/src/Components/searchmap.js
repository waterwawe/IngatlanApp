import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { getEstatesByLocation} from '../Services/EstateService';
import Map from './DetailMap';

export default function SearchMap() {

    const [latitude, setLatitude] = useState();
    const [longitude, setLongitude] = useState();
    const [estates, setestates] = useState([]);

    const distance = 1;

    const getestates = async (coords) => {
        const response = await getEstatesByLocation(coords,distance);
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