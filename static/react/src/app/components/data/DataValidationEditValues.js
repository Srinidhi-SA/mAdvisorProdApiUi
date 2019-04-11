import React from "react";
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from "react-redux";
import { Redirect } from "react-router";
import store from "../../store";
import {Modal,Button,Tab,Row,Col,Nav,NavItem} from "react-bootstrap";
import {updateVLPopup,addComponents,addMoreComponentsToReplace,removeComponents,setReplacementType,handleSaveEditValues,handleInputChange,handleInputChangeReplace} from "../../actions/dataActions";
import {REPLACE,REMOVE,	CURRENTVALUE,NEWVALUE} from "../../helpers/helper.js"



@connect((store) => {
	return {login_response: store.login.login_response,
		dataList: store.datasets.dataList,
		dataPreview: store.datasets.dataPreview,
		variableTypeListModal:store.datasets.variableTypeListModal,
		dataTransformSettings:store.datasets.dataTransformSettings,
		selectedColSlug:store.datasets.selectedColSlug,
		dataSetColumnRemoveValues:store.datasets.dataSetColumnRemoveValues,
		dataSetColumnReplaceValues:store.datasets.dataSetColumnReplaceValues,
		dataTransformSettings:store.datasets.dataTransformSettings,

	};
})

export class DataValidationEditValues extends React.Component {
  constructor(){
    super();
    this.columnData = null;
  }
  showPopup(){
	  this.props.dispatch(updateVLPopup(true))
  }
  hidePopup(){
	  this.props.dispatch(updateVLPopup(false))
  }
  componentWillMount(){
	  this.props.dispatch(addComponents(this.props.selectedColSlug));
  }
  addMoreComponents(editType){
	  this.props.dispatch(addMoreComponentsToReplace(editType));
  }
  removeComponents(data,editType){
	  this.props.dispatch(removeComponents(data,editType));
  }
  handleInputChange(event){
	  this.props.dispatch(handleInputChange(event))
  }
  handleInputChangeReplace(targetBox,event){
	  this.props.dispatch(handleInputChangeReplace(targetBox,event))
  }
  handleSaveEditValues(){
	  this.props.dispatch(handleSaveEditValues(this.props.selectedColSlug))
  }
  renderReplaceList(colSlug,colName,colData,replaceType){
	  let optionList = null;
	  let list = colData.map((actionNames,index)=>{
		  if(actionNames.actionName == REPLACE){
			  optionList = actionNames.replaceTypeList.map((subItem,subIndex)=>{
					if(replaceType == subItem.name)
						return (<option key={subIndex} value={subItem.name} selected>{subItem.displayName}</option>);
					else 
						return (<option key={subIndex} value={subItem.name}>{subItem.displayName}</option>);
		   })
 			}
	  });
	  return optionList;
  }	
	render() {
		debugger;
	  var that = this;
	  let transformationSettings = store.getState().datasets.dataTransformSettings;
	  let replaceTypeList = "";
	  if(transformationSettings != undefined){
		  transformationSettings.map((columnData,columnIndex) =>{
		    if(that.props.selectedColSlug == columnData.slug){
		    	this.columnData = columnData;
		     	//replaceTypeList = that.renderReplaceList(columnData.slug,columnData.name,columnData.columnSetting)
		    }
			});
	  }
	  let dataSetColumnRemoveValues = this.props.dataSetColumnRemoveValues;
		let dataSetColumnReplaceValues = this.props.dataSetColumnReplaceValues;

	  const templateTextBoxes = dataSetColumnRemoveValues.map((data,id) =>{
			if(that.columnData != null){
		    replaceTypeList  = (function(){
                var optionValues = that.renderReplaceList(that.columnData.slug,that.columnData.name,that.columnData.columnSetting,data.replaceType);
               return optionValues;
            })();
		}
		  return (<div className="form-group" id={data.id} key={id}>
			<label for="fl1" className="col-sm-1 control-label"><b>{id+1}.</b></label>
			<div className="col-sm-4">
			<input  id={data.id} type="text" autocomplete="off" name={data.name}  onChange={this.handleInputChange.bind(this)} value={data.valueToReplace} className="form-control"/>
			</div>
			<div className="col-sm-3">
			 <select className="form-control" id={data.id} onChange={this.handleInputChange.bind(this)}>
			{replaceTypeList}
			 </select>
			</div>
			<div className="col-sm-1 cursor" onClick={this.removeComponents.bind(this,data,REMOVE)}><i className="fa fa-minus-square-o text-muted"></i></div>
			</div>);
	  });
	 const replaceTextBoxes = dataSetColumnReplaceValues.map((data,id) =>{
	     if(that.columnData != null){
	     replaceTypeList  = (function(){
			 var optionValues = that.renderReplaceList(that.columnData.slug,that.columnData.name,that.columnData.columnSetting,data.replaceType);
		    return optionValues;
		 })();
	     }
		  return (<div className="form-group" id={data.replaceId} key={data.replaceId}>
			<label for="fl1" className="col-sm-1 control-label"><b>{id+1}.</b></label>
			<div className="col-sm-3">
			<input  id={data.replaceId} placeholder="Current Value" type="text" autocomplete="off" name={data.name}  onChange={this.handleInputChangeReplace.bind(this,CURRENTVALUE)} value={data.valueToReplace} className="form-control"/>
			</div>
			<div className="col-sm-3">
			<input  id={data.replaceId} placeholder="New Value" type="text" autocomplete="off" name={data.name}  onChange={this.handleInputChangeReplace.bind(this,NEWVALUE)} value={data.replacedValue} className="form-control"/>
			</div>
			<div className="col-sm-3">
			 <select className="form-control" id={data.replaceId} onChange={this.handleInputChangeReplace.bind(this,data.replaceId)}>

			 {replaceTypeList}

			 </select>
			</div>

			<div className="col-sm-1 cursor" onClick={this.removeComponents.bind(this,data,REPLACE)}><i className="fa fa-minus-square-o"></i></div>
			</div>);

	  });

   return (
          <div id="idVariableTypeList" role="dialog" className="modal fade modal-colored-header">
      	<Modal show={store.getState().datasets.variableTypeListModal} backdrop="static" onHide={this.hidePopup.bind(this)} dialogClassName="modal-colored-header uploadData modal-lg">
      	<Modal.Header closeButton>
		<h3 className="modal-title">Edit Values</h3>
		</Modal.Header>

      	<Modal.Body className="dataTransformModal">

      	<div>
		<Tab.Container id="left-tabs-example" defaultActiveKey="Replace">
		<Row className="clearfix">
		<Col sm={3}>
		<Nav bsStyle="pills" stacked>
		<NavItem eventKey="Replace" >
		Replace
		</NavItem>
		<NavItem eventKey="Remove">
		Remove
		</NavItem>
		
		</Nav>
		</Col>

		<Col sm={9}>

		<Tab.Content animation>
		<Tab.Pane eventKey="Remove">

		<div className="tab-pane active cont fade in">
		<p className="page-header">Please enter symbols, phrases or values that you want to remove from the selected column
		</p>
		<div className="tb_content">
		<Scrollbars style={{ height: 300 }} renderTrackHorizontal={props => <div {...props} className="track-horizontal" style={{display:"none"}}/>}
        renderThumbHorizontal={props => <div {...props} className="thumb-horizontal" style={{display:"none"}}/>}>

		<div id="removeValues">
		<form role="form" className="form-horizontal">
		{templateTextBoxes}
		<div className="dataTransformValues">
		 <Button bsStyle="primary" onClick={this.addMoreComponents.bind(this,REMOVE)}>Add More&nbsp;<i className="fa fa-plus"></i></Button>
		</div>
		</form>
		</div>
		</Scrollbars>
		</div>

		</div>

		</Tab.Pane>
		<Tab.Pane eventKey="Replace">
		<div className="tab-pane active cont fade in">
		<p className="page-header">Please enter symbols, phrases or values that you want to replace along with the values to replace it with, from the selected column
        </p>

		<div className="tb_content">
		<Scrollbars style={{ height: 300 }} renderTrackHorizontal={props => <div {...props} className="track-horizontal" style={{display:"none"}}/>}
        renderThumbHorizontal={props => <div {...props} className="thumb-horizontal" style={{display:"none"}}/>}>
		<div id="replaceValues">
		<form role="form" className="form-horizontal">
		{replaceTextBoxes}
		<div className="dataTransformValues">
		 <Button bsStyle="primary" onClick={this.addMoreComponents.bind(this,REPLACE)}>Add More&nbsp;<i className="fa fa-plus"></i></Button>
		</div>
		</form>
		</div>
		</Scrollbars>
		</div>


		</div>
		</Tab.Pane>
		</Tab.Content>

		</Col>


		</Row>
		</Tab.Container>


	</div>

	 </Modal.Body>

		<Modal.Footer>
		<Button onClick={this.hidePopup.bind(this)}>Cancel</Button>
	    <Button bsStyle="primary" onClick={this.handleSaveEditValues.bind(this)}>Save</Button>
		</Modal.Footer>

		</Modal>
          </div>
       );
  }
}
