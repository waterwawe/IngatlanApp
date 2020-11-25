import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { getMessagesWith, postMessage } from '../Services/MessageService';
import { Form, Spinner, Button, Row } from 'react-bootstrap';

export default function Chat({ otherUser }) {

    const [isLoading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    const getMessages = async () => {

        setLoading(true);
        const response = await getMessagesWith(otherUser);
        if (response.ok) {
            const json = await response.json();
            let dateParsed = [];
            json.map((message) => {
                let date = new Date(message.timeSent);
                let newMessage = message;
                newMessage.timeSent = date;
                dateParsed.push(newMessage);
            });
            setMessages(dateParsed);
        }
        setLoading(false);
    }

    const send = async (event) => {
        event.preventDefault();
        if(message.length <= 0){
            return;
        }
        const response = await postMessage(otherUser, message);
        if (response.ok) {
            getMessages();
        }
        setLoading(false);
    }

    useEffect(() => {
        getMessages();
    }, [otherUser])

    return (
        <Card className="col-sm-12 col-md-12 col-lg-8">
            <Card.Title>
                Messages with {otherUser}
            </Card.Title>
            <Card.Body>
                <Card classname="mb-2">
                    <Card.Title>
                        Send a new message
                    </Card.Title>
                    <Card.Body>
                        <Form onSubmit={send}>
                            <Row className="ml-3">
                                <Form.Control as="textarea" rows="2" placeholder="Enter message here" value={message} onChange={e => { setMessage(e.target.value) }} />
                                <Button className="mt-2" variant="primary" type="submit" disabled={isLoading}>
                                    {isLoading ? <><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />Loading...</> : <>Submit</>}
                                </Button>
                            </Row>
                        </Form>
                    </Card.Body>
                </Card>
                {messages.map((message) => {
                    return (
                        <Card key={message.id} className="message-card text-left">
                            <Card.Title className="ml-3">
                                {message.fromUsername} sent message to {message.toUserName}
                            </Card.Title>
                            <Card.Body>
                                {message.text}
                            </Card.Body>
                            <Card.Footer>
                                sent at: {("0" + message.timeSent.getDate()).slice(-2) + "-" + ("0" + (message.timeSent.getMonth() + 1)).slice(-2) + "-" +
                                    message.timeSent.getFullYear() + " " + ("0" + message.timeSent.getHours()).slice(-2) + ":" + ("0" + message.timeSent.getMinutes()).slice(-2)}
                            </Card.Footer>
                        </Card>
                    );
                })}
            </Card.Body>
        </Card>
    );
}