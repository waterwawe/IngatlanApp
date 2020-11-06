import React, { useState, useEffect } from 'react';
import { Reviewtypes } from '../ApiConstants';
import { Alert, Form, Spinner, Button, Collapse, Card, Row, ProgressBar, Container, ListGroup } from 'react-bootstrap';
import EstateList from './EstateList';
import { Link } from 'react-router-dom';
import { postReview, getUserReviews, getUserReviewCount } from '../Services/ReviewService';
import { getUserProfile } from '../Services/AccountService';

export default function ProfileDetail({ isSignedin, userName, match }) {

    const [user, setUser] = useState({});
    const [reviews, setReviews] = useState([]);
    const [reviewCount, setReviewCount] = useState([]);
    const [open, setOpen] = useState(false);
    const [donerev, setDonerev] = useState(false);
    const [doneCount, setDoneCount] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [isFormLoading, setFormLoading] = useState(false);
    const [type, setType] = useState(0);
    const [revComment, setRevComment] = useState();
    const [succes, setSuccess] = useState(false);
    const [doneProfile, setDoneProfile] = useState(false);

    var AllCount = 0;
    var PosCount = 0;
    var NegCount = 0;
    var NeutCount = 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        let review = {
            toUserName: match.params.username,
            type: parseInt(type, 10)
        }

        if (revComment)
            review.comment = revComment;

        const response = await postReview(review);
        if (response.ok)
            setSuccess(true);
        setFormLoading(false);
    }

    const getReviews = async () => {
        setLoading(true);
        if (!open) {
            if (!donerev) {
                const response = await getUserReviews(match.params.username);
                if (response.ok) {
                    const data = await response.json();
                    setReviews(data);
                    setDonerev(true);
                }
            }
        }
        setLoading(false);
        setOpen(!open);
    }

    const getReviewsCount = async () => {
        const response = await getUserReviewCount(match.params.username);
        if (response.ok) {
            const data = await response.json();
            setReviewCount(data);
            setDoneCount(true);
        }
    }

    const getProfile = async () => {
        const response = await getUserProfile(match.params.username);
        if (response.ok) {
            const data = await response.json();
            setUser(data);
            setDoneProfile(true);
        }
    }

    useEffect(() => {
        if (!doneProfile)
            getProfile();
        if (!doneCount)
            getReviewsCount();
    }, [])

    return (
        <div className="estate-list">
            <Card className="estate-list-card justify-content-space-between col-sm-11 col-md-9 col-lg-7">
                <Card.Title>{user.userName}'s profile</Card.Title>
                <Card.Body className="justify-content-start">
                    <Row><p><b>Username:</b> {user.userName}</p></Row>
                    <Row><p><b>Full name:</b> {'' + user.firstName + '  ' + user.lastName}</p></Row>
                    <Row><p><b>E-mail Address:</b> {user.email}</p></Row>
                    <Row><Link to={`/messages/${user.userName}`}><p><b>Send a message!</b></p></Link></Row>
                </Card.Body>
            </Card>
            <Card className="estate-list-card justify-content-space-between col-sm-11 col-md-9 col-lg-7">
                <Card.Title>{user.userName}'s reviews</Card.Title>
                <Card.Body >
                    <Container className="review-body">
                        {user.userName} has {reviewCount.length > 0 ?
                            <>{reviewCount.map((rev) => {
                                if (rev.type === 1) {
                                    PosCount = rev.count;
                                    AllCount += rev.count;
                                    return (<div key={rev.type}> <span> &nbsp; </span> {rev.count + ' '} Positive </div>)
                                }
                                else if (rev.type === 0) {
                                    NeutCount = rev.count;
                                    AllCount += rev.count;
                                    return (<div key={rev.type}> <span> &nbsp; </span> {rev.count + ' '} Neutral </div>)
                                }
                                else {
                                    NegCount = rev.count;
                                    AllCount += rev.count;
                                    return (<div key={rev.type}> <span> &nbsp; </span> {rev.count + ' '} Negative </div>)
                                }
                            })} <span> &nbsp; </span> review(s) </> : <> no reviews</>}.
                </Container>
                    {reviewCount.length > 0 ? <> <ProgressBar className="review-bar">
                        <ProgressBar variant="success" now={(PosCount / AllCount) * 100} key={1} />
                        <ProgressBar variant="warning" now={(NeutCount / AllCount) * 100} key={2} />
                        <ProgressBar variant="danger" now={(NegCount / AllCount) * 100} key={3} />
                    </ProgressBar>
                        <Container>
                            <Button
                                onClick={() => {
                                    getReviews();
                                }}
                                aria-controls="example-collapse-text"
                                aria-expanded={open}
                                disabled={isLoading}
                                className="mb-2"
                            >
                                {isLoading ? <><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />Loading...</> : <>Show all reviews</>}
                            </Button>
                            <Collapse in={open}>
                                <ListGroup id="example-collapse-text">
                                    {reviews.map((rev) => {
                                        return (
                                            <ListGroup.Item key={rev.id}>
                                                <p><b>{rev.fromUserName}</b> gave <b>{rev.toUserName}</b> a <b>{Reviewtypes(rev.type)}</b> review:</p>
                                                <p>{rev.comment}</p>
                                            </ListGroup.Item>
                                        )
                                    })}
                                </ListGroup>
                            </Collapse>
                        </Container> </> : <></>}
                    {(isSignedin && (match.params.username.toLowerCase() !== userName.toLowerCase())) ?
                        <form onSubmit={handleSubmit}>
                            <Form.Group controlId="formBasicEmail" className="mt-2">
                                <Form.Label>Give a user a review</Form.Label>
                                <Form.Control as="select" value={type} onChange={e => { setType(e.target.value); }}>
                                    <option value="1">{Reviewtypes(1)}</option>
                                    <option value="2">{Reviewtypes(2)}</option>
                                    <option value="0">{Reviewtypes(0)}</option>
                                </Form.Control>
                                <Form.Control className="mt-2" as="textarea" rows="3" value={revComment} onChange={e => { setRevComment(e.target.value); }} />
                            </Form.Group>
                            <Button variant="primary" type="submit" disabled={isFormLoading}>
                                {isFormLoading ? <><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />Loading...</> : <>Submit</>}
                            </Button>
                            <Alert show={succes} variant="success">
                                Review succesfully sent!
                 </Alert>
                        </form> : <></>}
                </Card.Body>

            </Card>
            <Card className="estate-list-card justify-content-space-between col-sm-11 col-md-9 col-lg-7">
                <Card.Title>{user.userName}'s advertisements</Card.Title>
                <Card.Body>
                    <EstateList queryobj={{ owner: match.params.username }} />
                </Card.Body>
            </Card>
        </div >
    );
}