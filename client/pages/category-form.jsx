import React from 'react';

export default class CategoryForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ category: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const category = this.state.category;
    this.props.onSubmit(category);
    this.setState({ category: '' });
  }

  render() {
    const value = this.state.task;
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text"
        className="form-control w-75 m-auto"
        placeholder="New Category!"
        onChange={this.handleChange}
        value={value}></input>
        <button className="btn btn-primary mt-3 mb-1" type="submit" id="button-addon2">Submit</button>
      </form>
    );
  }
}
