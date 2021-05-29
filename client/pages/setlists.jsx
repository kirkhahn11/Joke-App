import React from 'react';

export default class Setlists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      setlists: [],
      title: [],
      isClicked: false,
      isClickedDelete: false,
      deleteSetlist: ''
    };
    this.handleClick = this.handleClick.bind(this);
    this.renderSetlist = this.renderSetlist.bind(this);
    this.deleteModal = this.deleteModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.deleteSetlist = this.deleteSetlist.bind(this);
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

  deleteModal(event) {
    for (let i = 0; i < this.state.setlists.length; i++) {
      if (this.state.setlists[i].setlistId.toString() === event.target.value.toString()) {
        this.setState({ isClickedDelete: !this.state.isClickedDelete, deleteSetlist: this.state.setlists[i] });
      }
    }
  }

  closeModal() {
    this.setState({ isClickedDelete: !this.state.isClickedDelete });
  }

  deleteSetlist() {
    const setlists = [...this.state.setlists];
    const setlistId = {
      setlistId: this.state.deleteSetlist.setlistId
    };
    fetch('/api/jokeApp/setlist', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(setlistId)
    })
      .then(res => res.json())
      .then(data => {
        for (let i = 0; i < setlists.length; i++) {
          if (setlists[i].setlistId.toString() === this.state.deleteSetlist.setlistId.toString()) {
            setlists.splice(i, 1);
            this.setState({ setlists: setlists, isClickedDelete: false, deleteSetlist: '' });
          }
        }
      });
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
        <div className={`${this.state.isClickedDelete ? 'modal-is-active' : 'modal'}`} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{`Delete ${this.state.deleteSetlist.setlistName}`}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={this.closeModal}></button>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" onClick={this.deleteSetlist}>Confirm Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
