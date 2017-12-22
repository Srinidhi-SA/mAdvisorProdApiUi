import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import store from "../../store";
import {getSignalAnalysis,handleDecisionTreeTable} from "../../actions/signalActions";
import {C3Chart} from "../c3Chart";
import renderHTML from 'react-render-html';
import HeatMap from '../../helpers/heatmap';
import $ from "jquery";
import {predictionLabelClick} from "../../helpers/helper";

@connect((store) => {
    return { selPrediction: store.signals.selectedPrediction};
  })
  
export class CardHtml extends React.Component {
  constructor(props){
    super(props);
  }
  componentDidMount() {
      HeatMap("heat-table-map");
      predictionLabelClick();
  }
  render() {
   var element = this.props.htmlElement;
   console.log("checking html element");
   if(this.props.classTag == "highlight"){
       return(
               <div class="row">
               <div class="bg-highlight-parent xs-ml-50 xs-mr-50">
               <div class="col-md-12 col-xs-12 bg-highlight"> 
                {renderHTML(element)}
                </div>
                <div class="clearfix"></div>
                </div>
                </div>
           );   
   }
   else {
       return(
               <div>
                {renderHTML(element)}
                </div>
           );   
   }

  }
}
