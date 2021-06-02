import React from 'react';
import EditSetlistForm from './edit-setlist-form';

export default class Setlists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      setlists: [],
      title: [],
      jokes: [],
      isClicked: false,
      isClickedDelete: false,
      isClickedEdit: false,
      deleteSetlist: '',
      editedSetlist: '',
      totalMinutes: []
    };
    this.handleClick = this.handleClick.bind(this);
    this.renderSetlist = this.renderSetlist.bind(this);
    this.deleteModal = this.deleteModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.closeModalEdit = this.closeModalEdit.bind(this);
    this.deleteSetlist = this.deleteSetlist.bind(this);
    this.totalMinutes = this.totalMinutes.bind(this);
    this.editModal = this.editModal.bind(this);
    this.deleteJoke = this.deleteJoke.bind(this);
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

  editModal(event) {
    for (let i = 0; i < this.state.setlists.length; i++) {
      if (this.state.setlists[i].setlistId.toString() === event.target.value.toString()) {
        this.setState({ isClickedEdit: !this.state.isClickedEdit, editedSetlist: this.state.setlists[i] });
      }
    }
  }

  totalMinutes(setlist) {
    let totalMinutes = 0;
    for (let i = 0; i < setlist.jokes.length; i++) {
      totalMinutes += setlist.jokes[i].approxMinutes;
    }
    return totalMinutes;
  }

  closeModal() {
    this.setState({ isClickedDelete: !this.state.isClickedDelete, deleteSetlist: '' });
  }

  closeModalEdit() {
    this.setState({ isClickedEdit: !this.state.isClickedEdit, editedSetlist: '' });
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

  deleteJoke(event) {
    const setlists = [...this.state.setlists];
    let deleteJoke;
    for (let i = 0; i < this.state.setlists.length; i++) {
      if (this.state.setlists[i].setlistId.toString() === event.target.name.toString()) {
        deleteJoke = this.state.setlists[i];
      }
    }
    for (let i = 0; i < deleteJoke.jokes.length; i++) {
      if (deleteJoke.jokes[i].id.toString() === event.target.value.toString()) {
        deleteJoke.jokes.splice(i, 1);
      }
    }
    for (let i = 0; i < setlists.length; i++) {
      if (deleteJoke.setlistId.toString() === setlists[i].setlistId.toString()) {
        setlists.splice(i, 1, deleteJoke);
      }
    }
    const jokeId = {
      jokeId: event.target.value,
      setlistId: event.target.name
    };
    fetch('/api/jokeApp/setlistJokes', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jokeId)
    })
      .then(res => res.json())
      .then(data => {
        this.setState({ setlists });
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
                <span className='fb-30'>{`Total Minutes: ${this.totalMinutes(setlist)}`}</span>
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
                  <div key={jokes.id} className='d-flex align-items-center'>
                    <h6 className='mb-0 fb-30'>{jokes.title}</h6>
                    <button type="button" className="btn btn-link link-danger" onClick={this.deleteJoke} name={setlist.setlistId} value={jokes.id}>Delete Joke</button>
                  </div>
                )}
                <div className="text-center">
                  <button type="button" className="btn btn-link link-primary fb-30" onClick={this.editModal} value={setlist.setlistId}>Add Jokes</button>
                </div>
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
        <div className={`${this.state.isClickedEdit ? 'modal-is-active' : 'modal'}`} tabIndex="-1">
          <div className="modal-dialog modal-md">
            <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{`Edit ${this.state.editedSetlist.setlistName}`}</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={this.closeModalEdit}></button>
                </div>
                <div className="modal-body">
                  <EditSetlistForm setlist={this.state.editedSetlist} />
                </div>
                <div className="text-center mb-2">
                  <button type="button" className="btn btn-primary text-center" onClick={this.deleteSetlist}>Confirm Jokes</button>
                </div>
              </div>
            </div>
          </div>
      </div>
    );
  }
}
