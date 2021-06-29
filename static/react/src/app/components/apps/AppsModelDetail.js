import React from "react";
import {connect} from "react-redux";
import store from "../../store";
import {Button} from "react-bootstrap";
import {AppsCreateScore} from "./AppsCreateScore";
import {Card} from "../signals/Card";
import {getAppsModelSummary,updateModelSlug,handleExportAsPMMLModal,getAppDetails,updateModelSummaryFlag, getAppsAlgoList, clearAppsAlgoList} from "../../actions/appActions";
import {storeSignalMeta} from "../../actions/dataActions";
import {STATIC_URL} from "../../helpers/env.js"
import {isEmpty} from "../../helpers/helper";
import {Link} from "react-router-dom";
import {ExportAsPMML} from "./ExportAsPMML";
import {AppsModelHyperDetail} from "./AppsModelHyperDetail"

@connect((store) => {
	return {
		modelList:store.apps.modelList,
		modelSummary:store.apps.modelSummary,
		modelSlug:store.apps.modelSlug,
		currentAppId:store.apps.currentAppId,
		currentAppDetails:store.apps.currentAppDetails,
	};
})

export class AppsModelDetail extends React.Component {
  constructor(props) {
    super(props);
		this.state={
			showHyperparameterSummary:false
		}
  }
  componentWillMount() {
		this.props.dispatch(storeSignalMeta(null,this.props.match.url));
		if(this.props.currentAppDetails == null)
			this.props.dispatch(getAppDetails(this.props.match.params.AppId));
		if(isEmpty(this.props.modelSummary)){
			this.props.dispatch(getAppsModelSummary(this.props.match.params.slug));
			this.props.dispatch(updateModelSlug(this.props.match.params.slug));
		}
		this.props.dispatch(clearAppsAlgoList());
	}
	
	print() {
		window.print();
	}

	componentDidMount() {
		if(document.getElementsByClassName("noTable")[0] !=undefined){
			document.getElementsByClassName("noTable")[0].parentElement.parentElement.nextElementSibling.className = "col-md-8 col-md-offset-2"
			let element = document.getElementsByClassName("noTable")[0].parentElement.parentElement.nextElementSibling.children[0].firstElementChild;
			element.remove()
		}
		if(Object.keys(this.props.modelList).length != 0 && this.props.modelList.data.filter(i=>i.slug === this.props.modelSlug)[0].viewed === false){
			$(".notifyBtn").trigger('click');
		}
		window.scrollTo(0, 0);
		if(!isEmpty(store.getState().apps.modelSummary)){
			if(store.getState().apps.modelSummary.slug != store.getState().apps.modelSlug)
			this.props.dispatch(getAppsModelSummary(store.getState().apps.modelSlug));
		}
		this.props.dispatch(getAppsAlgoList(1));
	}

  componentDidUpdate(){
		$(".chart-data-icon").next("div").next("div").removeClass("col-md-7 col-md-offset-2").addClass("col-md-10")
  }
  handleExportAsPMMLModal(flag){
		this.props.dispatch(handleExportAsPMMLModal(flag))
  }
  updateModelSummaryFlag(flag){
		this.props.dispatch(updateModelSummaryFlag(flag))
  }
	gotoHyperparameterSummary(){
		this.setState({showHyperparameterSummary:true})
	}
  render() {
		if(this.state.showHyperparameterSummary)
			return(<AppsModelHyperDetail match={this.props.match}/>)
  	const modelSummary = store.getState().apps.modelSummary;
	 	var showExportPmml = true;
		var showCreateScore = true;
		var hyperParameterData;
		let mlink = window.location.pathname.includes("analyst")?"/analyst":"/autoML"
		if (!$.isEmptyObject(modelSummary)) {
			hyperParameterData = store.getState().apps.modelSummary.data.model_hyperparameter;
      showExportPmml = modelSummary.permission_details.downlad_pmml;
			showCreateScore = modelSummary.permission_details.create_score;
			var failedAlgorithms =	modelSummary.data.config.fail_card.filter(i=>i.success==="False").map(i=>i.Algorithm_Name).map(a => a.charAt(0).toUpperCase() + a.substr(1)).join(', ');
			var listOfCardList = modelSummary.data.model_summary.listOfCards;	
			var componentsWidth = 0;
			var cardDataList = "";
			let that = this;
			if(!$.isEmptyObject(listOfCardList)){
				cardDataList = listOfCardList.map((data, i) => {
					let selAlgoList = Object.values(that.props.modelSummary.TrainAlgorithmMapping)
					var cardDataArray = data.cardData;
					if(that.props.currentAppDetails.app_id === 2){
						if(data.cardData.filter(i=>i.dataType==="c3Chart").length>0){
							cardDataArray = []
						}
						else if(cardDataArray.filter(i=>i.dataType==="html").length>0 && !that.props.modelSlug.includes("_shared")){
							let headCard = cardDataArray.filter(i=>i.dataType==="html");
							if(headCard[0].data.includes("'sm-mb-20'")){
								let algoNam= headCard[0].data.replace(/<[^>]+>/g, '').replace(/ /g,'').toLocaleUpperCase();
								let algorithmName = ""
								switch(algoNam){
									case "LOGISTICREGRESSION": algorithmName = "LG";
										break;
									case "XGBOOST": algorithmName = "XG";
										break;
									case "RANDOMFOREST": algorithmName = "RF";
										break;
									case "NAIVEBAYES": algorithmName = "NB";
										break;
									case "NEURALNETWORK(PYTORCH)": algorithmName = "PT";
										break;
									case "NEURALNETWORK(TENSORFLOW)": algorithmName = "TF";
										break;
									case "NEURALNETWORK(SKLEARN)": algorithmName = "NN";
										break;
									case "ENSEMBLE": algorithmName = "EN";
										break;
									case "ADABOOST": algorithmName = "ADAB";
										break;
									case "LIGHTGBM": algorithmName = "LGBM";
										break;
								}
								let sel = selAlgoList.filter(i => (i.model_id).includes(algorithmName+"_"))
								let link = { classTag: null,
									data: "<a class=summaryLink href=/apps/automated-prediction-30vq9q5scd/autoML/modelManagement/"+sel[0].slug+">(For More Info Click Here)</a>",
									dataType: "html" }
								cardDataArray.push(link)
							}
						}
					}else if(that.props.currentAppDetails.app_id === 13 && !that.props.modelSlug.includes("_shared")){
						if(cardDataArray.filter(i=>i.dataType==="html").length>0){
							let headCard = cardDataArray.filter(i=>i.dataType==="html");
							if(headCard[0].data.includes("'sm-mb-20'")){
								cardDataArray[0].data = cardDataArray[0].data.replace("<small>Summary</small>","")
								let regAlgoName= headCard[0].data.replace(/<[^>]+>/g, '')
								let algorithmName = ""
								switch(regAlgoName){
									case "Gradient Boosted Tree Regression": algorithmName = "GB";
										break;
									case "Random Forest Regression": algorithmName = "RFR";
										break;
									case "Decision Tree Regression": algorithmName = "DT"
										break;
									case "Linear Regression": algorithmName = "LR"
										break;
									case "Neural Network (TensorFlow)": algorithmName = "TF";
										break;
								}
								let sel = selAlgoList.filter(i => (i.model_id).includes(algorithmName+"_"))
								let link = { classTag: null,
									data: "<a class=summaryLinkReg href=/apps/automated-prediction-30vq9q5scd/autoML/modelManagement/"+sel[0].slug+">(For More Info Click Here)</a>",
									dataType: "html" }
								cardDataArray.splice(1, 0, link);
							}
						}
					}
					var clearfixClass = "col-md-"+data.cardWidth*0.12+" clearfix";
					var nonClearfixClass = "col-md-"+data.cardWidth*0.12;
					if(cardDataArray.length>0){
						if((cardDataArray.filter(i=>(i.dataType==="table" && i.data.tableData.length===1))).length!=0 ){
							let newData = {}
							newData = cardDataArray[0]
							cardDataArray = []
							cardDataArray[0] = newData
							cardDataArray[0].classTag = "noTable"
						}
						if(data.cardWidth == 100){
							componentsWidth = 0;
							return (<div key={i} className={clearfixClass}><Card cardData={cardDataArray} cardWidth={data.cardWidth}/></div>)
						}else if(componentsWidth == 0 || componentsWidth+data.cardWidth > 100){
							componentsWidth = data.cardWidth;
							return (<div key={i} className={clearfixClass}><Card cardData={cardDataArray} cardWidth={data.cardWidth}/></div>)
						}else{
							componentsWidth = componentsWidth+data.cardWidth;
							return (<div key={i} className={nonClearfixClass}><Card cardData={cardDataArray} cardWidth={data.cardWidth}/></div>)
						}
					}else{
						componentsWidth = componentsWidth+data.cardWidth;
						return (<div key={i} className={nonClearfixClass}></div>)
					}
				});
			}
			if(listOfCardList){
				return(
					<div className="side-body">
						<div className="main-content">
							<div className="row">
								<div className="col-md-12">
								<h3 className="xs-mt-0">{store.getState().apps.modelSummary.name}
									<div className="btn-toolbar pull-right">
										<div className="btn-group summaryIcons">
											<button type="button" className="btn btn-default" onClick={this.print.bind(this)} title="Print Document"><i className="fa fa-print"></i></button>
											<button type="button" className="btn btn-default" disabled = "true" title="Document Mode">
												<i class="fa fa-columns"></i>
											</button>
											<Link className="btn btn-default continue btn-close" to={`/apps/${this.props.match.params.AppId}${mlink}/models`} onClick={this.updateModelSummaryFlag.bind(this,false)}>
												<i class="fa fa-times"></i>
											</Link>
										</div>
									</div>
								</h3>
								<div className="clearfix"></div>
								<div className={this.props.match.params.AppId === "regression-app-6u8ybu4vdr"?"panel panel-mAd documentModeSpacing box-shadow regSpacing":"panel panel-mAd documentModeSpacing box-shadow"}>
									<div className="panel-body no-border">
										<div className="container-fluid">
											{cardDataList}
										</div>
										{failedAlgorithms.length>0 && <div>* Failed Algorithms: {failedAlgorithms}.</div>}
										<div className="col-md-12 text-right xs-mt-30">
											{!$.isEmptyObject(hyperParameterData)?
												<span>
													<Button bsStyle="primary" onClick={this.gotoHyperparameterSummary.bind(this,true)}><i className="fa fa-undo"></i> Back</Button>
													<span className="xs-pl-10"></span>
												</span>:""
											}
											{showExportPmml?<Button bsStyle="primary" onClick={this.handleExportAsPMMLModal.bind(this,true)}>Export As PMML</Button>:""}
											{showCreateScore? <AppsCreateScore match={this.props.match}/>:""}
										</div>   
									</div>
									<ExportAsPMML/>
								</div>
							</div>
						</div>
					</div>
				</div>
				);
			}
		}
		else{
			return (
				<div className="side-body">
						<img id="loading" src={ STATIC_URL + "assets/images/Preloader_2.gif" } />
				</div>
			);
		}
	}
}
