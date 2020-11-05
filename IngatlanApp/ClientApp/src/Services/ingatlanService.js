import { ApiCallItem } from '../Api';

export const getIngatlanDetails = async (id) => {
    return await fetch(`${ApiCallItem}/${id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}