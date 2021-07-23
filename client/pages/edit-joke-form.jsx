import React from 'react';

export default class EditJokeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      joke: '',
      title: '',
      approxMinutes: '',
      categoryId: '',
      categories: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.categoryList = this.categoryList.bind(this);
    this.categorySelect = this.categorySelect.bind(this);
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
      .then(res => res.json())
      .then(categories => this.setState({ categories }));
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({
      [name]: value
    });
  }

  categorySelect(event) {
    this.setState({ categoryId: event.target.value });
  }

  categoryList() {
    const listCategories = this.state.categories.map(categories =>
      <option key={categories.categoryId} value={categories.categoryId}>
        {categories.name}
      </option>
    );
    return (
      <select className="form-select mt-1" aria-label="Default select example" name="category" onChange={this.categorySelect}>
        <option value="">{this.props.jokes.name}</option>
        {listCategories}
      </select>
    );
  }

  handleSubmit(event) {
    event.preventDefault();
    const token = localStorage.getItem('joke-app-jwt');
    let joke = this.props.jokes.joke;
    let approxMinutes = this.props.jokes.approxMinutes;
    let title = this.props.jokes.title;
    let categoryId = this.props.jokes.categoryId;
    let name;
    if (this.state.joke) {
      joke = this.state.joke;
    }
    if (this.state.approxMinutes) {
      approxMinutes = this.state.approxMinutes;
    }
    if (this.state.title) {
      title = this.state.title;
    }
    if (this.state.categoryId) {
      categoryId = this.state.categoryId;
    }
    for (let i = 0; i < this.state.categories.length; i++) {
      if (this.state.categories[i].categoryId.toString() === categoryId.toString()) {
        name = this.state.categories[i].name;
      }
    }
    const editedJoke = {
      joke: joke,
      approxMinutes: approxMinutes,
      title: title,
      categoryId: categoryId,
      jokeId: this.props.jokes.jokeId,
      name: name
    };
    this.props.onSubmit(editedJoke);
    fetch(`/api/jokeApp/${this.props.jokes.jokeId}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
        'X-access-token': token
      },
      body: JSON.stringify(editedJoke)
    })
      .then(res => {
        if (!res.ok) {
          window.alert('Unexpected Error');
          throw Error('Unexpected Error');
        } else {
          return res.json();
        }
      })
      .then(editedJoke => this.props.onSubmit(editedJoke))
      .catch(err => console.error(err.message));
    this.setState({ joke: '', approxMinutes: '', categoryId: '', category: [], title: '' });
  }

  render() {
    return (
    <form onSubmit={this.handleSubmit}>
      <div className="mb-3 p-1">
        <label htmlFor="exampleFormControlInput1" className="form-label"></label>
          <input type="title" className="form-control" name='title' onChange={this.handleChange} placeholder={`Title: ${this.props.jokes.title}`}></input>
          <input type="number" className="form-control mt-1" name='approxMinutes' onChange={this.handleChange} placeholder={`Approx Minutes : ${this.props.jokes.approxMinutes}`}></input>
        {this.categoryList()}
      </div>
        <div className="mb-3 text-center p-1">
          <label htmlFor="exampleFormControlTextarea1" className="form-label"></label>
          <textarea className="form-control" name='joke' id="exampleFormControlTextarea2" rows="3" onChange={this.handleChange} placeholder={`Joke: '${this.props.jokes.joke}'`}></textarea>
          <button className="btn btn-primary mt-3" type="submit" id="button-addon2">Update Your Joke?</button>
        </div>
    </form>
    );
  }
}
