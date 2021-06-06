import React, { Component } from "react";
import TitleScreen from "./components/Titlescreen";
import ChooseTeam from "./components/ChooseTeam";
import Trivia from "./components/Trivia";


class App extends Component
{
    constructor(props)
    {
      super(props);

      this.state =
      {
        ws: "ws",
        gameState: "titlescreen",
        round: 0,
        id: "",
        players: null,

        question: null,

        isHost: null,
        username: "",
      }
    }

    timeout = 250; // Initial timeout duration as a class variable

    connect = () =>
    {
       var ws = new WebSocket('ws://127.0.0.1:8000/' + this.state.id + "/" + this.state.username + "/");
       let that = this; // cache the this
       var connectInterval;

       // websocket onopen event listener
       ws.onopen = () =>
       {
           this.setState({ ws: ws });
           that.timeout = 250; // reset timer to 250 on open of websocket connection
           clearTimeout(connectInterval); // clear Interval on on open of websocket connection
       };

       // websocket onclose event listener
       ws.onclose = e =>
       {
           that.timeout = that.timeout + that.timeout; //increment retry interval
           connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); //call check function after timeout
       };

       // websocket onerror event listener
       ws.onerror = err =>
       {
        console.error(
            "Socket encountered error: ",
            err.message,
            "Closing socket"
                      );
       };

       ws.onmessage = e =>
       {
           const data = JSON.parse(e.data);
           if(data.isHost)
           {
             this.setState({isHost: data.isHost})
             this.state.ws.send(JSON.stringify({"state": "team", "id": this.state.id})) //send data to the server
             this.setState({gameState: "ChooseTeam"})
           }
           else if(data.startGame)
           {
             var question = data
             this.setState({gameState: "ingame"})
             this.setState({round: 1})
           }

           if(data.message)
           {
             console.log(data.message)
           }

           else if(data.color)
           {
             this.setState({ players: data.color });
           }
       };

    };

       // utilited by the @function connect to check if the connection is close, if so attempts to reconnect
      check = () =>
      {
          const { ws } = this.state;
          if (!ws || ws.readyState === WebSocket.CLOSED) this.connect(); //check if websocket instance is closed, if so call `connect` function.
      };


    // HandleCallBack from TitleScreen
    TitleScreenCallback = (id, username) =>
    {
      this.setState({id: id}, () => {this.connect();});

      this.setState({username: username})
    }


    TempCallback = () =>
    {
      this.setState({gameState: "draw"})
    }

    render()
    {

      if(this.state.gameState === "titlescreen")
      {
        return(
          <div>
'         <TitleScreen parentCallback = {this.TitleScreenCallback} />
'         </div>
        )
      }

      else if(this.state.gameState === "ChooseTeam")
      {
        return(
          <div>
          <ChooseTeam websocket = {this.state.ws} players={this.state.players} username={this.state.username} gameid={this.state.id} isHost={this.state.isHost}/>
          </div>
        )
      }

      else if(this.state.gameState === "ingame")
      {
        return(
          <div>
          <Trivia parentCallback={this.TempCallback} websocket={this.state.ws} players={this.state.players}  question={question}/>
          </div>
        )
      }



    }



};

export default App;
