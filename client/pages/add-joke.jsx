import React from 'react';

export default class AddJoke extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      joke: '',
      isClicked: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(event) {
    this.setState({ joke: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  handleClick(event) {
    this.setState({ isClicked: !this.state.isClicked });
  }

  render() {
    return (
      <div className={`${this.state.isClicked ? 'container1-is-active' : 'container1'}`}>
        <div className="header">
          <i className="bi bi-list" id ="hamburger-button" onClick={this.handleClick}></i>
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
