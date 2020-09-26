import React, { useState, useEffect } from 'react';
import { Button, Card, Row, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import house from './pics/house.PNG';
import { ApiCallItem, ApiCallImage } from '../Api';

export default function IngatlanThumbnail({ ingatlan }) {

    const [thumbnail, setThumbnail] = useState();
    const [viewCount, setViewCount] = useState(0);
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
        if (!done) {
            if (ingatlan.images) {
                if (ingatlan.images.length > 0) {
                    await fetch(`${ApiCallImage}/${ingatlan.images[0]}`, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(response => response.blob())
                        .then(images => {
                            setThumbnail(URL.createObjectURL(images))
                        });
                }
            }
            
            const response = await fetch(`${ApiCallItem}/viewcount/?id=${ingatlan.id}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(response.ok){
                const json = await response.json()
                setViewCount(json.views);
            }
        }
        setDone(true);
    }

    useEffect(() => {
        getThumbnail();
    }, [])

    return (
        <Card className="manage-list-card">
            <Card.Title>{ingatlan.title}</Card.Title>
            <Card.Body className="justify-content-start">
                <Image src={ingatlan.images ? ingatlan.images.length > 0 ? thumbnail : house : house} fluid thumbnail />
                <Row><b>Address: </b> {`${titleCase(ingatlan.address.city)}, ${romanize(ingatlan.address.district)} ,${titleCase(ingatlan.address.streetName)}`}</Row>
                <Row><b>Price: </b> {ingatlan.price} M. Ft.</Row>
                <Row><b>Views:</b>{viewCount}</Row>
                <Link to={`/ingatlan/${ingatlan.id}/edit`}><Button variant="primary">Edit</Button></Link>
            </Card.Body>
        </Card>
    )
}