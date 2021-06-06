import React, { Component } from "react";


export default class Trivia extends Component
{
  constructor(props)
  {
    super(props);
    this.state =
    {
      message: "",
    };
  }

  myMessageHandler = (event) =>
  {
    this.setState({message:event.target.value})
  }
  sendMessage = () =>
  {
      const {websocket} = this.props // websocket instance passed as props to the child component.
      try
      {
          websocket.send(JSON.stringify({"message": this.state.message})) //send data to the server

      }
      catch (error)
      {
          console.log(error) // catch error
      }
  }

  handleClick = () =>
{
  this.props.parentCallback();
}

  render()
  {
    return (
      <div>


      <form>
      <h2>Envoyez un message</h2>
      <input
        type='text'
        onChange={this.myMessageHandler}
      />
      </form>
      <button onClick={this.sendMessage}> Click me </button>
      <h2> Question: Qui est le plus bo </h2>
      <ol>
        <li><button onClick={this.handleClick}>Mark</button></li>
        <li><button>Mark</button></li>
        <li><button>Mark</button></li>
      </ol>
      </div>
    );
  }

}
