import React, { useEffect, useState } from 'react';
import { ApiCallAccount, ApiCallItem, Ingatlantypes, ApiCallImage } from '../Api';
import house from './pics/house.PNG';
import { Carousel, Modal, Button, Card, ListGroup, Container, Image, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Details({ match }) {

  const [details, setDetails] = useState({});
  const [images, setImages] = useState([]);
  const [done, setDone] = useState(false);
  const [username, setUsername] = useState("");
  const [show, setShow] = useState(false);
  const [createdAt, setCreatedAt] = useState(new Date());

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


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

  const getDetails = async () => {
    const response = await fetch(`${ApiCallItem}/${match.params.id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      setDetails(data);
      setCreatedAt(new Date(data.createdAt));
      console.log(images);
      if (data.images) {
        if (data.images.length > 0) {
          if (!done) {
            let imgtemp = [];
            data.images.map(async (image) => {
              await fetch(`${ApiCallImage}/${image}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json'
                }
              }).then(response => response.blob())
                .then(imgs => {
                  console.log(imgtemp);
                  imgtemp = imgtemp.concat(URL.createObjectURL(imgs));
                  setImages(imgtemp);
                });
            });
            setDone(true);
          }
        }
      }
    }
  }

  const getUser = async () => {
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
    setUsername(data.userName);
  }

  useEffect(() => {
    getUser();
    getDetails();
  }, [])

  return (
    <>
      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <Carousel className="detail-image-big-carousel">
            {details.images ? images.map((img) => {
              return (<Carousel.Item key={img}>
                <Image
                  className="detail-image-big"
                  src={img}
                  fluid
                />
              </Carousel.Item>)
            }) : <Image src={house} fluid />}
          </Carousel>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Container className="justify-content-center col-sm-11 col-md-10 col-lg-8">
        <Card className="ingatlan-detail-card" bg="light">
          <Card.Body>
            <Card.Title>{details.title}</Card.Title>
            <Carousel className="detail-image-carousel col-sm-11 col-md-10 col-lg-8">
              {details.images ? images.map((img) => {
                return (<Carousel.Item key={img}>
                    <Image
                      className="detail-image"
                      src={img}
                      fluid
                      onClick={handleShow}
                    />
                </Carousel.Item>)
              }) : <Image src={house} fluid thumbnail />}
            </Carousel>
            <ListGroup>
              {details.ingatlanType ?
                <ListGroup.Item>
                  <Row><b>Type: <span> &nbsp; </span></b> {Ingatlantypes(details.ingatlanType)}</Row>
                </ListGroup.Item> : <></>}
              {details.price ?
                <ListGroup.Item>
                  <Row><b>Price: <span> &nbsp; </span></b> {details.price} M Ft.</Row>
                </ListGroup.Item> : <></>}
              {details.address ?
                <ListGroup.Item>
                  <Row><b>Address: <span> &nbsp; </span></b> {`${titleCase(details.address.city)}, ${romanize(details.address.district)}. ,${titleCase(details.address.streetName)}`} {details.address.streetNumber ? `${details.address.streetNumber}.` : <></>} </Row>
                </ListGroup.Item> : <></>}
              {details.description ?
                <ListGroup.Item>
                  <Row><b>Description: <span> &nbsp; </span></b></Row>
                  <Row>{details.description}</Row>
                </ListGroup.Item> : <></>}

              {details.ownerUsername ?
                <ListGroup.Item>
                  <Row><b>Owner: <span> &nbsp; </span></b> <Link to={`/profile/${details.normalizedOwnerUsername}`} >{details.ownerUsername}</Link></Row>
                </ListGroup.Item> : <></>}
              {details.createdAt ?
                <ListGroup.Item>
                  <Row><b>Available since: <span> &nbsp; </span></b> {("0" + createdAt.getDate()).slice(-2) + "-" + ("0"+(createdAt.getMonth()+1)).slice(-2) + "-" +
    createdAt.getFullYear() + " " + ("0" + createdAt.getHours()).slice(-2) + ":" + ("0" + createdAt.getMinutes()).slice(-2)}</Row>
                </ListGroup.Item> : <></>}

            </ListGroup>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}