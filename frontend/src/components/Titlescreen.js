import React, { Component } from "react";


export default class TitleScreen extends Component
{
  constructor(props)
  {
    super(props);
    this.state =
    {
    };
  }

  handleClick = () =>
  {
    this.props.parentCallback("test");
  }

  render()
   {

     return(

       <div>
       <h1>Titre </h1>
       <button onClick={this.handleClick}> Click me </button>
       </div>
     )
   }
}
