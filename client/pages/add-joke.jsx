import React from 'react';
import CategoryForm from './category-form';

export default class AddJoke extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      joke: '',
      title: '',
      isClicked: false,
      categories: [],
      modalHidden: false,
      textDisabled: true,
      categoryId: '',
      isClickedSuccess: false,
      isLoaded: false
    };
    this.handleChangeJoke = this.handleChangeJoke.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.addCategory = this.addCategory.bind(this);
    this.modalAppear = this.modalAppear.bind(this);
    this.categoryList = this.categoryList.bind(this);
    this.textBoxDisabled = this.textBoxDisabled.bind(this);
    this.categorySelect = this.categorySelect.bind(this);
    this.onClickModalClose = this.onClickModalClose.bind(this);
    this.closeSuccessModal = this.closeSuccessModal.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem('joke-app-jwt');
    fetch('/api/jokeApp/categories', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-access-token': token
      }
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          window.alert('Could not fetch Joke App data');
          throw Error('Could not fetch Joke App data');
        }
      })
      .then(categories => this.setState({ categories, token, joke: '', title: '', isLoaded: true }))
      // eslint-disable-next-line no-console
      .catch(err => console.error(err.message));
  }

  handleChangeJoke(event) {
    this.setState({ joke: event.target.value });
  }

  handleChangeTitle(event) {
    this.setState({ title: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const token = localStorage.getItem('joke-app-jwt');
    const newJoke = {
      joke: this.state.joke,
      title: this.state.title,
      categoryId: this.state.categoryId
    };
    fetch('/api/jokeApp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-access-token': token
      },
      body: JSON.stringify(newJoke)
    })
      .then(res => {
        if (res.status === 400) {
          this.setState({ joke: '', title: '', categoryId: '', textDisabled: true });
          window.alert('Joke Name and Joke are Required');
          throw Error('Joke Name and Joke are Required');
        } else if (!res.ok) {
          this.setState({ joke: '', title: '', categoryId: '', textDisabled: true });
          window.alert('Unexpected Error');
          throw Error('Unexpected Error');
        } else {
          return res.json();
        }
      })
      .then(data => this.setState({ joke: '', title: '', categoryId: '', textDisabled: true, isClickedSuccess: true }))
      .catch(err => console.error(err.message));
  }

  handleClick(event) {
    this.setState({ isClicked: !this.state.isClicked });
  }

  addCategory(category) {
    const token = localStorage.getItem('joke-app-jwt');
    const categoryList = [...this.state.categories];
    fetch('/api/jokeApp/category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-access-token': token
      },
      body: JSON.stringify({ category: category })
    })
      .then(res => {
        if (res.status === 400) {
          window.alert('Category Name is Required');
          throw Error('Category Name is Required');
        } else if (!res.ok) {
          window.alert('Unexpected Error');
          throw Error('Unexpected Error');
        } else {
          return res.json();
        }
      })
      .then(data => {
        categoryList.push(data);
        this.setState({ categories: categoryList, modalHidden: false });
      });
  }

  modalAppear(event) {
    this.setState({ modalHidden: !this.state.modalHidden });
  }

  categorySelect(event) {
    if (event.target.value === 'DEFAULT') {
      this.setState({ textDisabled: true, categoryId: '' });

    } else {
      this.setState({ textDisabled: false, categoryId: event.target.value });
    }
  }

  onClickModalClose() {
    this.setState({ modalHidden: false });
  }

  textBoxDisabled() {
    if (this.state.textDisabled) {
      return (
        <div className="mb-3">
          <input disabled type="text" className="form-control" placeholder="Select A Category" aria-label="Title" aria-describedby="basic-addon1" onChange={this.handleChangeTitle} value={this.state.title}></input>
          <textarea disabled className="form-control mt-1" id="exampleFormControlTextarea1" rows="3" onChange={this.handleChangeJoke} placeholder='Please Select a Category' value={this.state.joke}></textarea>;
        </div>
      );
    } else {
      return (
        <div className="mb-3">
          <input type="text" className="form-control" placeholder="Add A Title" aria-label="Add A Title" aria-describedby="basic-addon1" onChange={this.handleChangeTitle} value={this.state.title}></input>
          <textarea className="form-control mt-1" id="exampleFormControlTextarea1" rows="3" onChange={this.handleChangeJoke} placeholder='Your Joke Here' value={this.state.joke}></textarea>;
        </div>
      );
    }
  }

  closeSuccessModal() {
    this.setState({ isClickedSuccess: false });
  }

  categoryList() {
    const currentValue = this.state.categoryId;
    const listCategories = this.state.categories.map(categories =>
      <option key={categories.categoryId} value={categories.categoryId}>
        {categories.name}
      </option>
    );
    return (
      <select className="form-select" value={`${currentValue === '' ? 'DEFAULT' : currentValue}`} aria-label="Default select example" name="category" onChange={this.categorySelect}>
        <option value="DEFAULT">Choose A Category</option>
        {listCategories}
      </select>
    );
  }

  render() {
    if (!this.state.isLoaded) {
      return (
      <div className="progress w-75 m-auto mt-5">
        <div className="progress-bar progress-bar-striped progress-bar-animated w-50" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
      );
    } else {
      return (
      <>
        <div className="header">
          <h1>New Joke</h1>
        </div>
        <div id="joke-container">
          <form>
            <div className="mb-3">
              {this.categoryList()}
              <button className="btn btn-primary category-button" type="button" onClick={this.modalAppear}>Add A Category</button>
            </div>
            <div className="mb-3">
              {this.textBoxDisabled()}
            </div>
            <div className="col-12 center">
              <button onClick={this.handleSubmit} className="btn btn-primary" type="submit">Save Joke</button>
            </div>
          </form>
        </div>
        <div className={`${this.state.modalHidden ? 'modal-is-active' : 'modal'}`}>
          <div className="modal-dialog">
            <div className="modal-content bg-dark text-white text-center h-165 justify-content-center">
              <div className="d-flex w-100 align-items-center p-1">
                <h2 className="text-white mb-1 text-center fb-100">New Category</h2>
                <button type="button" className="btn-close bg-white" data-bs-dismiss="modal" aria-label="Close" onClick={this.onClickModalClose}></button>
              </div>
              <CategoryForm onSubmit={this.addCategory} />
            </div>
          </div>
        </div>
        <div className={this.state.isClickedSuccess ? 'modal-is-active' : 'modal'} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Joke Saved Successfully</h5>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={this.closeSuccessModal} data-bs-dismiss="modal">OK</button>
              </div>
            </div>
          </div>
        </div>
        <div className={`${this.state.isClickedEdit || this.state.isClickedDelete || this.state.modalHidden ? 'modal-backdrop b-drop' : ''}`}></div>
      </>
      );
    }
  }
}
