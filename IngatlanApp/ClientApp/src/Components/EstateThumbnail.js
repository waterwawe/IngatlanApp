import React, { useState, useEffect } from 'react';
import { Button, Card, Row, Image, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import house from './pics/house.PNG';
import { estatetypes } from '../Api';
import { getImage } from '../Services/ImageService';

export default function EstateThumbnail({ estate }) {

    const [thumbnail, setThumbnail] = useState();
    const [done, setDone] = useState(false);

    function titleCase(str) {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        return splitStr.join(' ');
    }

    function romanize(num) {
        if (isNaN(num))
            return NaN;
        var digits = String(+num).split(""),
            key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
                "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
                "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
            roman = "",
            i = 3;
        while (i--)
            roman = (key[+digits.pop() + (i * 10)] || "") + roman;
        return Array(+digits.join("") + 1).join("M") + roman;
    }

    const getThumbnail = async () => {
        if (estate.images) {
            if (estate.images.length > 0) {
                if (!done) {
                    await getImage(estate.images[0])
                        .then(images => {
                            setThumbnail(URL.createObjectURL(images))
                        });
                }
            }
        }
        setDone(true);
    }

    useEffect(() => {
        getThumbnail();
    }, [])

    return (
        <Card className="estate-list-card">
            <Card.Title>{estate.title}</Card.Title>
            <Card.Body className="justify-content-center">
                <ListGroup horizontal>
                    <ListGroup.Item className="col-sm-3 col-md-4 col-lg-5">
                        <Image className="estate-list-card-image" src={estate.images ? estate.images.length > 0 ? thumbnail : house : house} fluid thumbnail />
                    </ListGroup.Item>
                    <ListGroup.Item className="justify-content-start col-sm-6 col-md-5 col-lg-4">
                        <Row><b>Address: </b> {`${titleCase(estate.address.city)}, ${romanize(estate.address.district)} ,${titleCase(estate.address.streetName)}`}</Row>
                        <Row><b>Type: </b> {estatetypes(estate.estateType)}</Row>
                        <Row><b> Owner: </b> {estate.ownerUsername}</Row>
                        <Row><b>Price: <span> &nbsp; </span></b> {estate.price} {estate.advertisementType === 1 ? "M Ft." : estate.advertisementType === 2 ? "Ft. / month" : "Ft. / day"}</Row>
                    </ListGroup.Item>
                    <ListGroup.Item className="col-sm-3 col-md-3 col-lg-3">
                        <Link to={`/estate/${estate.id}`}><Button className="estate-list-button" variant="primary">Read more</Button></Link>
                        <Link to={`/profile/${estate.ownerUsername}`}><Button className="estate-list-button" variant="primary">Owner's profile</Button></Link>
                    </ListGroup.Item>
                </ListGroup>
            </Card.Body>
        </Card>
    )
}