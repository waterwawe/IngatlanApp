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

export const getProfile = async () => {
    return await fetch(ApiCallAccount + "/profile", {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export const getUserProfile = async (username) => {
    return await fetch(ApiCallAccount + `/profile/${username}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export const registerProfile = async (user) => {
    return await fetch(`${ApiCallAccount}/register`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(user)
    });
}

export const logout = async () => {
    return await fetch(ApiCallAccount + "/logout", {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export const login = async (user) =>{
   return await fetch(ApiCallAccount + "/login", {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Accept-Encoding': 'gzip, deflate, br'
        },
        body: JSON.stringify(user)
      });
}