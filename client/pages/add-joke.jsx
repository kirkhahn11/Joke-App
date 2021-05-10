import React from 'react';

export default class AddJoke extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      joke: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ joke: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (
      <div className="container1 hidden">
        <div className="header">
          <i id="hamburger-icon" className="fas fa-bars my-icon"></i>
          <h1>New Joke</h1>
        </div>
        <div id="joke-container">
          <form>
            <div className="mb-3">
              <select className="form-select" aria-label="Default select example" name="catagory">
                <option value="">Choose A Catagory Asshole</option>
              </select>
            </div>
            <div className="mb-3">
              <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" onChange={this.handleChange} placeholder='Please Select a Category'></textarea>
            </div>
            <div className="col-12 center">
              <button onClick={this.handleSubmit} className="btn btn-primary" type="submit">Save Joke</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
