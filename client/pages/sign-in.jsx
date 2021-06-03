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

  signUp(event) {
    event.preventDefault();
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
      .then(res => res.json())
      .then(data => {
        this.setState({ password: '', username: '' });
        window.location.hash = '#addJokes';
      });

  }

  render() {
    const signIn = 'sign-in';
    return (
    <div className='container1'>
      <div className="header">
        <h1>Sign In</h1>
      </div>
      <div className="text-center w-35 m-auto bg-white rounded h-50">
          <ul className="nav nav-tabs">
            <li className="nav-item w-50">
              <button className={`${!this.state.isClicked ? 'nav-link active w-100 bg-primary text-dark border-2' : 'nav-link w-100 border-2'}`} onClick={this.handleClick} value={signIn} aria-current="page">Sign In</button>
            </li>
            <li className="nav-item w-50">
              <button className={`${this.state.isClicked ? 'nav-link active w-100 bg-primary text-dark border-2' : 'nav-link w-100 border-2'}`} onClick={this.handleClick}>Sign Up</button>
            </li>
          </ul>
              <div className={`${!this.state.isClicked ? '' : 'hidden'}`}>
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
                <button type="submit" className="btn btn-primary m-auto mt-1" onClick={this.setlistModal}>Sign In</button>
              </div>
                <div className={`${this.state.isClicked ? '' : 'hidden'}`}>
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
    );
  }
}
