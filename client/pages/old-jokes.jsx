import React from 'react';

export default class OldJokes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jokes: [],
      isClicked: false,
      isClickedDelete: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.renderJokeList = this.renderJokeList.bind(this);
    this.deleteJoke = this.deleteJoke.bind(this);
  }

  componentDidMount() {
    fetch('/api/jokeApp')
      .then(res => res.json())
      .then(jokes => this.setState({ jokes }));
  }

  handleClick(event) {
    this.setState({ isClicked: !this.state.isClicked });
  }

  deleteJoke(event) {
    const jokeList = [...this.state.jokes];
    const jokeId = {
      jokeId: event.target.value
    };
    fetch('/api/jokeApp', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jokeId)
    })
      .then(res => res.json())
      .then(data => {
        for (let i = 0; i < jokeList.length; i++) {
          if (jokeList[i].jokeId.toString() === event.target.value.toString()) {
            jokeList.splice(i, 1);
            this.setState({ jokes: jokeList });
          }
        }
      });
  }

  renderJokeList() {
    return (
      this.state.jokes.map(jokes =>
        <div className="list-group-item list-group-item-action mb-1" key={jokes.jokeId} value={jokes.jokeId}>
          <div className="d-flex w-100 justify-content-between">
            <div className="d-flex">
              <input className="form-check-input" type="checkbox" name="radioNoLabel" id="radioNoLabel1" value={jokes.jokeId} aria-label="..."></input>
              <h4 className="ms-1">{jokes.title}</h4>
            </div>
            <small className="lh-lg"><b>Approx Minutes: </b> {jokes.approxMinutes}</small>
            <small className="lh-lg"><b>Category: </b>{jokes.name}</small>
            <div className="d-flex mt-n1">
              <button className="btn btn-link" type="button" data-bs-toggle="modal" data-bs-target="exampleModal">Edit</button>
              <button type="button" className="btn btn-link link-danger" onClick={this.deleteJoke} value={jokes.jokeId}>Delete</button>
            </div>
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
          <h1>Joke List</h1>
        </div>
        <div className="list-group m-auto mt-1 w-50">
          {this.renderJokeList()}
          <button type="button" className="btn btn-primary w-25 m-auto mt-1">Create Setlist</button>
        </div>

      </div>

    );
  }
}
