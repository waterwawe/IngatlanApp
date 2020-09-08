import React,{useState,useEffect} from 'react';
import {Button,Card,Row,Image, ListGroup} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import house from './pics/house.PNG';
import {Ingatlantypes,ApiCallImage} from '../Api';

export default function IngatlanThumbnail({ingatlan}){

    const[thumbnail, setThumbnail] = useState();
    const[done, setDone] = useState(false);

    function titleCase(str) {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
        }
        return splitStr.join(' '); 
     }

    function romanize (num) {
        if (isNaN(num))
            return NaN;
        var digits = String(+num).split(""),
            key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
                   "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
                   "","I","II","III","IV","V","VI","VII","VIII","IX"],
            roman = "",
            i = 3;
        while (i--)
            roman = (key[+digits.pop() + (i * 10)] || "") + roman;
        return Array(+digits.join("") + 1).join("M") + roman;
    }

    const getThumbnail = async () =>{
        if(ingatlan.images){
            if(ingatlan.images.length > 0){
                if(!done){
                    const response = await fetch(`${ApiCallImage}/${ingatlan.images[0]}`, {
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
        }
        setDone(true);
    }

    useEffect(() => {
       getThumbnail();
    }, [])

    return(
        <Card className="ingatlan-list-card">
            <Card.Title>{ingatlan.title}</Card.Title>
            <Card.Body className ="justify-content-center">
                <ListGroup horizontal>
                <ListGroup.Item className="col-sm-3 col-md-4 col-lg-5">
                    <Image className="ingatlan-list-card-image" src={ingatlan.images?ingatlan.images.length>0?thumbnail:house:house} fluid thumbnail />
                </ListGroup.Item>
                <ListGroup.Item className="justify-content-start col-sm-6 col-md-5 col-lg-4">
                    <Row><b>Address: </b> {`${titleCase(ingatlan.address.city)}, ${romanize(ingatlan.address.district)} ,${titleCase(ingatlan.address.streetName)}`}</Row>
                    <Row><b>Type: </b> {Ingatlantypes(ingatlan.ingatlanType)}</Row>
                    <Row><b> Owner: </b> {ingatlan.ownerUsername}</Row>
                    <Row><b>Price: </b> {ingatlan.price} M Ft.</Row>
                </ListGroup.Item>
                <ListGroup.Item className="col-sm-3 col-md-3 col-lg-3">
                <Link to={`/ingatlan/${ingatlan.id}`}><Button className="ingatlan-list-button" variant="primary">Read more</Button></Link>
                <Link to={`/profile/${ingatlan.ownerUsername}`}><Button className="ingatlan-list-button" variant="primary">Owner's profile</Button></Link>
                </ListGroup.Item>
                </ListGroup>
            </Card.Body>
        </Card>
    )
}