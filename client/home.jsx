import React from 'react';
import AddJoke from './pages/add-joke';
import OldJokes from './pages/old-jokes';
import Setlists from './pages/setlists';
import Background from './pages/background';
import { parseRoute } from './lib';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash)
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({ route: parseRoute(window.location.hash) });
    });
  }

  renderPage() {
    const { route } = this.state;
    if (route.path === '') {
      return <AddJoke />;
    }
    if (route.path === 'oldJokes') {
      return <OldJokes />;
    }
    if (route.path === 'setlists') {
      return <Setlists />;
    }
  }

  render() {
    return (
     <>
     <div className="main-container">
       { this.renderPage() }
        <Background />
     </div>
     </>
    );
  }

}
