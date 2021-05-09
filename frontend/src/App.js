import React, { Component } from "react";
import TitleScreen from "./components/Titlescreen";
import Trivia from "./components/Trivia";

import axios from "axios";


class App extends Component
{
    constructor(props)
    {
      super(props);
      this.state =
      {
        gameState: "index",
        test : "test",
        question : ""
      }
    }

    componentDidMount()
    {
      axios.get(`/api/questions/1`)
        .then(res => {
          const ques = res.data;
          this.setState({ question: ques });
        })
    }

    handleCallback = (childData) =>
    {
      this.setState({gameState: childData})
    }

    render()
    {
      if(this.state.gameState === "index")
      {
        return(
          <div>
          <TitleScreen parentCallback = {this.handleCallback}/>
          </div>
        )
      }

      if(this.state.gameState === "test")
      {
        console.log(this.state.question)
        return(
        <div>
        <Trivia value={this.state.question}/>
        </div>
        )
      }

      else
      {
        return(
          <h1> Test </h1>
        )
      }
    }



      //else return ();
};

export default App;
