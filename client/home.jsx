import React from 'react';
import AddJoke from './pages/add-joke';
import OldJokes from './pages/old-jokes';
import Setlists from './pages/setlists';
import SignIn from './pages/sign-in';
import Background from './pages/background';
import { parseRoute } from './lib';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash),
      isClicked: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.close = this.close.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({ route: parseRoute(window.location.hash), isClicked: false });
    });
  }

  handleClick() {
    this.setState({ isClicked: !this.state.isClicked });
  }

  renderPage() {
    const { route } = this.state;
    if (route.path === '') {
      return <SignIn />;
    }
    if (route.path === 'addJokes') {
      return <AddJoke />;
    }
    if (route.path === 'oldJokes') {
      return <OldJokes />;
    }
    if (route.path === 'setlists') {
      return <Setlists />;
    }
  }

  close() {
    this.setState({ isClicked: false });
  }

  render() {
    const { route } = this.state;
    return (
     <>
     <div className="main-container">
        <i className="bi bi-list" id={`${this.state.isClicked ? 'hidden' : 'hamburger-button'}`} onClick={this.handleClick}></i>
        <div className={`${this.state.isClicked ? 'container1-is-active' : 'container1'}`}>
        { this.renderPage() }
        </div>
        <Background path={route.path} onSubmit={this.close}/>
     </div>
     </>
    );
  }

}
