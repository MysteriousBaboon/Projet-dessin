import React, { Component } from "react";
import TitleScreen from "./components/Titlescreen";
import Trivia from "./components/Trivia";
import Draw from "./components/Draw";
import ChildComponent from "./components/child";

import axios from "axios";


class App extends Component
{
  // instance of websocket connection as a class property
    constructor(props)
    {
      super(props);
      this.state =
      {
        ws: null,
        gameState: "titlescreen",
        question : ""
      }
    }

    componentDidMount()
    {
      this.connect();

    //  axios.get(`/api/questions`)
    //    .then(res => {
    //      const ques = res.data;
    //      this.setState({ question: ques });
    //    })
    }

    timeout = 250; // Initial timeout duration as a class variable

    connect = () => {
           console.log("prout")

           var ws = new WebSocket('ws://127.0.0.1:8000');
           let that = this; // cache the this
           var connectInterval;

           // websocket onopen event listener
           ws.onopen = () => {
               console.log("connected websocket main component");

               this.setState({ ws: ws });

               that.timeout = 250; // reset timer to 250 on open of websocket connection
               clearTimeout(connectInterval); // clear Interval on on open of websocket connection
           };

           // websocket onclose event listener
           ws.onclose = e => {
               console.log(
                   `Socket is closed. Reconnect will be attempted in ${Math.min(
                       10000 / 1000,
                       (that.timeout + that.timeout) / 1000
                   )} second.`,
                   e.reason
               );

               that.timeout = that.timeout + that.timeout; //increment retry interval
               connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); //call check function after timeout
           };

           // websocket onerror event listener
        ws.onerror = err => {
            console.error(
                "Socket encountered error: ",
                err.message,
                "Closing socket"
            );

            ws.close();
        };
        };
        /**
       * utilited by the @function connect to check if the connection is close, if so attempts to reconnect
       */
      check = () => {
          const { ws } = this.state;
          if (!ws || ws.readyState == WebSocket.CLOSED) this.connect(); //check if websocket instance is closed, if so call `connect` function.
      };


    handleCallback = (childData) =>
    {
      this.setState({gameState: childData})
    }

    render()
    {

      if(this.state.gameState === "titlescreen")
      {
        return(
          <div>
          <TitleScreen websocket={this.state.ws} />
          </div>
        )
      }
      // <TitleScreen parentCallback = {this.handleCallback} websocket={this.state.ws} />




      //return <ChildComponent websocket={this.state.ws} />;
      //return(<Draw />)

      /*
      if(this.state.gameState === "test")
      {
        console.log("prout")
        return(
        <div>
        <Trivia value={this.state.question}/>
        </div>
        )
      }*/

      else
      {
        return(
          <h1> Test </h1>
        )
      }
    }



};

export default App;
