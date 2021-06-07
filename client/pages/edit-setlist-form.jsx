import React from 'react';

export default class EditSetlistForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jokes: [],
      isClickedInputs: {},
      setlistJokes: []
    };
    this.renderJokelist = this.renderJokelist.bind(this);
    this.jokeSelect = this.jokeSelect.bind(this);
    this.addJoke = this.addJoke.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem('joke-app-jwt');
    fetch('/api/jokeApp', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-access-token': token
      }
    })
      .then(res => res.json())
      .then(jokes => {
        const isClickedInputs = {};
        for (let i = 0; i < jokes.length; i++) {
          isClickedInputs[jokes[i].jokeId] = false;
        }
        this.setState({ jokes, isClickedInputs });
      });
  }

  jokeSelect(event) {
    const setlistJokes = [...this.state.setlistJokes];
    const checklist = this.state.isClickedInputs;
    checklist[event.target.value] = !checklist[event.target.value];
    const setlistIndex = setlistJokes.indexOf(event.target.value);
    if (setlistJokes.length === 0) {
      setlistJokes.push(event.target.value);
    } else if (setlistIndex === -1) {
      setlistJokes.push(event.target.value);
    } else {
      setlistJokes.splice(setlistIndex, 1);
    }
    this.setState({ setlistJokes: setlistJokes, isClickedInputs: checklist });
  }

  addJoke() {
    const jokeId = [];
    const jokesAdded = [];
    const jokeAdd = this.state.isClickedInputs;
    for (const property in jokeAdd) {
      if (jokeAdd[property]) {
        jokeId.push(parseInt(property));
      }
    }
    for (let i = 0; i < this.state.jokes.length; i++) {
      for (let x = 0; x < jokeId.length; x++) {
        if (this.state.jokes[i].jokeId === jokeId[x]) {
          jokesAdded.push(this.state.jokes[i]);
        }
      }
    }
    const setlistId = this.props.setlist.setlistId;
    this.props.onSubmit(jokeId, setlistId, jokesAdded);
    for (const property in jokeAdd) {
      jokeAdd[property] = false;
    }
    this.setState({ isClickedInputs: jokeAdd });
  }

  renderJokelist() {
    const addJokelist = [...this.state.jokes];
    if (this.props.setlist.jokes) {
      for (let i = 0; i < addJokelist.length; i++) {
        for (let x = 0; x < this.props.setlist.jokes.length; x++) {
          if (addJokelist[i].jokeId === this.props.setlist.jokes[x].jokeId) {
            addJokelist.splice(i, 1);
          }
        }
      }
    }
    if (this.props.setlist.jokes) {
      return (
        addJokelist.map(jokes =>
      <div className="list-group-item list-group-item-action mb-1" key={jokes.jokeId} value={jokes.jokeId}>
        <div className="d-flex w-100">
          <div className="d-flex fb-75">
            <input className="form-check-input" checked={this.state.isClickedInputs[jokes.jokeId]} type="checkbox" onChange={this.jokeSelect} name="radioNoLabel" value={jokes.jokeId} aria-label="..."></input>
            <h5 className="ms-1">{jokes.title}</h5>
          </div>
          <div className="d-flex justify-content-between w-60 ms-4">
            <small className="lh-lg"><b>Approx Minutes: </b> {jokes.approxMinutes}</small>
          </div>
        </div>
      </div>
        )
      );
    }
  }

  render() {
    return (
        <div className="list-group mt-1">
          <div className="modal-body">
            {this.renderJokelist()}
          </div>
          <div className="text-center mb-2">
            <button type="button" className="btn btn-primary text-center" onClick={this.addJoke}>Confirm Jokes</button>
          </div>
        </div >
    );
  }
}
