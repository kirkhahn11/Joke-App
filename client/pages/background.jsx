import React from 'react';

export default class Background extends React.Component {

  newJokeColor() {
    if (this.props.path === 'addJokes') {
      return 'back-btn btn-primary';
    } else {
      return 'back-btn btn-light';
    }
  }

  oldJokesColor() {
    if (this.props.path === 'oldJokes') {
      return 'back-btn btn-primary';
    } else {
      return 'back-btn btn-light';
    }
  }

  setlistColor() {
    if (this.props.path === 'setlists') {
      return 'back-btn btn-primary';
    } else {
      return 'back-btn brn-light';
    }
  }

  render(props) {
    return (
      <div className="container-fluid background-fixed">
        <div className="btn-group-vertical gap-3 mt-3">
          <a href={'#addJokes'}>
            <button className={this.newJokeColor()}>New Joke</button>
          </a>
          <a href={'#oldJokes'}>
           <button className={this.oldJokesColor()}>Old Jokes</button>
          </a>
          <a href={'#setlists'}>
           <button className={this.setlistColor()}>Setlists</button>
          </a>
          <a href={''}>
            <button className='back-btn btn-light'>Sign Out</button>
          </a>
        </div>
      </div>
    );
  }
}
