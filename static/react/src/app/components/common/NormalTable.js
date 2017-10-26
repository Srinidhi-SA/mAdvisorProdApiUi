import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import store from "../../store";
import {getSignalAnalysis} from "../../actions/signalActions";
import {C3Chart} from "../c3Chart";
import renderHTML from 'react-render-html';
import HeatMap from '../../helpers/heatmap';
import {generateHeaders,generateNormalTableRows} from "../../helpers/helper";

export class NormalTable extends React.Component {
  constructor(){
    super();
  }
 
  render() {
   var data = this.props.tableData;
   console.log("checking normal tabletable element");
   var headerComponents = generateHeaders(data);
   var rowComponents = generateNormalTableRows(data);
   return (
           <table className="table table-bordered">
               <thead>{headerComponents}</thead>
               <tbody>{rowComponents}</tbody>
           </table>
       );
  }
}
