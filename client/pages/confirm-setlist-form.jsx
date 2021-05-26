import React from 'react';

export default class ConfirmSetlistForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jokelist: []
    };
    this.renderConfirmList = this.renderConfirmList.bind(this);
  }

  renderConfirmList() {
    this.setState({ jokelist: this.props.setlistJokes });
  }

  render() {

    return (
      <div>
      <button onClick={this.renderConfirmList}>test</button>
      </div>
    );
  }
}
