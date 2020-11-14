import React, { useEffect, useState } from 'react'
import { Alert, Card, Form, Button, Spinner } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';

export default function Login({ isLoggedin, signIn }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checkbox, setCheckbox] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [failed, setFailed] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        let user = {
            email: email,
            password: password,
            remember: checkbox
        }
        const ok = await signIn(user);
        if (ok) {
            setFailed(false);
        }
        else
            setFailed(true);

        setLoading(false);
    }

    useEffect(() => {

    }, [isLoggedin, signIn])

    return (isLoggedin ? <Redirect to="/profile" /> :
        <div className="estate-list">
            <Card className="estate-list-card justify-content-space-between col-sm-11 col-md-8 col-lg-6">
                <Card.Title>Login</Card.Title>
                <Card.Body>
                    <Alert variant="danger" show={failed}>
                        Invalid username or password
                    </Alert>
                    <form onSubmit={handleSubmit}>
                        <Form.Group role="form">
                            <Form.Label>Username</Form.Label>
                            <Form.Control isInvalid={email.length <= 0 && !(email.includes("@") && email.includes("."))} isValid={email.length > 0 && email.includes("@") && email.includes(".")} type="emailaddress" placeholder="Enter e-mail address" value={email} onChange={e => { setEmail(e.target.value) }} />
                            <Link to="/register">
                                <Form.Text className="text-muted">
                                    Don't have an account? Click here to register
                                </Form.Text>
                            </Link>
                        </Form.Group>

                        <Form.Group role="form">
                            <Form.Label>Password</Form.Label>
                            <Form.Control required type="password" placeholder="Password" onChange={e => { setPassword(e.target.value) }} />
                        </Form.Group>
                        <Form.Group role="form">
                            <Form.Check type="checkbox" label="Remember me" value={checkbox} onChange={e => { setCheckbox(e.target.checked) }} />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={isLoading}>
                            {isLoading ? <><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />Loading...</> : <>Submit</>}
                        </Button>
                    </form>
                </Card.Body>
            </Card>
        </div>
    )

}