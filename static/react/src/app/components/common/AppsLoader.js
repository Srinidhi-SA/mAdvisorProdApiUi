import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import {Link} from "react-router-dom";
import store from "../../store";
import {Modal,Button} from "react-bootstrap";
import {openAppsLoaderValue,closeAppsLoaderValue,getAppsModelList,clearAppsIntervel,updateModelSummaryFlag,reSetRegressionVariables,getHeader, fetchModelSummary,getAppDetails, setAppsLoaderValues,} from "../../actions/appActions";
import {hideDataPreview, getDataSetPreview} from "../../actions/dataActions";
import {C3Chart} from "../c3Chart";
import renderHTML from 'react-render-html';
import HeatMap from '../../helpers/heatmap';
import {STATIC_URL, API} from "../../helpers/env";
import {handleJobProcessing, getUserDetailsOrRestart} from "../../helpers/helper";

@connect((store) => {
	return {login_response: store.login.login_response,
		appsLoaderModal:store.apps.appsLoaderModal,
		appsLoaderPerValue:store.apps.appsLoaderPerValue,
		appsLoaderText:store.apps.appsLoaderText,
		appsLoadedText:store.apps.appsLoadedText,
		appsLoaderImage:store.apps.appsLoaderImage,
		currentAppId: store.apps.currentAppId,
	    modelSlug: store.apps.modelSlug,
		updateCreateModelHideShow:store.apps.updateCreateModelHideShow,
		scoreSlug:store.apps.scoreSlug,
		stockSlug:store.apps.stockSlug,
		roboDatasetSlug:store.apps.roboDatasetSlug,
		setAppsLoaderValues: store.apps.setAppsLoaderValues,
		currentAppDetails:store.apps.currentAppDetails,
	};
})


export class AppsLoader extends React.Component {
  constructor(){
    super();
	}

	componentWillUpdate(){
		if(store.getState().apps.appsLoaderPerValue<=0 && store.getState().apps.appsLoaderText!="" && Object.keys(store.getState().apps.appsLoadedText).length===0){
			document.getElementById("loadingMsgs").innerHTML = store.getState().apps.appsLoaderText
		}else if(store.getState().apps.appsLoaderPerValue>=0 && store.getState().apps.appsLoaderText!="" && Object.keys(store.getState().apps.appsLoadedText).length!=0){
			var loaderText = store.getState().apps.appsLoaderText
			var array = Object.values(store.getState().apps.appsLoadedText)
			var x = document.getElementById("loadingMsgs");
			var x1 = document.getElementById("loadingMsgs1");
			var x2 = document.getElementById("loadingMsgs2");
			
			let pos = array.indexOf(loaderText)
			if(pos<3){
				x.innerHTML = "Step 1"+ ": " + array[0];
				x1.innerHTML ="Step 2"+ ": " + array[1];
				x2.innerHTML ="Step 3"+ ": " + array[2];
			}
			else if(pos>array.length-3){
				x.innerHTML = "Step "+ (array.length-1) +": " + array[array.length-1];
				x1.innerHTML ="Step "+ (array.length-2) +": " + array[array.length-2];
				x2.innerHTML ="Step "+ (array.length-3) +": " + array[array.length-3];
			}
			else{
				x.innerHTML = "Step " + (pos-1) + ": " + array[pos-1];
				x1.innerHTML ="Step " + pos + ": " + array[pos];
				x2.innerHTML ="Step " + (pos+1) + ": " + array[pos+1];
			}
		}
	}

	openModelPopup(){
  		this.props.dispatch(openAppsLoaderValue())
  	}
	valueStore = () =>{
		let timer = setInterval(() => {
			if(this.props.setAppsLoaderValues[this.props.modelSlug].status === "INPROGRESS"){
			return fetch(API + '/api/trainer/' + this.props.modelSlug + '/', {
				method: 'get',
				headers: getHeader(getUserDetailsOrRestart.get().userToken)
				}).then(response => response.json())
				.then(responsejson => {
					if(responsejson.message[0].globalCompletionPercentage <= 100){
						if(this.props.setAppsLoaderValues[this.props.modelSlug].value != responsejson.message[0].globalCompletionPercentage){
							this.props.dispatch(setAppsLoaderValues(this.props.modelSlug,responsejson.message[0].globalCompletionPercentage,responsejson.status))
							this.props.dispatch(getAppsModelList(1));
						}
					}
				})
			}
		if (this.props.setAppsLoaderValues[this.props.modelSlug].value === 100){
			$(".notifyBtn").trigger('click');
		clearInterval(timer);
			this.props.dispatch(updateModelSummaryFlag(true));
		}
		},10000);
	}
  closeModelPopup(){
		this.props.dispatch(updateModelSummaryFlag(false));
		this.props.dispatch(hideDataPreview());
	  this.props.dispatch(closeAppsLoaderValue());
	  this.valueStore();

		clearAppsIntervel();
  }
  cancelCreateModel(){
		this.props.dispatch(updateModelSummaryFlag(false));
		this.props.dispatch(hideDataPreview());
		if((this.props.match.url).indexOf("/createScore") > 0 || (this.props.match.url).indexOf("/analyst/scores") > 0)
		this.props.dispatch(handleJobProcessing(this.props.scoreSlug));
		else if((this.props.match.url).indexOf("/apps-stock-advisor") >=0 )
		this.props.dispatch(handleJobProcessing(this.props.stockSlug));
		else if((this.props.match.url).indexOf("/apps-robo") >=0 )
		this.props.dispatch(handleJobProcessing(this.props.roboDatasetSlug));
		else
		this.props.dispatch(handleJobProcessing(this.props.modelSlug));
		this.props.dispatch(closeAppsLoaderValue());
		clearAppsIntervel();
	}

  render() {
		$('#text-carousel').carousel();
		let img_src=STATIC_URL+store.getState().apps.appsLoaderImage;
		var hideUrl = "";
		if(store.getState().apps.currentAppDetails != null)
			if(this.props.match && (this.props.match.url).indexOf("/createModel") > 0 || this.props.match && (this.props.match.url).indexOf("/createScore") > 0){
				let	appURL = "/"+store.getState().apps.currentAppDetails.app_url;
				let mURL;
				if(window.location.href.includes("analyst")){
					mURL = appURL.replace("models","analyst/models/")
				}else{
					mURL = appURL.replace("models","autoML/models/")
				}
				store.getState().apps.currentAppDetails != null ? hideUrl = mURL:hideUrl = "/apps/"+store.getState().apps.currentAppId+"/analyst/models";
			} else if((this.props.match.url).includes("/apps-stock-advisor-analyze"))
				hideUrl = "/apps-stock-advisor";
			else
				hideUrl = this.props.match.url;

   return (
          <div id="dULoader">
				<Modal show={store.getState().apps.appsLoaderModal} backdrop="static" onHide={this.closeModelPopup.bind(this)} dialogClassName="modal-colored-header">
      	<Modal.Body>
		<div className="row">
		<div className="col-md-12">
                <div className="panel xs-mb-0 modal_bg_processing">
                  <div className="panel-body no-border xs-p-0">

				<div id="text-carousel" class="carousel slide vertical" data-ride="carousel">

				<div class="row">
				<div class="col-xs-offset-1 col-xs-10">
				<div class="carousel-inner">
				<div class="item active">
				<div class="carousel-content">
					<h4 className="text-center">
					mAdvisor - Data scientist in a box
				</h4>
				</div>
				</div>
				<div class="item">
				<div class="carousel-content">
				   <h4 className="text-center">
					One click AutoML solution
				</h4>
				</div>
				</div>
				<div class="item">
				<div class="carousel-content">
				   <h4 className="text-center">
					Automated AI and Machine Learning Techniques with zero manual intervention
				</h4>
				</div>
				</div>
				<div class="item">
				<div class="carousel-content">
				   <h4 className="text-center">
					User friendly interface for Business users with one click solution
				</h4>
				</div>
				</div>
				<div class="item">
				<div class="carousel-content">
				   <h4 className="text-center">
					Advanced feature engineering options in analyst mode
				</h4>
				</div>
				</div>
				<div class="item">
				<div class="carousel-content">
				   <h4 className="text-center">
					Build predictive models and deploy them for real-time prediction on unseen data
				</h4>
				</div>
				</div>
				<div class="item">
				<div class="carousel-content">
				   <h4 className="text-center">
					Suitable for datasets of any size
				</h4>
				</div>
				</div>
				<div class="item">
				<div class="carousel-content">
				   <h4 className="text-center">
					Gives you best results from multiple models
				</h4>
				</div>
				</div>
				<div class="item">
				<div class="carousel-content">
				   <h4 className="text-center">
					Expandable and scalable adoption of new use cases
				</h4>
				</div>
				</div>
				<div class="item">
				<div class="carousel-content">
				   <h4 className="text-center">
					APD helps users to analyze and create data stories from large volumes of data
				</h4>
				</div>
				</div>
				<div class="item">
				<div class="carousel-content">
				   <h4 className="text-center">
					Uses statistical techniques and machine learning algorithms to identify patterns within data sets
				</h4>
				</div>
				</div>
				<div class="item">
				<div class="carousel-content">
				   <h4 className="text-center">
					Get insights and conclusive analysis in natural language
				</h4>
				</div>
				</div>
				<div class="item">
				<div class="carousel-content">
				   <h4 className="text-center">
					Responsive visualization layer help to create intuitive analysis and bring data to life
				</h4>
				</div>
				</div>
				<div class="item">
				<div class="carousel-content">
				   <h4 className="text-center">
					Import dataset from various sources and channels like, Local file system,  MySQL, MSSQL, SAP HANA, HDFS and S3
				</h4>
				</div>
				</div>
				<div class="item">
				<div class="carousel-content">
				   <h4 className="text-center">
					Customer portfolio analysis using Robo-Advisor
				</h4>
				</div>
				</div>
				<div class="item">
				<div class="carousel-content">
				   <h4 className="text-center">
					Insights about stock price using news article contents in Stock-Sense
				</h4>
				</div>
				</div>
				<div class="item">
				<div class="carousel-content">
				   <h4 className="text-center">
					mAdvisor Narratives for BI - automated insights engine extension for BI platforms such as Qlik Sense, Tableau, Power BI
				</h4>
				</div>
				</div>
				<div class="item">
				<div class="carousel-content">
				   <h4 className="text-center">
					Narratives for BI - Translates data from charts and visualization into meaningful summaries
				</h4>
				</div>
				</div>
				<div class="item">
				<div class="carousel-content">
				   <h4 className="text-center">
					Flexible deployment options - both cloud and on-premise deployments available
				</h4>
				</div>
				</div>
				<div class="item">
				<div class="carousel-content">
				   <h4 className="text-center">
					Login using your organization credentials
				</h4>
				</div>
				</div>

				</div>
				</div>
				</div>


				</div>

				<img src={img_src} className="img-responsive"/>

				<div className="modal_stepsBlock xs-p-10">
					<div className="row">
						<div className="col-sm-9">
							<p><b>mAdvisor evaluating your data set</b></p>
							<div class="modal-steps" id="loadingMsgs">
								Please wait while analysing...
							</div>
							<div class="modal-steps active" id="loadingMsgs1">
                                </div>
                                <div class="modal-steps" id="loadingMsgs2">
                                </div>
								{/* <ul class="modal-steps"> */}
								{/*	<li>----</li>*/}
									{/* <li class="active"></li> */}
								{/*	<li>----</li>*/}
								{/* </ul> */}

						</div>
						<div className="col-sm-3 text-center">
							{store.getState().apps.appsLoaderPerValue >= 0?<h2 class="text-white">{store.getState().apps.appsLoaderPerValue}%</h2>:<h5 className="loaderValue" style={{display:"block", textAlign: "center" }}>In Progress</h5>}
				  	</div>
					</div>
					</div>





				{/*store.getState().apps.appsLoaderPerValue >= 0 ?<div className="p_bar_body hidden">
				<progress className="prg_bar" value={store.getState().apps.appsLoaderPerValue} max={95}></progress>
				<div className="progress-value"><h3>{store.getState().apps.appsLoaderPerValue} %</h3></div>
				</div>:""*/}


			</div>


		</div>
		</div>
	</div>
		</Modal.Body>
		 {(this.props.updateCreateModelHideShow)
            ? (
		<Modal.Footer>
                <div>
                  <Link to={this.props.match.url} style={{
                    paddingRight: "10px"
                  }} >
                    <Button onClick={this.cancelCreateModel.bind(this)}>Cancel</Button>
                  </Link>
                  <Link to={hideUrl} >
                   <Button bsStyle="primary" onClick={this.closeModelPopup.bind(this)}>Hide</Button>
                   </Link>
                </div>
              </Modal.Footer>
			   )
            : (
              <div></div>
            )
}
		</Modal>
          </div>
       );
  }
}
