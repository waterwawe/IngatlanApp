import {ApiCallImage} from '../ApiConstants';

export const getImage = async (imageName) => {
    return await fetch(`${ApiCallImage}/${imageName}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }}).then(response => response.blob());
}