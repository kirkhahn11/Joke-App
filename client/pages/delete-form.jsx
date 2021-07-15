import React from 'react';

export default class DeleteForm extends React.Component {

  deleteJoke(event, id) {
    event.preventDefault();
    this.props.onSubmit(this.props.deletedJoke.jokeId);
  }

  render() {
    return (
      <form onSubmit={() => this.deleteJoke(event, this.props.deletedJoke.jokeId)} className="text-center">
        <h5 className="modal-title">Delete Joke: {this.props.deletedJoke.title}?</h5>
        <div className="text-center">
          <button type="submit" className="btn btn-danger mt-2 mb-1" data-bs-dismiss="modal">Delete</button>
        </div>
      </form>
    );
  }
}
