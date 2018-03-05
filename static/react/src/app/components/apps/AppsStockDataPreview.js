import React from "react";
import {MainHeader} from "../common/MainHeader";
import {Tabs,Tab,Button} from "react-bootstrap";
import {DataPreview} from "../data/DataPreview";
import {StockUploadDomainModel} from "../apps/StockUploadDomainModel";
import {Link, Redirect} from "react-router-dom";
import store from "../../store";
import {connect} from "react-redux";
import {APPID1,APPID2,APPID3,APPNAME1,APPNAME2,APPNAME3} from "../../helpers/helper.js"
import {hideDataPreviewRightPanels,updateUploadStockPopup,getConceptsList,updateStockSlug} from "../../actions/appActions";
import {STATIC_URL} from "../../helpers/env.js"
import {isEmpty} from "../../helpers/helper";
import {getStockDataSetPreview} from "../../actions/dataActions";
import {AppsLoader} from "../common/AppsLoader";

@connect((store) => {
	return {login_response: store.login.login_response,
		currentAppId:store.apps.currentAppId,
		dataPreview: store.datasets.dataPreview,
		stockUploadDomainModal:store.apps.stockUploadDomainModal,
		stockSlug:store.apps.stockSlug,
		stockAnalysisFlag:store.apps.stockAnalysisFlag,
		signal: store.signals.signalAnalysis,
		};
})


export class AppsStockDataPreview extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
  }
  componentWillMount(){
	  if (this.props.dataPreview == null || isEmpty(this.props.dataPreview)||this.props.dataPreview.status == 'FAILED') {
		  this.props.dispatch(getStockDataSetPreview(this.props.match.params.slug));
		  this.props.dispatch(updateStockSlug(this.props.match.params.slug));
	  }
  }
  componentDidMount(){
      hideDataPreviewRightPanels();
			this.props.dispatch(getConceptsList());
  }
  componentWillUpdate(){
	  hideDataPreviewRightPanels();
  }
  componentDidUpdate(){
	  hideDataPreviewRightPanels();
  }
  updateUploadStockPopup(flag){
  	this.props.dispatch(updateUploadStockPopup(flag))
  }
  render() {
	  if(store.getState().apps.stockAnalysisFlag){
			let _linkAnalysis = "/apps-stock-advisor/"+store.getState().apps.stockSlug+ "/" + this.props.signal.listOfNodes[0].slug;
	    	return (<Redirect to={_linkAnalysis}/>);
	 }
	  let dataPreview = store.getState().datasets.dataPreview;
		if(dataPreview){
			return (
					<div >
	            <DataPreview history={this.props.history} match={this.props.match}/>" +
	            
	            <div className="row buttonRow" >
				
				
				<div class="col-md-11 col-md-offset-1 xs-pl-0">
				<div class="panel">
				<div class="panel-body no-border">
				
				<div className="navbar xs-mb-0">
						<ul className="nav navbar-nav navbar-right">
						 
						<li className="text-right"><Button to="/apps"> Close </Button> 
						</li>
						<li className="text-right">
							<Button bsStyle="primary" onClick={this.updateUploadStockPopup.bind(this,true)}> Proceed</Button>
						</li>
						</ul>
						</div> 
				
				</div>
				</div>
				</div>
				 
				</div>
				 
				<StockUploadDomainModel/>
				 <AppsLoader match={this.props.match}/>
	        </div>
	        );
		}else{
			return (
					   <div>
			            <img id="loading" src={ STATIC_URL + "assets/images/Preloader_2.gif"} />
			          </div>
			);
		}
  }
}
