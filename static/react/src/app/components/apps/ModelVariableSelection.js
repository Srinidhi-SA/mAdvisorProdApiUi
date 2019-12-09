import React from "react";
import { MainHeader } from "../common/MainHeader";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import store from "../../store";
import { Modal, Button, Tab, Row, Col, Nav, NavItem, Form, FormGroup, FormControl } from "react-bootstrap";

import { C3Chart } from "../c3Chart";
import { DataVariableSelection } from "../data/DataVariableSelection";
import { updateTrainAndTest, createModel, updateSelectedVariable, showLevelCountsForTarget, updateTargetLevel, saveSelectedValuesForModel, updateRegressionTechnique, updateCrossValidationValue, getAppDetails, reSetRegressionVariables, selectMetricAction } from "../../actions/appActions";
import { AppsLoader } from "../common/AppsLoader";
import { getDataSetPreview, showAllVariables } from "../../actions/dataActions";
import { hideTargetVariable } from "../../actions/signalActions";
import { SET_VARIABLE, statusMessages } from "../../helpers/helper";
import { options } from "react-bootstrap-dialog";

@connect((store) => {
    return {
        login_response: store.login.login_response, dataPreview: store.datasets.dataPreview,
        trainValue: store.apps.trainValue, testValue: store.apps.testValue,
        modelSummaryFlag: store.apps.modelSummaryFlag,
        modelSlug: store.apps.modelSlug,
        targetLevelCounts: store.apps.targetLevelCounts,
        currentAppDetails: store.apps.currentAppDetails,
        regression_selectedTechnique: store.apps.regression_selectedTechnique,
        regression_crossvalidationvalue: store.apps.regression_crossvalidationvalue,
        metricSelected: store.apps.metricSelected,
        allModelList: store.apps.allModelList,
        editmodelModelSlug:store.datasets.editmodelModelSlug,
        modelEditconfig:store.datasets.modelEditconfig
    };
})

export class ModelVariableSelection extends React.Component {
    constructor(props) {
        super(props);
        this.state={
			targetCountVal:'',
		}
    }
    componentWillMount() {
        const from = this.getValueOfFromParam();
         if (from === 'data_cleansing') {
        } 
        else{
        this.props.dispatch(saveSelectedValuesForModel("","",""));
        this.props.dispatch(selectMetricAction("","",""));
        this.props.dispatch(getAppDetails(this.props.match.params.AppId));
        if (this.props.dataPreview == null) {
            this.props.dispatch(getDataSetPreview(this.props.match.params.slug));
        }
        this.props.dispatch(reSetRegressionVariables());
        this.props.dispatch(updateTrainAndTest(50));
        this.props.dispatch(updateTargetLevel(null));
        if (this.props.dataPreview != null)
            this.props.dispatch(showAllVariables(this.props.dataPreview, this.props.match.params.slug));
    }
}

    getValueOfFromParam() {
        if(this.props.location === undefined){
        }
       else{
        const params = new URLSearchParams(this.props.location.search);
        return params.get('from');
    }
}
    handleRangeSlider(e) {
        this.props.dispatch(updateTrainAndTest(e.target.value))
    }
    createModel(event) {
        event.preventDefault();
        console.log("came here: ================================");
        let letters = /^[0-9a-zA-Z\-_\s]+$/;
        
        let allModlLst = Object.values(this.props.allModelList)
        
        var creatModelName = $('#createModelName').val();

        if ($('#createModelAnalysisList option:selected').val() == "") {
            bootbox.alert("Please select a variable to analyze...");
            return false;
        } else if ((this.props.currentAppDetails.app_id != 13 && this.props.targetLevelCounts != null) && ($("#createModelLevelCount").val() == null || $("#createModelLevelCount").val() == "")) {
            bootbox.alert("Please select a sublevel value to analyze...");
            return false;
        } else if (this.props.currentAppDetails.app_id === 13 && this.state.targetCountVal != "" && ($("#createModelLevelCount").val() == null || $("#createModelLevelCount").val() == "")) {
            bootbox.alert("Please select a sublevel value to analyze...");
            return false;
        }else if ($('#createModelAnalysisList option:selected').val() == "") {
            bootbox.alert("Please select a variable to analyze...");
            return false;
        } else if (creatModelName != "" && creatModelName.trim() == "") {
            bootbox.alert(statusMessages("warning", "Please enter a valid model name.", "small_mascot"));
            $('#createModelName').val("").focus();
            return false;
        } else if (letters.test(creatModelName) == false){
            bootbox.alert(statusMessages("warning", "Please enter model name in a correct format. It should not contain special characters .,@,#,$,%,!,&.", "small_mascot"));
            $('#createModelName').val("").focus();
            return false;
        } else if(!(allModlLst.filter(i=>(i.name).toLowerCase() == creatModelName.toLowerCase()) == "") ){
			bootbox.alert(statusMessages("warning", "Model by name \""+ creatModelName +"\" already exists. Please enter a new name.", "small_mascot"));
			return false;
		}

        if (this.props.currentAppDetails.app_type == "REGRESSION" || this.props.currentAppDetails.app_type == "CLASSIFICATION") {
            this.props.dispatch(saveSelectedValuesForModel($("#createModelName").val(), $("#createModelAnalysisList").val(), $("#createModelLevelCount").val()));
            let regressionProccedUrl = this.props.match.url + '/dataCleansing';
            this.props.history.push(regressionProccedUrl);
        }
        else
            this.props.dispatch(createModel($("#createModelName").val(), $("#createModelAnalysisList").val(), $("#createModelLevelCount").val(),'analyst'))
    }
    setPossibleList(event) {
        this.props.dispatch(showLevelCountsForTarget(event))
        this.props.dispatch(hideTargetVariable(event));
        this.props.dispatch(updateSelectedVariable(event));

        if(this.props.currentAppDetails.app_id === 13){
          let target =  $("#createModelAnalysisList").val();
          let targetUniqueVal= this.props.dataPreview.meta_data.uiMetaData.columnDataUI.filter(i => i.name=== target)[0].columnStats.filter(j=>j.displayName === "Unique Values")[0].value
          targetUniqueVal <=5 && bootbox.alert(statusMessages("warning","Please proceed with automated prediction to get better results as this dataset has less than 5 unique value for the selected target column"));
            if(targetUniqueVal <=5){
                let oo = this.props.dataPreview.meta_data.uiMetaData.columnDataUI.filter(i => i.name=== target)[0].columnStats.filter(j=>j.name === "LevelCount")[0].value;
                this.setState({targetCountVal:Object.keys(oo)});
            }else{
                this.setState({targetCountVal:""});

            }
        }
    }

    setEvaluationMetric(event) {
        var evalMet = event.target.childNodes[event.target.selectedIndex];
        var displayName = evalMet.getAttribute("name");
        var name = evalMet.getAttribute("value");
        this.props.dispatch(selectMetricAction( name, displayName, true));
    }

    handleOptionChange(e) {
        this.props.dispatch(updateRegressionTechnique(e.target.value));
        //this.setState({ selectedTechnique: e.target.value});
    }
    changecrossValidationValue(e) {
        this.props.dispatch(updateCrossValidationValue(e.target.value));
        //this.setState({ crossvalidationvalue: e.target.value});
    }
    noOfFolds(e){
        let foldVal = parseFloat(e.target.value);
        if(e.target.value == "" || e.target.value == "NaN"){
            document.getElementById("noOfFolds").innerText = "Please enter a number";
        }else if(foldVal>20 || foldVal <2){
            document.getElementById("noOfFolds").innerText = "Value Should be between 2 to 20";
        }else if((foldVal^0) != foldVal){
            document.getElementById("noOfFolds").innerText = "Decimals are not allowed";
        }else{
            document.getElementById("noOfFolds").innerText = "";
        }
    }
    render() {
        console.log("Create Model Variable Selection  is called##########3");
        let custom_word1 = "";
        let custom_word2 = "";
        var modelValidation = "";
        var noOfROws = "";
        var buttonName = "Create Model";
        // noOfROws = store.getState().datasets.dataPreview.meta_data.uiMetaData.metaDataUI.filter(row => row.displayName === "Rows").find(function (elements) {
        //     return elements;
        // }).value;
        if (store.getState().apps.modelSummaryFlag) {
            let _link = "/apps/" + store.getState().apps.currentAppDetails.slug + '/analyst/models/' + store.getState().apps.modelSlug;
            return (<Redirect to={_link} />);
        }
        let dataPrev = store.getState().datasets.dataPreview;
        let renderSelectBox = null;
        let renderLevelCountSelectBox = null;
        if (dataPrev && store.getState().apps.currentAppDetails != null) {
            const metaData = dataPrev.meta_data.uiMetaData.varibaleSelectionArray;
            const sortedMetaData = (metaData.sort((a, b) => {
                                        if (a.name < b.name)
                                            return -1;
                                        if (a.name > b.name)
                                            return 1;
                                        return 0;
                                    }));                    
            if (sortedMetaData) {
                renderSelectBox = <select className="form-control" onChange={this.setPossibleList.bind(this)} defaultValue={store.getState().apps.apps_regression_targetType} id="createModelAnalysisList">
                    <option value="">--Select--</option>
                    {store.getState().apps.currentAppDetails.app_type == "REGRESSION" ?
                        sortedMetaData.map((metaItem, metaIndex) => {
                            if (metaItem.columnType == "measure" && !metaItem.dateSuggestionFlag && !metaItem.uidCol) {
                                return (<option key={metaItem.slug} name={metaItem.slug} value={metaItem.name}>{metaItem.name}</option>)
                            }
                        }) :
                        sortedMetaData.map((metaItem, metaIndex) => {
                            if (metaItem.columnType != "measure" && metaItem.columnType != "datetime" && !metaItem.dateSuggestionFlag && !metaItem.uidCol) {
                                return (<option key={metaItem.slug} name={metaItem.slug} value={metaItem.name}>{metaItem.name}</option>)
                            }
                        })
                    }
                </select>
            } else {
                renderSelectBox = <option>No Variables</option>
            }
            if (this.props.targetLevelCounts != null && this.props.currentAppDetails.app_id != 13) {
                renderLevelCountSelectBox = <select className="form-control" id="createModelLevelCount" defaultValue={store.getState().apps.apps_regression_levelCount}>
                    <option value="">--Select--</option>
                    {this.props.targetLevelCounts.sort().map((item, index) => {

                        return (<option key={item} name={item} value={item}>{item}</option>)
                    }
                    )}
                </select>
            }else if(this.props.currentAppDetails.app_id === 13){
                renderLevelCountSelectBox = <select className="form-control" id="createModelLevelCount" defaultValue={store.getState().apps.apps_regression_levelCount}>
                    <option value="">--Select--</option>
                    {
                        (this.state.targetCountVal != "")?
                            this.state.targetCountVal.sort().map((item, index) => {
                                return (<option key={item} name={item} value={item}>{item}</option>)
                            })
                        : ""
                    }
                </select>
            }
        }
        if (this.props.currentAppDetails != null) {
            custom_word1 = this.props.currentAppDetails.custom_word1;
            custom_word2 = this.props.currentAppDetails.custom_word2;

            if (store.getState().apps.currentAppDetails.app_type == "REGRESSION" || store.getState().apps.currentAppDetails.app_type == "CLASSIFICATION") {
                buttonName = "Proceed";
                modelValidation = <div className="col-lg-8">
                    <h4>Model Validation</h4>
                    <div class="xs-pb-10">
                        <div class="ma-radio inline"><input type="radio" class="timeDimension" name="modalValidation" id="trainTestValidation" value="trainTestValidation" onChange={this.handleOptionChange.bind(this)} checked={store.getState().apps.regression_selectedTechnique == "trainTestValidation"} /><label for="trainTestValidation">Train Test Validation</label></div>

                        <div class="ma-radio inline"><input type="radio" class="timeDimension" name="modalValidation" id="crossValidation" value="crossValidation" onChange={this.handleOptionChange.bind(this)} checked={store.getState().apps.regression_selectedTechnique == "crossValidation"} /><label for="crossValidation">Cross Validation</label></div>
                    </div>
                    {store.getState().apps.regression_selectedTechnique == "crossValidation" ?
                        <div class="form-group">
                            <label class="col-lg-4 control-label" for="noOffolds">No of Folds :</label>
                            <div class="col-lg-8">
                                <input type="number" name="" class="form-control" required={true} id="noOffolds" onInput={this.noOfFolds.bind(this)} onChange={this.changecrossValidationValue.bind(this)} min={2} max={20} value={store.getState().apps.regression_crossvalidationvalue} />
                            <div className="text-danger" id="noOfFolds"></div>                            
                            </div>
                        </div> :
                        <div id="range">
                            <div id="rangeLeftSpan" >Train <span id="trainPercent">{store.getState().apps.trainValue}</span></div>
                            <input type="range" id="rangeElement" onChange={this.handleRangeSlider.bind(this)} min={50} defaultValue={50} />
                            <div id="rangeRightSpan" ><span id="testPercent">{store.getState().apps.testValue}</span> Test </div>
                        </div>
                    }
                </div>
            }
            else {
                buttonName = "Create Model";
                modelValidation = <div className="col-lg-8">
                    <div id="range" >
                        <div id="rangeLeftSpan" >Train <span id="trainPercent">{store.getState().apps.trainValue}</span></div>
                        <input type="range" id="rangeElement" onChange={this.handleRangeSlider.bind(this)} min={50} defaultValue={50} />
                        <div id="rangeRightSpan" ><span id="testPercent">{store.getState().apps.testValue}</span> Test </div>
                    </div>
                </div>
            }
        }
        let metric = "";
        let metricValues = "";
        if(this.props.currentAppDetails !=null)
            if(this.props.currentAppDetails.app_id==2)
                metric = dataPrev.meta_data.uiMetaData.SKLEARN_CLASSIFICATION_EVALUATION_METRICS;
            else{
                metric = dataPrev.meta_data.uiMetaData.SKLEARN_REGRESSION_EVALUATION_METRICS;  
            }
        if (metric) {
            metricValues = <select className="form-control" onChange={this.setEvaluationMetric.bind(this)} defaultValue={this.props.metricSelected.name} id="selectEvaluation" required={true}>
                <option value="">--select--</option>
                {metric.map((mItem, mIndex) => {
                    return (<option key={mItem.name} name={mItem.displayName} value={mItem.name}>{mItem.displayName}</option>)
                })
                }
            </select>
        } else {
            metricValues = <option>No Options</option>
        }
        return (
            <div className="side-body">
                <div className="page-head">
                    <div className="row">
                        <div className="col-md-8">
                            <h3 class="xs-mt-0 text-capitalize">Variable Selection</h3>
                        </div>
                    </div>
                    <div className="clearfix"></div>
                </div>
                <div className="main-content">

                    <div className="panel panel-default box-shadow">
                        <div className="panel-body">
                            <Form onSubmit={this.createModel.bind(this)} className="form-horizontal">
                                <FormGroup role="form">

                                    <div className="row">

                                        <div className="form-group hidden">
                                            <label className="col-lg-4"><h4>I want to predict {custom_word1}</h4></label>
                                        </div>
                                    </div>

                                    <label className="col-lg-2 control-label cst-fSize">I want to predict :</label>
                                    <div className="col-lg-4"> {renderSelectBox}</div>
                                    <div className="clearfix"></div>

                                    {/*<!-- /.col-lg-4 -->*/}

                                    {(this.props.targetLevelCounts != null) ? 
                                        (<div className="xs-mt-20 xs-mb-20">
                                            <label className="col-lg-2 control-label">Choose Value for {custom_word2} :</label>
                                            <div className="col-lg-4"> {renderLevelCountSelectBox}</div>
                                        </div>) 
                                    : 
                                        this.state.targetCountVal != "" ?
                                        (<div className="xs-mt-20 xs-mb-20">
                                            <label className="col-lg-2 control-label">Choose Value for {custom_word2} :</label>
                                            <div className="col-lg-4"> {renderLevelCountSelectBox}</div>
                                        </div>)
                                        :
                                        (<div></div>)

                                    }
                                </FormGroup>
                                <FormGroup role="form">
                                    <DataVariableSelection match={this.props.match} location={this.props.location} />
                                </FormGroup>

                                <FormGroup role="form">
                                    <div class="col-md-8">
                                        {modelValidation}
                                    </div>
                                    <div class="clearfix"></div>
                                    <div class="col-md-8">
                                        <div class="col-md-8">
                                            <div class="form-group">
                                                <label class="col-lg-4 control-label" for="selectEvaluation">Evaluation Metric :</label>
                                                <div class="col-lg-8">
                                                    {metricValues}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group xs-ml-10 xs-mr-10">
                                            <div class="input-group xs-mb-15">
                                                <input type="text" defaultValue={store.getState().apps.apps_regression_modelName} name="createModelName" required={true} id="createModelName" autoComplete="off" className="form-control" placeholder="Create Model Name" /><span class="input-group-btn">
                                                    <button type="submit" class="btn btn-primary">{buttonName}</button></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="clearfix"></div>
                                </FormGroup>
                            </Form>
                        </div>
                    </div>
                </div>
                <AppsLoader match={this.props.match} />
            </div>
        );

    }
}
