import React,{useState,useEffect} from 'react';
import {ApiCallAccount} from './Api';
import {HashRouter as Router, Switch, Route} from 'react-router-dom';
import Navbar from './Components/navbar';
import LoginForm from './Components/loginform';
import Logout from './Components/logout';
import Register from './Components/register';
import Profile from './Components/profile';
import Search from './Components/search';
import Home from './Components/home';
import Detail from './Components/ingatlandetail';
import ProfileDetail from './Components/profiledetail';
import AddIngatlan from './Components/addingatlan';
import EditIngatlan from './Components/editingatlan';
import Manage from './Components/manage';
import Messages from './Components/messages';
import './App.css';

function App() {
  const [isLoggedin, setLoggedin] = useState(false);
  const [username, setUsername] = useState("");

  const getLoggedin = async () => {
    const response = await fetch(ApiCallAccount+"/isloggedin", {
      method: 'GET', 
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control':'no-cache',
        'Connection': 'keep-alive',
        'Accept-Encoding' : 'gzip, deflate, br'
      }
    });
    const data = await response.json();
    setLoggedin(data.isLoggedIn);
    if(data.isLoggedIn)
      setUsername(data.userName);
  }

  const logout = async () =>{
    await fetch(ApiCallAccount+"/logout", {
      method: 'GET', 
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    setLoggedin(false);
  }


  const login = async (user) => {
    const response = await fetch(ApiCallAccount+"/login", {
      method: 'POST', 
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control':'no-cache',
        'Connection': 'keep-alive',
        'Accept-Encoding' : 'gzip, deflate, br'
      },
      body: JSON.stringify(user)
    });
    if(response.ok)
      setLoggedin(true);
    return response.ok;
  }

  useEffect(() => {
    getLoggedin();
  }, []);

  return (
    <div className="App">
      <Router>
      <Navbar loggedinState ={isLoggedin} username={username}/>
        <Switch>
        <Route exact path="/"><Home /></Route>
        <Route path="/ingatlan/:id" exact component={Detail}/>
        <Route path="/ingatlan/:id/edit" component={EditIngatlan}/>
        <Route path="/newingatlan"><AddIngatlan isLoggedIn={isLoggedin}></AddIngatlan></Route>
        <Route path= "/search"><Search /></Route>
        <Route path="/login"><LoginForm isLoggedin={isLoggedin} signIn = {login} /></Route>
        <Route path="/logout"><Logout signout = {logout}/></Route>
        <Route path="/register"><Register signIn={login} isLoggedIn={isLoggedin}/></Route>
        <Route path="/profile" exact><Profile isSignedin={isLoggedin}/></Route>
        <Route path="/manage"><Manage username ={username}/></Route>
        <Route path="/messages" exact component={Messages} />
        <Route path="/messages/:user" component={Messages} />
        <Route path="/profile/:username" render={(props) => <ProfileDetail{... props} userName={username} isSignedin = {isLoggedin} />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
