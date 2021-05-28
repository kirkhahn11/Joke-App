import React from 'react';

export default class Setlists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      setlists: [],
      isClicked: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    fetch('/api/jokeApp/setlists')
      .then(res => res.json())
      .then(setlists => this.setState({ setlists }));
  }

  handleClick(event) {
    this.setState({ isClicked: !this.state.isClicked });
  }

  renderSetlist() {
    return (
      this.state.setlists.map(setlist =>
        <div className="list-group-item list-group-item-action mb-1" key={setlist.setlistId} value={setlist.setlistId}>
          <div className="d-flex w-100">
            <div className="d-flex w-30">
            </div>
          </div>
        </div>
      )
    );
  }

  render() {
    return (
      <div className={`${this.state.isClicked ? 'container1-is-active' : 'container1'}`}>
        <div className="header">
          <i className="bi bi-list" id="hamburger-button" onClick={this.handleClick}></i>
          <h1>Setlists</h1>
        </div>
      </div>
    );
  }
}
