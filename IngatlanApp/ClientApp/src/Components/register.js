import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Spinner, Alert, Form, Button, Card } from 'react-bootstrap';
import { useHistory } from "react-router-dom";
import { registerProfile } from '../Services/AccountService';

export default function Register({ signIn, isLoggedin }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [touched, setTouched] = useState(false);

  let history = useHistory();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let user = {
      email: email,
      username: username,
      password: password,
      confirmpassword: confirm,
      firstname: FirstName,
      lastname: LastName
    }
    const response = registerProfile(user);
    if (response.ok) {
      await signIn(user);
      history.push("/profile");
    }

    if (!response.ok) {
      setError(true);
    }

    setLoading(false);
  }

  return (
    <div className="estate-list">{isLoggedin ? <Redirect to="/profile" /> :
      <Card className="estate-list-card justify-content-space-between col-sm-11 col-md-8 col-lg-6">
        <Card.Title>Register</Card.Title>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>E-mail address</Form.Label>
              <Form.Control required isInvalid={touched && !(email.includes("@") && email.includes("."))} isValid={email.length > 0 && email.includes("@") && email.includes(".")} type="email" placeholder="Enter email address" value={email} onChange={e => { setTouched(true); setEmail(e.target.value) }} />
              <Form.Label>Username</Form.Label>
              <Form.Control required isInvalid={touched && username.length <= 4} isValid={username.length > 4} type="text" placeholder="Enter username" value={username} onChange={e => { setTouched(true); setUsername(e.target.value) }} />
            </Form.Group>

            <Form.Group>
              <Form.Label>First name</Form.Label>
              <Form.Control required isInvalid={touched && FirstName.length < 4} isValid={FirstName.length >= 4} type="text" placeholder="Enter first name" value={FirstName} onChange={e => { setTouched(true); setFirstName(e.target.value) }} />
              <Form.Label>Last name</Form.Label>
              <Form.Control required isInvalid={touched && LastName.length < 4} isValid={LastName.length >= 4} type="text" placeholder="Enter last name" value={LastName} onChange={e => { setTouched(true); setLastName(e.target.value) }} />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">


              <Form.Label>Password</Form.Label>
              <Form.Control required isInvalid={touched && password.length < 8} isValid={password.length >= 8} placeholder="Enter password" value={LastName} type="password" value={password} onChange={e => { setTouched(true); setPassword(e.target.value) }} />
              <Form.Label>Confirm</Form.Label>
              <Form.Control required isInvalid={touched && (confirm.length < 8 || confirm !== password)} isValid={password.length >= 8 && confirm === password} type="password" placeholder="Confirm Password" value={confirm} onChange={e => { setTouched(true); setConfirm(e.target.value) }} />
            </Form.Group>
            <Alert variant="danger" show={error}>An error occured</Alert>
            <Button variant="primary" type="submit">
              {isLoading ? <><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />Loading...</> : <>Submit</>}
            </Button>
          </Form>
        </Card.Body>
      </Card>}
    </div>
  )
}