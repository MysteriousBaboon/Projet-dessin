import React, { Component } from "react";


export default class ChooseTeam extends Component
{

  chooseTeam = (color) =>
  {
      const {websocket} = this.props // websocket instance passed as props to the child component.
      try
      {
          websocket.send(JSON.stringify({"team": color.target.value, "username":this.props.username})) //send data to the server
      }
      catch (error)
      {
          console.log(error) // catch error
      }
      this.props.parentCallback(color.target.value)
  }


startGame = () =>
{
    const {websocket} = this.props // websocket instance passed as props to the child component.
    try
    {
        websocket.send(JSON.stringify({"startGame": "yes"})) //send data to the server
    }
    catch (error)
    {
        console.log(error) // catch error
    }
}



  render()
  {
    var redteam = <h1 style={{color:"red"}}> no red player </h1>;
    var blueteam = <h1 style={{color:"blue"}}> no blue player </h1>;

    if (this.props.players != null)
    {
      if (this.props.players.red.length > 0)redteam = this.props.players.red.map((player) =>  <li key={player}> {player}</li>);
      if (this.props.players.blue.length > 0)blueteam = this.props.players.blue.map((player) =>  <li key={player}> {player}</li>);

    }


    return (
      <div >
             <h1 style={{textAlign: "center"}}> Choose a team </h1>
             <button style={{justifyContent: 'center'}} onClick={this.chooseTeam} value="red"> Red </button>
             <ul style={{color:"red", textAlign: "center"}}>{redteam}</ul>,
             <div style={{display: "flex"}}>
             <button onClick={this.chooseTeam} value="blue"> Blue </button>
             <ul style={{color:"blue", textAlign: "center"}}>{blueteam}</ul>,
             </div>

             {this.props.isHost === "True"  && <button onClick={this.startGame} style={{color:"green"}}> Start Game</button>}

             </div>
    );
  }

}
