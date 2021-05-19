import React from 'react';

export default class OldJokes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jokes: [],
      isClicked: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.renderJokeList = this.renderJokeList.bind(this);
  }

  componentDidMount() {
    fetch('/api/jokeApp')
      .then(res => res.json())
      .then(jokes => this.setState({ jokes }));
  }

  handleClick(event) {
    this.setState({ isClicked: !this.state.isClicked });
  }

  renderJokeList() {
    return (
      this.state.jokes.map(jokes =>
        <div className="list-group-item list-group-item-action mb-1" key={jokes.jokeId}>
          <div className="d-flex w-100 justify-content-between">
            <div className="d-flex">
              <input className="form-check-input" type="checkbox" name="radioNoLabel" id="radioNoLabel1" value={jokes.jokeId} aria-label="..."></input>
              <h4 className="ms-1">{jokes.title}</h4>
            </div>
            <small>Approx Minutes: {jokes.approxMinutes}</small>
            <a href="#oldJokes" className="link-primary">Edit</a>
          </div>
          <p>{jokes.joke}</p>
        </div>
      )
    );
  }

  render() {
    return (
      <div className={`${this.state.isClicked ? 'container1-is-active' : 'container1'}`}>
        <div className="header">
          <i className="bi bi-list" id="hamburger-button" onClick={this.handleClick}></i>
          <h1>Jokelist</h1>
        </div>
        <div className="list-group m-auto mt-1 w-50">
          {this.renderJokeList()}
          <button type="button" className="btn btn-primary w-25 m-auto mt-1">Create Setlist</button>
        </div>
      </div>
    );
  }
}
