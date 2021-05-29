import React from 'react';

export default class Setlists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      setlists: [],
      title: [],
      isClicked: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.renderSetlist = this.renderSetlist.bind(this);
  }

  componentDidMount() {
    fetch('/api/jokeApp/setlists')
      .then(res => res.json())
      .then(setlists =>
        this.setState({ setlists })
      );
  }

  handleClick(event) {
    this.setState({ isClicked: !this.state.isClicked });
  }

  renderSetlist() {

    return (
      this.state.setlists.map(setlist =>
          <div className="accordion-item" key={setlist.setlistId}>
            <h2 className="accordion-header" id="flush-headingOne">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapseOne${setlist.setlistId}`} aria-expanded="false" aria-controls="flush-collapseOne">
              <div className='w-100 d-flex align-items-center justify-content-evenly'>
                <h5 className='fb-30 ms-3'><b>{setlist.setlistName}</b></h5>
                <span className='fb-30'>{`Total Minutes: ${setlist.totalMinutes}`}</span>
              </div>
             </button>
            </h2>
          <div id={`flush-collapseOne${setlist.setlistId}`} className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
              <div className="accordion-body">
                <div className="d-flex justify-content-between">
                  <h5>Jokes:</h5>
                  <button type="button" className="btn btn-link link-danger fb-30" onClick={this.deleteModal} value={setlist.setlistId}>Delete Setlist</button>
                </div>
                {setlist.jokes.map(jokes =>
                  <h6 key={jokes.jokeId}>{jokes.title}</h6>)}
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
        <div className="accordion-flush m-auto w-75" id="accordionFlushExample">
          {this.renderSetlist()}
        </div>
      </div>
    );
  }
}
