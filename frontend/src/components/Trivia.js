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

  chooseAnswer = (selected) =>
{
  const {websocket} = this.props // websocket instance passed as props to the child component.
  try
  {
      websocket.send(JSON.stringify({"answer": selected})) //send data to the server
  }

  catch (error)
  {
      console.log(error) // catch error
  }
}

  render()
  {
    var answers = []

    for (var key in this.props.question.answers) {
      answers.push(this.props.question.answers[key]);
    }

    var display = answers.map((player) =>  <li key={player}><button value={player} onClick={this.chooseAnswer}>{player}</button></li>);



    return (
      <div>


      <form>
      <h2>Envoyez un message</h2>
      <input type='text' onChange={this.myMessageHandler}/>
      </form>
      <button onClick={this.sendMessage}> Click me </button>
      <h2> {this.props.question.question} </h2>
      <ul style={{color:"red", textAlign: "center", listStyle: "none"}}>{display}</ul>,
      </div>
    );
  }

}
