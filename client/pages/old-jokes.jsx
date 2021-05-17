import React from 'react';

export default class OldJokes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldJoke: '',
      isClicked: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.setState({ isClicked: !this.state.isClicked });
  }

  render() {
    return (
      <div className={`${this.state.isClicked ? 'container1-is-active' : 'container1'}`}>
        <div className="header">
          <i className="bi bi-list" id="hamburger-button" onClick={this.handleClick}></i>
          <h1>Old Joke</h1>
        </div>
      </div>
    );
  }
}
