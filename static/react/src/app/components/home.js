import React from "react";
import LeftPanel from "./LeftPanel/LeftPanel";
import TopPanel from "./TopPanel/TopPanel";
import DescriptionPanel from "./DescriptionPanel/DescriptionPanel";
import {Login} from "./login";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import store from "../store";



@connect((store) => {
  return {user: store.user.user,
     userFetched: store.user.fetched,
      tweets: store.tweets.tweets,
       login_response: store.login.login_response};
})

export class Home extends React.Component {
  constructor(){
    super();
  }
  render() {

    console.log("home is called!!");
    console.log(this.props.login_response);
    if (sessionStorage.userToken) {
      console.log("authorized!!!");
      return (
        <div className="main_wrapper">
          <LeftPanel/>
          <TopPanel/>
          <DescriptionPanel desc_id="signals"/>
        </div>
      );
    } else {
      alert("please login to continue!!");
      return(<Redirect to={"/"} />);
    }

  }
}
