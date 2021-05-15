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

  myIdHandler = (event) => {
    this.setState({id: event.target.value});
  }

  sendMessage = () => {
      const {websocket} = this.props // websocket instance passed as props to the child component.
      try {
         console.log(websocket)

          websocket.send(JSON.stringify({"username": this.state.username, "id":this.state.id})) //send data to the server
      } catch (error) {
          console.log(error) // catch error
      }
  }

  render() {
    return (
      <div>
      <form>
      <h1>Veuillez rentrer votre pseudo et l'id de la partie {this.state.username}</h1>
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
      <button onClick={this.sendMessage}> Click me </button>
      </div>
    );
  }
}


 //<button onClick={this.handleClick}> Click me </button>
