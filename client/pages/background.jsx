import React from 'react';

export default class Background extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isClicked: false
    };
  }

  render() {
    return (
      <div className="container-fluid background-fixed">
        <div className="button-container">
          <button id="new-joke">New Joke</button>
          <button id="old-jokes">Old Jokes</button>
          <button id="setlists">Setlists</button>
        </div>
      </div>
    );
  }
}
