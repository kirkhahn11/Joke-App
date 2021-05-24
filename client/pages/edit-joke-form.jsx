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
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeJoke = this.handleChangeJoke.bind(this);
    this.handleChangeApproxMinutes = this.handleChangeApproxMinutes.bind(this);
    this.categoryList = this.categoryList.bind(this);
    this.categorySelect = this.categorySelect.bind(this);
  }

  componentDidMount() {
    fetch('/api/jokeApp/categories')
      .then(res => res.json())
      .then(categories => this.setState({ categories }));
  }

  handleChangeTitle(event) {
    this.setState({ title: event.target.value });
  }

  handleChangeJoke(event) {
    this.setState({ joke: event.target.value });
  }

  handleChangeApproxMinutes(event) {
    this.setState({ approxMinutes: event.target.value });
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
      <select className="form-select" aria-label="Default select example" name="category" onChange={this.categorySelect}>
        <option value="">{this.props.jokes.name}</option>
        {listCategories}
      </select>
    );
  }

  handleSubmit(event) {
    event.preventDefault();
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
        'Content-type': 'application/json'
      },
      body: JSON.stringify(editedJoke)
    })
      .then(res => res.json())
      .then(editedJoke => this.props.onSubmit(editedJoke));
    this.setState({ joke: '', approxMinutes: '', categoryId: '', category: [], title: '' });
  }

  render() {
    return (
    <form onSubmit={this.handleSubmit}>
      <div className="mb-3 p-1">
        <label htmlFor="exampleFormControlInput1" className="form-label"></label>
        <input type="title" className="form-control" onChange={this.handleChangeTitle} placeholder={`Title: ${this.props.jokes.title}`}></input>
        <input type="number" className="form-control mt-1" onChange={this.handleChangeApproxMinutes} placeholder={`Approx Minutes : ${this.props.jokes.approxMinutes}`}></input>
        {this.categoryList()}
      </div>
        <div className="mb-3 text-center p-1">
          <label htmlFor="exampleFormControlTextarea1" className="form-label"></label>
          <textarea className="form-control" id="exampleFormControlTextarea2" rows="3" onChange={this.handleChangeJoke} placeholder={`Joke: '${this.props.jokes.joke}`}></textarea>
          <button className="btn btn-primary mt-3" type="submit" id="button-addon2">Update Your Shit Joke?</button>
        </div>
    </form>
    );
  }
}
