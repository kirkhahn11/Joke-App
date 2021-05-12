import React from 'react';
import { parseRoute } from '../lib';

export default class Background extends React.Component {
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

  render() {
    const { route } = this.state;
    if (route.path === '') {
      return (
      <div className="container-fluid background-fixed">
        <div className="btn-group-vertical gap-3 mt-3">
          <a href={''}>
            <button className="back-btn btn-primary">New Joke</button>
          </a>
          <a href={'#oldJokes'}>
           <button className="back-btn btn-light">Old Jokes</button>
          </a>
          <a href={'#setlists'}>
           <button className="back-btn btn-ligth">Setlists</button>
          </a>
        </div>
      </div>
      );
    }
    if (route.path === 'oldJokes') {
      return (
        <div className="container-fluid background-fixed hidden">
          <div className="btn-group-vertical gap-3 mt-3">
            <a href={''}>
              <button className="back-btn btn-light">New Joke</button>
            </a>
            <a href={'#oldJokes'}>
              <button className="back-btn btn-primary">Old Jokes</button>
            </a>
            <a href={'#setlists'}>
              <button className="back-btn btn-ligth">Setlists</button>
            </a>
          </div>
        </div>
      );
    }
    if (route.path === 'setlists') {
      return (
        <div className="container-fluid background-fixed hidden">
          <div className="btn-group-vertical gap-3 mt-3">
            <a href={''}>
              <button className="back-btn btn-ligth">New Joke</button>
            </a>
            <a href={'#oldJokes'}>
              <button className="back-btn btn-light">Old Jokes</button>
            </a>
            <a href={'#setlists'}>
              <button className="back-btn btn-primary">Setlists</button>
            </a>
          </div>
        </div>
      );
    }
  }
}
