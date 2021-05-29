import React from 'react';

export default class ConfirmSetlistForm extends React.Component {

  renderConfirmList() {
    return (
      this.props.setlistJokes.map(jokes =>
        <div key={jokes.jokeId} className='d-flex'>
          <input type="text" readOnly className="form-control-plaintext text-white flex-basis-300 ms-2" value={jokes.title}></input>
          <input type="text" readOnly className="form-control-plaintext text-white" value={jokes.approxMinutes}></input>
        </div>
      )
    );
  }

  render() {
    return (
            <div className="mb-3">
              <div className="col-sm-12">
              {this.renderConfirmList()}
              </div>
            </div>
    );
  }
}
