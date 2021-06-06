import React, { Component } from "react";


export default class TitleScreen extends Component
{
  constructor(props) {
    super(props);
    this.state = {
       username: '',
       id: ''};
  }
  myPseudoHandler = (event) => {
    this.setState({username: event.target.value});
  }

  myIdHandler = (event) =>
  {
    this.setState({id: event.target.value});
  }



  handleClick = () =>
{
  this.props.parentCallback(this.state.id, this.state.username);
}

  render() {
    return (
      <div>
      <form>
      <h1>Veuillez rentrer votre pseudo et l'id de la partie</h1>
      <p>Votre pseudo:</p>
      <input
        type='text'
        onChange={this.myPseudoHandler}
      />

      <p>L'id de la partie:</p>
      <input
        type='text'
        onChange={this.myIdHandler}
      />
      </form>
      <button onClick={this.handleClick}> Click me </button>
      </div>
    );
  }
}


 //<button onClick={this.handleClick}> Click me </button>
