import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function UserList({ userlist, activeUser, refresh }) {

    return (
        <ListGroup as="ul" className="user-list col-sm-11 col-md-4 col-lg-4">
            {userlist.map((user) => {
                return (
                    <Link key={user.value} to={`/messages/${user.value}`} onClick={refresh()}>
                    <ListGroup.Item as="li" active={activeUser === user.value ? true : false}>
                    {user.value}
                    </ListGroup.Item>
                    </Link>
                );
            })}
        </ListGroup>
    );
}