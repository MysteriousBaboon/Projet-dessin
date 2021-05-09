import React, { Component } from "react";
//import axios from "axios";


export default class Trivia extends Component
{
  constructor(props)
  {
    super(props);
    this.state =
    {
    //  questions : [axios.get("/api/questions/1")]
    };
  }

  render()
   {
     console.log(this.props.value)
     return(
       <div>
       <h1>Titre 2</h1>
       <p>{this.props.value.question}</p>
       </div>
      )
   }
}
