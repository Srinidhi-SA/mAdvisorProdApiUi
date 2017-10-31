import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import store from "../store";



@connect((store) => {
  return {
       login_response: store.login.login_response};
})

export class Home extends React.Component {
  constructor(){
    super();
  }
  render() {
    return(
      <div>
    <Redirect to ="/signals"/>

      </div>
    )
  }
}
