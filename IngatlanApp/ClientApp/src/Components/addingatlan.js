import React, { useEffect, useState } from 'react'
import { ApiCallItem, Ingatlantypes, Streettypes } from '../Api';
import { Card, Spinner, ListGroup, Form, Alert, Button, Row } from 'react-bootstrap';

export default function AddIngatlan({ isLoggedIn }) {

    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [title, setTitle] = useState("");
    const [city, setCity] = useState("");
    const [district, setDistrict] = useState(0);
    const [districts, setDistricts] = useState([]);
    const [streetName, setStreetName] = useState("");
    const [streetType, setStreetType] = useState(0);
    const [streetNumber, setStreetNumber] = useState();
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState();
    const [type, setType] = useState(1);
    const [touched, setTouched] = useState(false);

    const getDistricts = () => {
        let distarray = [];
        for (let i = 0; i <= 23; i++) {
            distarray.push(i);
        }
        return distarray;
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

    const upload = async (e) => {
        e.preventDefault();
        setLoading(true);
        let ingatlan = {};
        ingatlan.title = title;
        ingatlan.address = {};
        ingatlan.address.city = city;
        ingatlan.address.district = parseInt(district, 10);
        ingatlan.address.streetName = streetName;
        ingatlan.address.streetType = streetType;
        ingatlan.address.streetNumber = streetNumber;
        ingatlan.price = parseFloat(price);
        ingatlan.ingatlanType = parseInt(type, 10);
        ingatlan.description = description;

        const response = await fetch(`${ApiCallItem}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ingatlan)
        });

        if (response.ok)
            setError(false);
        else
            setError(true);
        setLoading(false);
    }

    useEffect(() => {
        setDistricts(getDistricts());
    }, [])

    return (
        <div className="ingatlan-list">{isLoggedIn ?
            <Card className="ingatlan-list-card justify-content-space-between col-sm-11 col-md-8 col-lg-6">
                <Card.Title>Upload a new estate</Card.Title>
                <Card.Body>
                    <form onSubmit={upload}>
                        <Form.Group role="form">
                            <ListGroup>
                                <ListGroup.Item>
                                    <Form.Label>Give your advertisement a title</Form.Label>
                                    <Form.Control required isInvalid={touched && title.length < 4} isValid={title.length >= 4} type="text" placeholder="Eg: Sunny apartmanet in Budapest for sale" value={title} onChange={e => { setTouched(true); setTitle(e.target.value); }} />
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Form.Label>Your estate's location</Form.Label>
                                    <Form.Control required isInvalid={touched && city.length < 3} isValid={city.length >= 3} type="text" placeholder="Enter city" value={city} onChange={e => { setTouched(true); setCity(e.target.value); }} />
                                    {city.toLocaleLowerCase() === "budapest" ? (<div><Form.Label>Select district</Form.Label>
                                        <Form.Control isInvalid={touched && district === 0} isValid={district !== 0} as="select" value={district} onChange={e => { setTouched(true); setDistrict(e.target.value); }}>
                                            {districts.map((district) => {
                                                if (district === 0)
                                                    return (<option disabled value="0" key="0" >Select one</option>)
                                                else
                                                    return (<option value={district} key={district}>{romanize(district)}</option>)
                                            })}
                                        </Form.Control></div>) : <></>}
                                    <div className="row mt-1 mb-1">
                                        <div className="col-8">
                                            <Form.Label>Give your street name</Form.Label>
                                            <Form.Control required isInvalid={touched && title.length < 4} isValid={title.length >= 4} type="text" value={streetName} onChange={e => { setTouched(true); setStreetName(e.target.value); }} />
                                        </div>
                                        <div className="col-4">
                                            <Form.Label>Give your street number</Form.Label>
                                            <Form.Control required isInvalid={touched && title.length < 4} isValid={title.length >= 4} type="number" min="1" value={streetNumber} onChange={e => { setTouched(true); setStreetNumber(e.target.value); }} />
                                        </div>
                                    </div>
                                    <Form.Label>Your street's type</Form.Label>
                                    <Form.Control as="select" value={type} onChange={e => { setTouched(true); setStreetType(e.target.value); }}>
                                        <option value="2">{Streettypes(1)}</option>
                                        <option value="3">{Streettypes(2)}</option>
                                        <option value="4">{Streettypes(3)}</option>
                                    </Form.Control>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Form.Label>Your desired price</Form.Label>
                                    <Row><Form.Control required isInvalid={touched && price <= 0} isValid={price > 0} className="price-input ml-3 col-sm-9 col-md-6 col-lg-4" type="number" min="0" step="0.1" placeholder="XX.XX" value={price} onChange={e => { setTouched(true); setPrice(e.target.value); }} /> M. Ft.</Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Form.Label>Your estate's type</Form.Label>
                                    <Form.Control as="select" value={type} onChange={e => { setTouched(true); setType(e.target.value); }}>
                                        <option value="1">{Ingatlantypes(1)}</option>
                                        <option value="2">{Ingatlantypes(2)}</option>
                                        <option value="3">{Ingatlantypes(3)}</option>
                                        <option value="4">{Ingatlantypes(4)}</option>
                                        <option value="5">{Ingatlantypes(5)}</option>
                                    </Form.Control>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Form.Label>Give some description of your estate</Form.Label>
                                    <Form.Control required isInvalid={touched && description.length < 4} isValid={description.length >= 4} as="textarea" rows="3" value={description} onChange={e => { setTouched(true); setDescription(e.target.value); }} />
                                </ListGroup.Item>
                            </ListGroup>
                            <Alert variant="danger" show={error}>An error occured</Alert>
                            <Button variant="primary" className="text-left mt-2" type="submit">
                                {isLoading ? <><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />Loading...</> : <>Submit</>}
                            </Button>
                        </Form.Group>
                    </form>
                </Card.Body>
            </Card>
            : <p>You are not logged in.</p>}
        </div>
    );

}