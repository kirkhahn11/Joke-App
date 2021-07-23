import React from 'react';

export default class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      isClicked: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.signUp = this.signUp.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signInDemo = this.signInDemo.bind(this);
  }

  handleClick(event) {
    if (event.target.value === 'sign-in') {
      this.setState({ isClicked: false, username: '', password: '' });
    } else {
      this.setState({ isClicked: true, username: '', password: '' });
    }
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value });
  }

  signUp() {
    const newUser = {
      username: this.state.username,
      password: this.state.password
    };
    fetch('/api/jokeApp/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
    })
      .then(res => {
        if (res.status === 400) {
          window.alert('Username and Password are Required Fields');
          throw Error('Username and Password are Required Fields');
        } else if (!res.ok) {
          window.alert('Unexpected Error');
          throw Error('Unexpected Error');
        } else {
          return res.json();
        }
      })
      .then(user => {
        this.setState({ password: '', username: '' });
        window.localStorage.setItem('joke-app-jwt', user.token);
        window.location.hash = '#addJokes';
      })
      .catch(err => console.error(err.message));
  }

  signIn() {
    const user = {
      username: this.state.username,
      unverifiedPassword: this.state.password
    };
    fetch('/api/jokeApp/sign-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
      .then(res => res.json())
      .then(user => {
        if (!user.error) {
          this.setState({ password: '', username: '' });
          window.localStorage.setItem('joke-app-jwt', user.token);
          window.location.hash = '#addJokes';
        } else {
          window.alert(user.error);
          this.setState({ password: '', username: '' });
        }
      })
      .catch(err => console.error(err.message));
  }

  signInDemo() {
    const demoUsername = 'demoAccount';
    const demoPassword = 'demoAccountPassword';
    const user = {
      username: demoUsername,
      password: demoPassword
    };
    fetch('/api/jokeApp/sign-in', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
      .then(res => {
        if (!res.ok) {
          window.alert('Unexpected Error');
          throw Error('Unexpected Error');
        } else {
          return res.json();
        }
      })
      .then(user => {
        if (!user.error) {
          window.localStorage.setItem('joke-app-jwt', user.token);
          window.location.hash = '#addJokes';
        } else {
          window.alert(user.error);
        }
      })
      .catch(err => console.error(err.message));
  }

  render() {
    const signIn = 'sign-in';
    return (
    <div className='container1'>
      <div className="header">
        <h1>Sign In</h1>
      </div>
      <div className="container-fluid">
        <div className="sign-in-container ps-1 pe-1 bg-white rounded m-auto p-2">
        <ul className="nav nav-tabs">
          <li className="nav-item w-50">
            <button className={`${!this.state.isClicked ? 'nav-link active w-100 bg-primary text-white border-2' : 'nav-link w-100 border-2'}`} onClick={this.handleClick} value={signIn} aria-current="page">Sign In</button>
          </li>
          <li className="nav-item w-50">
                <button className={`${this.state.isClicked ? 'nav-link active w-100 bg-primary text-white border-2' : 'nav-link w-100 border-2'}`} onClick={this.handleClick}>Sign Up</button>
          </li>
        </ul>
            <div className={`${!this.state.isClicked ? '' : 'visually-hidden'}`}>
              <div className="mb-3 row mt-5">
                <label className="col-sm-2 lh-37">Username:</label>
                <div className="col-sm-10">
                  <input type="username" name='username' className="form-control" onChange={this.handleChange} value={this.state.username}></input>
                </div>
              </div>
              <div className="mb-3 row">
                <label className="col-sm-2 lh-37">Password:</label>
                <div className="col-sm-10">
                  <input type='password' name='password' className="form-control" onChange={this.handleChange} value={this.state.password}></input>
                </div>
              </div>
              <div className="d-flex flex-column">
                <button type="submit" className="btn btn-primary m-auto mt-1" onClick={this.signIn}>Sign In</button>
                <button type="button" className="btn btn-link link-primary mt-1" onClick={this.signInDemo}>Sign In To Demo Account</button>
              </div>
            </div>
              <div className={`${this.state.isClicked ? 'text-center' : 'visually-hidden'}`}>
                <div className="mb-3 row mt-5">
                  <label className="col-sm-2 lh-37">Username:</label>
                  <div className="col-sm-10">
                    <input type="username" className="form-control" name='username' onChange={this.handleChange} value={this.state.username}></input>
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-2 lh-37">Password:</label>
                  <div className="col-sm-10">
                    <input type='password' className="form-control" name='password' onChange={this.handleChange} value={this.state.password}></input>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary m-auto mt-1" onClick={this.signUp}>Sign Up</button>
              </div>
          </div>
        </div>
    </div>
    );
  }
}
