import React from "react";
import {MainHeader} from "../common/MainHeader";
import {connect} from "react-redux";
import {Redirect} from 'react-router';
import store from "../../store";
import {C3Chart} from "../c3Chart";
import {STATIC_URL} from "../../helpers/env.js";
import { Scrollbars } from 'react-custom-scrollbars';
import {getScoreSummaryInCSV,emptyScoreCSVData} from "../../actions/appActions";
import {Link} from "react-router-dom";
import {Button} from "react-bootstrap";
import {isEmpty} from "../../helpers/helper";

@connect((store) => {
	return {login_response: store.login.login_response, scoreCSVData: store.apps.scoreSummaryCSVData,
	    currentAppId:store.apps.currentAppId,scoreSlug:store.apps.scoreSlug};
})

export class DataPreviewLeftPanel extends React.Component {
	constructor(props) {
		super(props);
	}
	 componentWillMount(){
	     if(isEmpty(this.props.scoreCSVData)){
	         this.props.dispatch(getScoreSummaryInCSV(this.props.match.params.slug))
	     }
	  }
	 emptyScoreCSVData(){
	     this.props.dispatch(emptyScoreCSVData())
	 }
	render() {
		console.log("score data preview is called##########3");
		 var pattern = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g;
		 var scoreLink = "/apps/" + store.getState().apps.currentAppId + "/scores/" + this.props.match.params.slug;
		const scoreData = this.props.scoreCSVData;
		var tableThTemplate = "";
		var tableRowTemplate = "";
		if(scoreData.length > 0){
		    tableThTemplate = scoreData.map(function(row,id){
		        let colData = "";
		        if(id == 0){
		           colData =  row.match(pattern).map((colData,index) =>{
		               let colIndex = "row_"+id+index
		                return(<th key={colIndex}><b>{colData}</b></th>)
		            })
		        }
		        return colData;
		    });
		    tableRowTemplate = scoreData.map(function(row,id){
		        if(row != ""){
                let colData = "";
                let colIndex = "row_"+id
                if(id > 0){
                        colData =  row.match(pattern).map((colData,index) =>{
                            return(<td>{colData}</td>)
                        })
                    }
                return <tr key = {colIndex}>{colData}</tr>;
                }
            });
		    return(
		            <div className="side-body">
                    {/* <!-- Page Title and Breadcrumbs -->*/}
					<div className="page-head">
					<div className="row">
					<div className="col-md-8">
					<h3 className="xs-mt-0 text-capitalize">Score Data Preview</h3>
					</div>
					</div>
					</div>


                    { /*<!-- /.Page Title and Breadcrumbs -->*/ }
                    { /*<!-- Page Content Area -->*/}
                    <div className="main-content">
                    <div className="row">
                    <div className="col-md-12">
                    <div className="panel no-borders box-shadow xs-p-10">

                    <div className="clearfix"></div>
                    <div className="table-responsive scoreDataPreview">

                    <Scrollbars>
                    <table className="table table-condensed table-hover table-bordered table-striped cst_table">
                    <thead>
                    <tr>
                    {tableThTemplate}
                    </tr>
                    </thead>
                    <tbody className="no-border-x">
                   {tableRowTemplate}
                    </tbody>

                    </table>
                    </Scrollbars>

                    </div>
                    </div>
                    </div>
                    </div>

                    <div className="row">
					<div className="col-md-12">
                    <div className="panel">
                    <div className="panel-body no-border text-right box-shadow">
                    <Link to={scoreLink} ><Button> Close</Button></Link>
                    </div>
                    </div>
					</div>
                    </div>

                    </div>
                    </div>

            );
		}else{
		    return (
	                 <div className="side-body">
	                    <div className="page-head">
	                    </div>
	                    <div className="main-content">
	                      <img id="loading" src={ STATIC_URL + "assets/images/Preloader_2.gif" } />
	                    </div>
	                  </div>
	                );
		}


		}
}
