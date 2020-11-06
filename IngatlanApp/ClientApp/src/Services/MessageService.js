import { ApiCallMessage } from '../ApiConstants';

export const getMessagesWith = async (otherUser) => {
    return await fetch(`${ApiCallMessage}?otheruser=${otherUser}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        method: 'GET'
    });
}

export const postMessage = async (toUser, message) => {
    return await fetch(`${ApiCallMessage}?to=${toUser}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(message)
    });
}

export const getUsers = async () => {
    return await fetch(`${ApiCallMessage}/users`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        method: 'GET'
    });
}