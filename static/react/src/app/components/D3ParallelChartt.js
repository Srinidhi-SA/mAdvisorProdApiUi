import React from "react";
import {connect} from "react-redux";
import ReactDOM from 'react-dom';
import {c3Functions} from "../helpers/c3.functions";
import {Scrollbars} from 'react-custom-scrollbars';
import {API} from "../helpers/env";
import {renderC3ChartInfo,downloadSVGAsPNG} from "../helpers/helper";
import store from "../store";
import {checkSaveSelectedModels} from "../actions/appActions";

@connect((store) => {
  return {sideCardListFlag: store.signals.sideCardListFlag,
  selectedL1:store.signals.selectedL1,
  selected_signal_type:store.signals.selected_signal_type,
  selectedModelCount:store.apps.selectedModelCount,
  modelSummary:store.apps.modelSummary,
};
})

export class D3ParallelChartt extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      gridId :"grid_"+this.props.id,
      chartId : "chart_"+this.props.id,
      reload:false,
    }
  }

  componentDidMount(){
    var that = this;
    var blue_to_brown = d3.scale.linear()
  .domain([9, 50])
  .range(["steelblue", "brown"])
  .interpolate(d3.interpolateLab);

var color = function(d) { return blue_to_brown(d['Accuracy']); };
var data = this.props.data;
var hiddennames = this.props.hideaxes;
var parcoords = d3.parcoords()("#"+this.state.chartId)
.data(data)
    .hideAxis(hiddennames)
    .render()
    .brushMode("1D-axes")
    .id(this.state.gridId);  // enable brushing
  var fromModel = !this.props.modelSummary.data.modelSelected;
var config={ignoleTableList:this.props.hideColumns,fromModel:fromModel,evaluationMetricColName:this.props.evaluationMetricColName,selectedModelCount:this.props.selectedModelCount}
  // create data table, row hover highlighting
  var grid = d3.divgrid(config);
    d3.select("#"+this.state.gridId)
    .datum(data)
    .call(grid)
    .selectAll(".rowbody")
    .on({
      "mouseover": function(d) { parcoords.highlight([d]) },
      "mouseout": parcoords.unhighlight
    })
    .selectAll(".chkBox")
      .on({
        "click":function(d){
          var keyName = this.dataset.key;
          var checkedData = {"name":(this.dataset.name).replace(/_/g," "),"slug":this.dataset.slug,"Model Id":this.dataset.model,"evaluationMetricValue":this.dataset.acc,"evaluationMetricName":keyName}
          that.props.dispatch(checkSaveSelectedModels(checkedData,this.checked));
          if(this.checked)
          d3.select(this).attr("class","chkBoxSelect");
          else
          d3.select(this).attr("class","chkBox");
          if(that.props.selectedModelCount == 10)
          d3.select("#"+that.state.gridId).selectAll(".chkBox").attr("disabled","true");
          else if(that.props.selectedModelCount < 10 && !this.checked)
          d3.select("#"+that.state.gridId).selectAll(".chkBox").attr("disabled",null);
        }
      });
  // update data table on brush event
  parcoords.on("brush", function(d) {
    d3.select("#"+this.state.id)
      .datum(d)
      .call(grid)
      .selectAll(".rowbody")
      .on({
        "mouseover": function(d) { parcoords.highlight([d]) },
        "mouseout": parcoords.unhighlight
      });
  });
  }
  render() {
    
    return (
      <div>
        <div id={this.state.chartId} class="parcoords"></div>
        <div className="xs-p-10"></div>
         <Scrollbars style={{ height: 290}}>
        <table id={this.state.gridId} class="table table-condensed table-hover table-bordered table-striped arn_table"></table>
         </Scrollbars>
      </div>
    );
  }

}
