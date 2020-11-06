import { ApiCallReview } from '../Api';

export const postReview = async (review) =>{
    return await fetch(`${ApiCallReview}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(review)
    });
}

export const getUserReviews = async (username) =>{
    return await fetch(`${ApiCallReview}/${username}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export const getUserReviewCount = async (username) => {
    return await fetch(`${ApiCallReview}/${username}/count`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}