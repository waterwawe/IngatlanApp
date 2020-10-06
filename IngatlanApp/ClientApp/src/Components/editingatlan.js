import React, { useState, useEffect } from 'react';
import { ApiCallAccount, ApiCallItem, ApiCallImage, Ingatlantypes } from '../Api';
import { Alert, Container, Row, Popover, OverlayTrigger, ListGroup, Form, Card, Modal, Spinner, Button, Badge } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import Map from './editmap';

export default function Edit({ match }) {
  const [file, setFile] = useState();
  const [success, setSuccess] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [details, setDetails] = useState({});
  const [images, setImages] = useState([]);
  const [done, setDone] = useState(false);
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showHighlight, setShowhighlight] = useState(false);
  const [selected, setSelected] = useState({})
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState();
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();
  const [displayTextArea, setDisplayTextArea] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);

  const handleCloseHighlight = () => setShowhighlight(false);
  const handleShowHighlight = () => setShowhighlight(true);

  const showTextArea = () => setDisplayTextArea(true);

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

  const getDistricts = () => {
    let distarray = [];
    for (let i = 0; i <= 23; i++) {
      distarray.push(i);
    }
    return distarray;
  }

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
      setTitle(data.title);
      setDescription(data.description);
      setPrice(data.price);
      setLongitude(parseFloat(data.address.longitude));
      setLatitude(parseFloat(data.address.latitude));
      if (!(data.address.longitude && data.address.latitude)) {
        getCurrentLocation();
      }
      if (data.images) {
        if (data.images.length > 0) {
          if (!done) {
            let imgtemp = [];
            data.images.map(async (image) => {
              const response = await fetch(`${ApiCallImage}/${image}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json'
                }
              }).then(response => response.blob())
                .then(imgs => {
                  imgtemp = imgtemp.concat({ name: image, url: URL.createObjectURL(imgs) });
                  setImages(imgtemp);
                });
            });
            setDone(true);
          }
        }
      }
    }
  }

  async function updateLocation(lng, lat) {
    setLongitude(parseFloat(lng));
    setLatitude(parseFloat(lat));
    setLoading(true);
    let ingatlan = JSON.parse(JSON.stringify(details));
    if (lng && lat)
      ingatlan.address.longitude = parseFloat(lng);
    ingatlan.address.latitude = parseFloat(lat);
    console.log(ingatlan);

    const response = await fetch(`${ApiCallItem}/${details.id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ingatlan)
    });
    setLoading(false);
  }

  const uploadImage = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("File", file);
    console.log(formData);
    console.log(file);

    const response = await fetch(`${ApiCallItem}/${match.params.id}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
      },
      body: formData
    });
    if (response.ok) {
      setSuccess(true);
      const data = await response.json();
      setDetails(data);
      getImage(data.images);
    }
    setLoading(false);
  }

  const removeImage = async () => {

    const response = await fetch(`${ApiCallItem}/image?name=${selected.name}&id=${match.params.id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
      }
    });
    if (response.ok) {
      const index = images.indexOf(selected);
      if (index > -1) {
        images.splice(index, 1);
      }
      setSuccess(true);
    }

    setShow(false);
  }

  const removeIngatlan = async () => {
    const response = await fetch(`${ApiCallItem}/${match.params.id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
      }
    });
    if (response.ok) {
      setRedirect(true);
    }

    handleCloseDelete();
  }

  const closeTextArea = () => {
    setDisplayTextArea(false);
  }

  const highlight = async (type) => {
    const response = await fetch(`${ApiCallItem}/${details.id}/highlight?highlightType=${type}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      handleCloseHighlight();
      setSuccess(true);
    }
  }

  const getImage = async (imgarray) => {
    let imgtemp = [];
    imgarray.map(async (image) => {
      const response = await fetch(`${ApiCallImage}/${image}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.blob())
        .then(imgs => {
          imgtemp = imgtemp.concat({ name: image, url: URL.createObjectURL(imgs) });
          setImages(imgtemp);
        });
    });
  }

  const getCurrentLocation = () => {
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const coords = pos.coords;
        console.log(coords);
        setLongitude(coords.longitude);
        setLatitude(coords.latitude);
      });
    }
  }

  const updateIngatlan = async (e) => {
    e.preventDefault();
    setLoading(true);
    let ingatlan = JSON.parse(JSON.stringify(details));
    ingatlan.title = title;
    ingatlan.price = parseFloat(price);
    ingatlan.description = description;

    const response = await fetch(`${ApiCallItem}/${details.id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ingatlan)
    });
    setLoading(false);

  }

  const popoverTitle = (
    <Popover id="popover-basic">
      <Popover.Title className="edit-list-item" as="h3">Edit title</Popover.Title>
      <Popover.Content>
        <Form onSubmit={updateIngatlan}>
          <Form.Control className="edit-list-item" value={title} onChange={e => { setTitle(e.target.value) }} />
          <Button className="edit-list-item" type="submit">Change</Button>
        </Form>
      </Popover.Content>
    </Popover>
  );

  const popoverPrice = (
    <Popover id="popover-basic">
      <Popover.Title className="edit-list-item" as="h3">Edit price</Popover.Title>
      <Popover.Content>
        <Form onSubmit={updateIngatlan}>
          <Row><Form.Control className="edit-list-item col-4" type="number" min="0" step="0.1" placeholder="XX.XX" value={price} onChange={e => { setPrice(e.target.value); }} /> M. Ft.</Row>
          <Button className="edit-list-item" type="submit">Change</Button>
        </Form>
      </Popover.Content>
    </Popover>
  );

  useEffect(() => {
    getDistricts();
    getUser();
    getDetails();
  }, [])

  return (
    <Container className="justify-content-center col-sm-11 col-md-10 col-lg-8">
      {username === details.ownerUsername ?
        <>
          {redirect ? <Redirect to="/manage" /> : <></>}
          <Alert show={success} variant="success">Your advertisement, has been succesfully modified!</Alert>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Delete image</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete the image?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
                      </Button>
              <Button variant="danger" onClick={removeImage}>
                Delete
                    </Button>
            </Modal.Footer>
          </Modal>
          <Modal show={showDelete} onHide={handleCloseDelete}>
            <Modal.Header closeButton>
              <Modal.Title>Delete advertisement</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete the whole advertisement?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseDelete}>
                Cancel
                      </Button>
              <Button variant="danger" onClick={removeIngatlan}>
                Delete
                    </Button>
            </Modal.Footer>
          </Modal>
          <Modal show={displayTextArea} onHide={closeTextArea}>
            <Modal.Header closeButton>
              <Modal.Title>Edit description</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={updateIngatlan}>
                <Form.Control as="textarea" rows="3" value={description} onChange={e => { setDescription(e.target.value) }} />
                <Button className="edit-list-item" type="submit">Change</Button>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeTextArea}>
                Cancel
                      </Button>
            </Modal.Footer>
          </Modal>
          <Modal show={showHighlight} onHide={handleCloseHighlight}>
            <Modal.Header closeButton>
              <Modal.Title>Highlight your advertisement</Modal.Title>
            </Modal.Header>
            <Modal.Body>What time would you want to highlight your ad?
              <Row className="mt-2 mb-2">
                <Button className="ml-2 mr-2" onClick={e => { highlight(0); }}>Highlight for a day</Button> - 25 Credits
              </Row>
              <Row className="mt-2 mb-2">
                <Button className="ml-2 mr-2" onClick={e => { highlight(1); }}>Highlight for a week</Button> - 100 Credits
              </Row>
              <Row className="mt-2 mb-2">
                <Button className="ml-2 mr-2" onClick={e => { highlight(2); }}>Highlight for a month</Button> - 300 Credits
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseHighlight}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
          <Card className="margin-10px">
            <Card.Title>Upload a new photo or delete existing ones</Card.Title>
            <Card.Body>
              <Row className="edit-images">
                {images.map((img) => {
                  return (<Card key={img.name}>
                    <Card.Img className="edit-image" variant="top" src={img.url} />
                    <Card.Body>
                      <Button variant="danger" onClick={() => { setSelected(img); handleShow(); }}>Remove</Button>
                    </Card.Body>
                  </Card>)
                })}
              </Row>
              <Row>
                <form onSubmit={uploadImage} className="upload-image">
                  <Form.Group role="form">
                    <input type="file" accept=".jpg,.gif,.png" onChange={e => { setFile(e.target.files[0]) }} />
                    <Button variant="primary" type="submit" disabled={isLoading}>
                      {isLoading ? <><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />Loading...</> : <>Submit</>}
                    </Button>
                  </Form.Group>
                </form>
              </Row>
            </Card.Body>
          </Card>
          <Card className="ingatlan-detail-card mt-2 mb-2">
            <Card.Body>
              <ListGroup className="edit-list">
                <ListGroup.Item>
                  <Button className="ml-2 mr-2" onClick={handleShowHighlight}>Highlight your ad!</Button>
                </ListGroup.Item>
                {details.title ?
                  <ListGroup.Item>
                    <Row><b>Title: <span> &nbsp; </span></b> {`${details.title} `}
                      <span> &nbsp; </span><OverlayTrigger trigger="click" placement="right" overlay={popoverTitle}>
                        <Badge variant="primary" className="edit-button">Edit</Badge>
                      </OverlayTrigger></Row>
                  </ListGroup.Item> : <></>}
                {details.ingatlanType ?
                  <ListGroup.Item>
                    <Row><b>Type: <span> &nbsp; </span></b> {Ingatlantypes(details.ingatlanType)}</Row>
                  </ListGroup.Item> : <></>}
                {details.price ?
                  <ListGroup.Item>
                    <Row><b>Price: <span> &nbsp; </span></b> {details.price} {details.advertisementType === 1 ? "M Ft." : details.advertisementType === 2 ? "Ft. / month" : "Ft. / day"}
                      <span> &nbsp; </span><OverlayTrigger trigger="click" placement="right" overlay={popoverPrice}>
                        <Badge variant="primary" className="edit-button">Edit</Badge>
                      </OverlayTrigger>
                    </Row>
                  </ListGroup.Item> : <></>}
                {details.address ?
                  <ListGroup.Item>
                    <Row><b>Address: <span> &nbsp; </span></b> {`${titleCase(details.address.city)}, ${romanize(details.address.district)}. ,${titleCase(details.address.streetName)}`} {details.address.streetNumber ? `${details.address.streetNumber}.` : <></>} </Row>
                  </ListGroup.Item> : <></>}
                {details.description ?
                  <ListGroup.Item>
                    <Row><b>Description: <span> &nbsp; </span></b> <Badge variant="primary" onClick={showTextArea}>Edit</Badge></Row>
                    {displayTextArea ?
                      <Form>
                        <Form.Control as="textarea" value={description} onChange={e => { setDescription(e.target.value) }} rows="3" />
                      </Form>
                      : <Row>{details.description}</Row>}
                  </ListGroup.Item> : <></>}

                {details.ownerUsername ?
                  <ListGroup.Item>
                    <Row><b>Owner: <span> &nbsp; </span></b> <Link to={`/profile/${details.normalizedOwnerUsername}`} >{details.ownerUsername}</Link></Row>
                  </ListGroup.Item> : <></>}
                <ListGroup.Item>
                  <Button variant="danger" onClick={handleShowDelete}>Delete this ad</Button>
                </ListGroup.Item>

              </ListGroup>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="edit-map">
              <Map updateLocation={updateLocation} center={{
                lat: latitude,
                lng: longitude
              }} />
            </Card.Body>
          </Card>
        </> :
        <Card>
          <Card.Body>You are not the owner of this ad.</Card.Body>
        </Card>
      }

    </Container >
  )
}