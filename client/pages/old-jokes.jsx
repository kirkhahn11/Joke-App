import React from 'react';
import EditJokeForm from './edit-joke-form';

export default class OldJokes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jokes: [],
      editedJoke: [],
      targetId: '',
      isClicked: false,
      isClickedEdit: false,
      setlistJokes: []
    };
    this.handleClick = this.handleClick.bind(this);
    this.renderJokeList = this.renderJokeList.bind(this);
    this.deleteJoke = this.deleteJoke.bind(this);
    this.editModal = this.editModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.editJoke = this.editJoke.bind(this);
    this.jokeSelect = this.jokeSelect.bind(this);
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

  editModal(event) {
    for (let i = 0; i < this.state.jokes.length; i++) {
      if (this.state.jokes[i].jokeId.toString() === event.target.value.toString()) {
        this.setState({ isClickedEdit: !this.state.isClickedEdit, targetId: event.target.value, editedJoke: this.state.jokes[i] });
      }
    }
  }

  closeModal() {
    this.setState({ isClickedEdit: !this.state.isClickedEdit });
  }

  editJoke(editedJoke) {
    const jokeList = [...this.state.jokes];
    for (let i = 0; i < jokeList.length; i++) {
      if (jokeList[i].jokeId === editedJoke.jokeId) {
        jokeList.splice(i, 1, editedJoke);
        this.setState({ jokes: jokeList, isClickedEdit: false });
      }
    }
  }

  jokeSelect(event) {
    const setlistJokes = [...this.state.setlistJokes];
    const setlistIndex = setlistJokes.indexOf(event.target.value);
    if (setlistJokes.length === 0) {
      setlistJokes.push(event.target.value);
    } else if (setlistIndex === -1) {
      setlistJokes.push(event.target.value);
    } else {
      setlistJokes.splice(setlistIndex, 1);
    }
    this.setState({ setlistJokes: setlistJokes });
  }

  renderJokeList() {
    return (
      this.state.jokes.map(jokes =>
          <div className="list-group-item list-group-item-action mb-1" key={jokes.jokeId} value={jokes.jokeId}>
            <div className="d-flex w-100 justify-content-between">
              <div className="d-flex">
                <input className="form-check-input" type="checkbox" onClick={this.jokeSelect} name="radioNoLabel" id="radioNoLabel1" value={jokes.jokeId} aria-label="..."></input>
                <h4 className="ms-1">{jokes.title}</h4>
              </div>
              <small className="lh-lg"><b>Approx Minutes: </b> {jokes.approxMinutes}</small>
              <small className="lh-lg"><b>Category: </b>{jokes.name}</small>
              <div className="d-flex mt-n1">
                <button className="btn btn-link" type="button" onClick={this.editModal} value={jokes.jokeId}>Edit</button>
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
        <div className="list-group m-auto mt-1 w-75">
          <form action="" className="text-center">
              {this.renderJokeList()}
            <button type="submit" className="btn btn-primary w-25 m-auto mt-1">Create Setlist</button>
          </form>
        </div>
          <div className={this.state.isClickedEdit ? 'modal-is-active' : 'modal'}tabIndex="-1">
            <div className="modal-dialog modal-xl">
              <div className="modal-content bg-dark text-white">
              <div className="modal-header ps-10">
                <h3 className="modal-title"><b>Edit Joke</b></h3>
                  <button type="button" className="btn-close bg-white" data-bs-dismiss="modal" aria-label="Close" onClick={this.closeModal}></button>
                </div>
              <EditJokeForm jokes={this.state.editedJoke} jokeId={this.state.targetId} onSubmit={this.editJoke}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
