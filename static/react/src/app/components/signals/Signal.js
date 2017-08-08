import React from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router";
import store from "../../store";
import {getSignalAnalysis} from "../../actions/signalActions";
import {MasterSummary} from "./MasterSummary";
import {isEmpty} from "../../helpers/helper";
import {MainHeader} from "../common/MainHeader";
import Breadcrumb from 'react-breadcrumb';



@connect((store) => {
  return {login_response: store.login.login_response,
          signal: store.signals.signalAnalysis,
          selectedSignal: store.signals.selectedSignal,
        variableType:store.signals.variableType};
})

export class Signal extends React.Component {
  constructor() {
    super();
  }
  componentWillMount() {
    //alert("id:" + this.props.errandId);
    //console.log(store.getState().signals.signalAnalysis);
    if(this.props.variableType)
    this.props.dispatch(getSignalAnalysis(sessionStorage.userToken, this.props.match.params.slug, this.props.variableType));
    else
      this.props.dispatch(getSignalAnalysis(sessionStorage.userToken, this.props.match.params.slug, this.props.location.state.variableType));

  }
  render() {

     console.log("selected Signal is called$$$$$$$$$$$$$$!!");
     console.log(this.props);
     let breadcrumb = [];
    if(isEmpty(this.props.signal)||(this.props.match.params.slug!=this.props.selectedSignal)){
      // console.log("siggnal selection not matching *******")
      return(
        <div className="side-body">
        {/*<MainHeader/>*/}
        <div className="page-head">
          <div class="row">
            <div class="col-md-12">
            <Breadcrumb path={[{
                path: '/signals',
                label: 'Signals'
              },
              {
                path:'/signals'+this.props.match.params.slug,
                label: this.props.match.params.slug
              }
            ]}/>
            </div>
            <div class="col-md-8">
              <h2>TODO: need to fill this</h2>
            </div>
            </div>
          <div class="clearfix"></div>
        </div>
          <div className="main-content">
          Loading...
          </div>
          </div>
      );
    }else{
    return (<MasterSummary signalId={this.props.match.params.slug}/>);
  }
}
}
