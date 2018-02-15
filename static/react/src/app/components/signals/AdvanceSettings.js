import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import store from "../../store";
import {Modal,Button, Tooltip,
    OverlayTrigger,} from "react-bootstrap";
import {advanceSettingsModal} from "../../actions/signalActions";
import {selectedAnalysisList,selectedDimensionSubLevel,cancelAdvanceSettings,saveAdvanceSettings,checkAllAnalysisSelected} from "../../actions/dataActions";


@connect((store) => {
	return {login_response: store.login.login_response,
		advanceSettingsModal:store.signals.advanceSettingsModal,
		dataPreview: store.datasets.dataPreview,
		getVarType: store.signals.getVarType,
		getVarText: store.signals.getVarText,
		dataSetAnalysisList:store.datasets.dataSetAnalysisList,
		dataSetPrevAnalysisList:store.datasets.dataSetPrevAnalysisList,
		selectedDimensionSubLevels:store.datasets.selectedDimensionSubLevels,
	};
})

export class AdvanceSettings extends React.Component {
	constructor(props){
		super(props);
		console.log(props)
		this.openAdvanceSettingsModal = this.openAdvanceSettingsModal.bind(this);
		this.dimensionSubLevel =null;
		//this.dimensionCountForMeasure = 

	}
			
	openAdvanceSettingsModal(){
		this.props.dispatch(advanceSettingsModal(true));
	}
	closeAdvanceSettingsModal(){
		this.props.dispatch(cancelAdvanceSettings());
		this.props.dispatch(advanceSettingsModal(false));
		this.props.dispatch(checkAllAnalysisSelected())
	}	
	updateAdvanceSettings(){
		this.props.dispatch(saveAdvanceSettings());
		this.props.dispatch(advanceSettingsModal(false));
	}

	handleAnlysisListActions(e){
		this.props.dispatch(selectedAnalysisList(e));
		this.props.dispatch(checkAllAnalysisSelected())
	}
	handleSubLevelAnalysis(evt){
		var id = evt.target.childNodes[0].id;
		this.props.dispatch(selectedAnalysisList(evt.target.childNodes[0],"noOfColumnsToUse"))
	}
	handleCustomInput(evt){
	    if(evt.target.value){
	        if(parseInt(evt.target.value) <= parseInt(evt.target.max)){
	            this.props.dispatch(selectedAnalysisList(evt.target,"noOfColumnsToUse"))   
	        }else{
	            evt.target.value = "";
	        }
	    }else{
	        this.props.dispatch(selectedAnalysisList(evt.target,"noOfColumnsToUse"))   
	    }
	}
	handleBinningInput(evt){
	    if(evt.target.value){
            if(parseInt(evt.target.value) <= parseInt(evt.target.max)){
                this.props.dispatch(selectedAnalysisList(evt.target,"association"))   
            }else{
                evt.target.value = "";
            }
        }else{
            //evt.target.value = evt.target.defaultValue;
            this.props.dispatch(selectedAnalysisList(evt.target,"association"))   
        }
	}
	handleTrendAnalysis(evt){
		this.props.dispatch(selectedAnalysisList(evt.target,"trend"))
	}
	renderAllAnalysisList(analysisList,trendSettings){
	
		let associationPlaceholder = "0-"+ store.getState().datasets.dataSetDimensions.length;
		let customMaxValue = store.getState().datasets.dataSetDimensions.length;
		
		var that = this;
		let list =   analysisList.map((metaItem,metaIndex) =>{
			let id = "chk_analysis_advance"+ metaIndex;

			if(metaItem.name.indexOf("trend") != -1){
				if(trendSettings){
					var specificMeasureClsName = "col-md-8 visibilityHidden";
					let specificMeasureStatus = false;
					let trendSub = trendSettings.map((trendSubItem,trendSubIndex)=>{
						let val = trendSubItem.name;
						if(trendSubItem.name.toLowerCase() == "count"){
							return(
									<li ><div className="col-md-4"><div className="ma-checkbox inline sub-analysis"><input className="possibleSubAnalysis" id="trend-count" type="radio" value="count" name="trend-sub"  checked={trendSubItem.status} onChange={this.handleTrendAnalysis.bind(this)}  /><label htmlFor="trend-count">Count</label></div></div><div class="clearfix"></div></li>
							);
						}else if(trendSubItem.name.toLowerCase().indexOf("specific measure") != -1){
							if(trendSubItem.status){
								specificMeasureClsName ="col-md-8";
								specificMeasureStatus = true;
							}
							return(
									<li ><div className="col-md-4">
									<div className="ma-checkbox inline sub-analysis"><input className="possibleSubAnalysis" id="trend-specific-measure" type="radio" value="specific measure" name="trend-sub"  checked={specificMeasureStatus}  onChange={this.handleTrendAnalysis.bind(this)} /><label htmlFor="trend-specific-measure">Specific Measure</label></div> 
									</div>
									<div className={specificMeasureClsName}> <select id="specific-trend-measure" className="form-control " onChange={this.handleTrendAnalysis.bind(this)}>
									{store.getState().datasets.dataSetMeasures.map(function(item,index){
										return(<option>{item.name}</option>)
									})
									}
									</select>
									</div>
									</li>
							);
						}
					})
					return(
							<li><div key={metaIndex} className="ma-checkbox inline"><input id={id} type="checkbox" className="possibleAnalysis" value={metaItem.name} checked={metaItem.status} onClick={this.handleAnlysisListActions.bind(this)}  /><label htmlFor={id}>{metaItem.displayName}</label></div>
							<ul className="list-unstyled">

							{trendSub}


							</ul>

							</li>);
				}else{
					return(
							<li><div key={metaIndex} className="ma-checkbox inline"><input id={id} type="checkbox" className="possibleAnalysis" value={metaItem.name} checked={metaItem.status} onClick={this.handleAnlysisListActions.bind(this)}  /><label htmlFor={id}>{metaItem.displayName}</label></div>
							</li>)
				}//end of trendsetting check
			}else{
			    if(metaItem.name.indexOf("influencer") != -1){
			      associationPlaceholder = "0-"+ (store.getState().datasets.dataSetMeasures.length -1);
			      customMaxValue = store.getState().datasets.dataSetMeasures.length -1;
			    }
				var countOptions=null, binOptions=null,binTemplate = null,options=[],customValueInput=null,customInputDivClass="col-md-5 md-p-0 visibilityHidden";
				var tooltipText = <Tooltip id="tooltip">Value should be less than or equal to {customMaxValue}</Tooltip>;
				if(metaItem.noOfColumnsToUse!= null){
					options = metaItem.noOfColumnsToUse.map((subItem,subIndex)=>{
						let clsName = "sub-level-analysis-count";
						let name = metaItem.name
						let idName = metaItem.name +"-level-"+subItem.name;
						let labelCls ="btn btn-default";
						let status = false;
						if(subItem.name.indexOf("custom") !=-1){
							let  customClsName = metaItem.name +"-level form-control";
							let customName = metaItem.name;
							let customIdName = metaItem.name +"-level-custom-val";
							if(subItem.status){
								customInputDivClass = "col-md-5 md-p-0";
							}
							customValueInput =     <OverlayTrigger  placement="top" overlay={tooltipText}><input type="number" id={subIndex} min="1" max={customMaxValue} value={subItem.value} onChange={this.handleCustomInput.bind(this)} placeholder={associationPlaceholder} className={customClsName} id={customIdName} name={customName}/></OverlayTrigger>

						}
						if(subItem.status){
							labelCls ="btn btn-default active";
							status = true;
						}
						return(
								<label key={subIndex} class={labelCls} onClick={this.handleSubLevelAnalysis.bind(this)}><input type="radio" className={clsName} id={idName} name={name} value={subItem.name} checked={status}/>{subItem.displayName}</label> 
						);
					});
					countOptions  = (function(){
						return(
								<div>
								<div className="col-md-7 md-pl-20">
								<div className="btn-group radioBtn" data-toggle="buttons">
								{options}
								</div>
								</div>
								<div className={customInputDivClass} id="divCustomInput">
								{customValueInput}
								</div>
								</div>
						);
					})();
				}
				if(metaItem.hasOwnProperty("binSetting")){
				    
				    binTemplate = metaItem.binSetting.map((binItem,binIndex)=>{
				        if(!binItem.hasOwnProperty("defaultValue")){
				            return (<label key={binIndex}><b>{binItem.displayName}</b></label>)  
				        }else{
				            return (<div className="form-group md-pt-15" id={binIndex}><label for="fl1" className="col-sm-9 control-label">{binItem.displayName}</label>
				            <div className="col-sm-3">
	                        <input id={binIndex} type="number" name={metaItem.name}  className="form-control" min={binItem.min} max={binItem.max} placeholder={binItem.defaultValue} defaultValue={binItem.value}   onChange={this.handleBinningInput.bind(this)}/>
	                        </div>
	                        </div>)    
				        }
				    });
				    
				    binOptions  = (function(){
                        return(
                                <div>
                                <div className="col-md-10 md-pl-20 md-pt-20">
                                {binTemplate}
                                </div>
                                </div>
                        );
                    })();
				    
				}

				return(
						<li><div key={metaIndex} className="ma-checkbox inline"><input id={id} type="checkbox" className="possibleAnalysis" value={metaItem.name} checked={metaItem.status} onClick={this.handleAnlysisListActions.bind(this)}  /><label htmlFor={id}>{metaItem.displayName}</label></div>
						<div className="clearfix"></div>
						{countOptions}
						<div className="clearfix"></div>
						{binOptions}
						</li>);
			}
		});
		return list;
	}

	render() {
		let dataPrev = store.getState().datasets.dataPreview;
		let renderModalAnalysisList = null, renderSubList=null;
		if(dataPrev){
			let possibleAnalysisList = store.getState().datasets.dataSetAnalysisList;
			let trendSettings = null;
			if(!$.isEmptyObject(possibleAnalysisList)){
				if(this.props.getVarType == "dimension"){
					possibleAnalysisList = possibleAnalysisList.dimensions.analysis;
					trendSettings = store.getState().datasets.dataSetAnalysisList.dimensions.trendSettings;
					renderModalAnalysisList = this.renderAllAnalysisList(possibleAnalysisList,trendSettings);
				}else if(this.props.getVarType == "measure"){
					possibleAnalysisList = possibleAnalysisList.measures.analysis;
					trendSettings = store.getState().datasets.dataSetAnalysisList.measures.trendSettings;
					renderModalAnalysisList = this.renderAllAnalysisList(possibleAnalysisList,trendSettings);
				}

			}
		}
		return (
				<div id="idAdvanceSettings">
				<Modal show={store.getState().signals.advanceSettingsModal} backdrop="static" onHide={this.closeAdvanceSettingsModal.bind(this)} dialogClassName="modal-colored-header">
				<Modal.Header closeButton>
				<h3 className="modal-title">Advance Settings</h3>
				</Modal.Header>

				<Modal.Body>
				<ul className="list-unstyled">
				{renderModalAnalysisList}
				</ul>

				</Modal.Body>

				<Modal.Footer>
				<Button onClick={this.closeAdvanceSettingsModal.bind(this)}>Cancel</Button>
				<Button bsStyle="primary" onClick={this.updateAdvanceSettings.bind(this)}>Save</Button>
				</Modal.Footer>

				</Modal>
				</div>
		);
	}
}
