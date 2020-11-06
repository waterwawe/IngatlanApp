import { ApiCallAccount } from '../Api'

export const getLoggedIn = async () => {
    return await fetch(ApiCallAccount + "/isloggedin", {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Accept-Encoding': 'gzip, deflate, br'
        }
    });
}