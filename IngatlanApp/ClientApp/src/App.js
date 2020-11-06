import React, { useState, useEffect } from 'react';
import { ApiCallAccount } from './Api';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import LoginForm from './Components/LoginForm';
import Logout from './Components/Logout';
import Register from './Components/Register';
import Profile from './Components/Profile';
import Search from './Components/Search';
import Home from './Components/Home';
import Detail from './Components/EstateDetail';
import ProfileDetail from './Components/ProfileDetail';
import Addestate from './Components/AddEstate';
import Editestate from './Components/EditEstate';
import Manage from './Components/Manage';
import Messages from './Components/Messages';
import SearchMap from './Components/SearchMap';
import './App.css';

function App() {
  const [isLoggedin, setLoggedin] = useState(false);
  const [username, setUsername] = useState("");

  const getLoggedin = async () => {
    const response = await fetch(ApiCallAccount + "/isloggedin", {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Accept-Encoding': 'gzip, deflate, br'
      }
    });
    const data = await response.json();
    setLoggedin(data.isLoggedIn);
    if (data.isLoggedIn)
      setUsername(data.userName);
  }

  const logout = async () => {
    await fetch(ApiCallAccount + "/logout", {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    setLoggedin(false);
  }


  const login = async (user) => {
    const response = await fetch(ApiCallAccount + "/login", {
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
    if (response.ok)
      setLoggedin(true);
    return response.ok;
  }

  useEffect(() => {
    getLoggedin();
  }, []);

  return (
    <div className="App">
      <Router>
        <Navbar loggedinState={isLoggedin} username={username} />
        <Switch>
          <Route exact path="/"><Home /></Route>
          <Route path="/estate/:id" exact component={Detail} />
          <Route path="/estate/:id/edit" component={Editestate} />
          <Route path="/newestate"><Addestate isLoggedIn={isLoggedin}></Addestate></Route>
          <Route path="/search"><Search /></Route>
          <Route path="/map" component={SearchMap}/>
          <Route path="/login"><LoginForm isLoggedin={isLoggedin} signIn={login} /></Route>
          <Route path="/logout"><Logout signout={logout} /></Route>
          <Route path="/register"><Register signIn={login} isLoggedIn={isLoggedin} /></Route>
          <Route path="/profile" exact><Profile isSignedin={isLoggedin} /></Route>
          <Route path="/manage"><Manage username={username} /></Route>
          <Route path="/messages" exact component={Messages} />
          <Route path="/messages/:user" component={Messages} />
          <Route path="/profile/:username" render={(props) => <ProfileDetail{...props} userName={username} isSignedin={isLoggedin} />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
