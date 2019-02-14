import React from "react";
import { connect } from "react-redux";
import { Scrollbars } from 'react-custom-scrollbars';
import {MultiSelect} from 'primereact/multiselect';
import { Button, Dropdown, Menu, MenuItem, Modal, Nav, NavItem, Tab, Row, Col } from "react-bootstrap";
import {
  openBinsOrLevelsModalAction,
  closeBinsOrLevelsModalAction,
  openTransformColumnModalAction,
  closeTransformColumnModalAction,
  selectedBinsOrLevelsTabAction,
} from "../../actions/dataActions";

@connect((store) => {
  return {
    login_response: store.login.login_response,
    dataPreview: store.datasets.dataPreview,
    dataSets: store.datasets.allDataSets,
    binsOrLevelsShowModal: store.datasets.binsOrLevelsShowModal,
    transferColumnShowModal: store.datasets.transferColumnShowModal,
    selectedBinsOrLevelsTab: store.datasets.selectedBinsOrLevelsTab,
    selectedItem: store.datasets.selectedItem,
    featureEngineering:store.datasets.featureEngineering,
  };
})

export class Levels extends React.Component {
  constructor(props) {
    super(props);
    this.pickValue = this.pickValue.bind(this);
    this.state = { levelsArray: this.props.levelsData ,}


  // this.handleRemoveLevel = this.handleRemoveLevel.bind(this);
  }

  getAllOptions(){
    let levelOptions = Object.keys(this.props.dataPreview.meta_data.scriptMetaData.columnData.filter(item => item.slug == this.props.selectedItem.slug )[0].columnStats.filter(options => (options.name == "LevelCount"))[0].value)
    levelOptions.sort();
    return levelOptions
  }

  // datasets.dataPreview.meta_data.scriptMetaData.columnData[3].columnStats[""0""].value


  getMultiSelectOptions(idx){
    var allSelectedItemsExceptCur = this.getAllSelectedOptionsExceptCurrent(idx);
      return this.getAllOptions().filter(item => !allSelectedItemsExceptCur.has(item)).map(function(elem) {
        return {"label": elem, "value" : elem };
      });
  }

  getAllSelectedOptionsExceptCurrent(idx){
    var allSelectedItems = new Set();
    this.state.levelsArray.map(function(elem,elemIdx){
      if(elemIdx != idx){
        allSelectedItems = new Set([...allSelectedItems,...elem.multiselectValue])
      }
    });
    return allSelectedItems;
  }

  componentWillMount() {
    console.log("Levels componentWillMount method is called...");
    this.addNewLevel();

  }
  componentWillUpdate(){
    this.props.parentUpdateLevelsData(this.state.levelsArray);
  }

   componentDidMount() {
	if ($('#dimSEdate').hasClass('wide-modal')) {
		$('.modal-colored-header').addClass('modal-lg-dimSEdate');
	}
 }

  handleLevelSubmit = evt => {

  };

  addNewLevel(){
    var newObj = {"inputValue":"", "multiselectValue":"","startDate":"", "endDate":""};
    this.setState({
      levelsArray: this.state.levelsArray.concat([newObj,])
    });
  };

  handleRemoveLevel(idx, event){
    this.setState({
      levelsArray: this.state.levelsArray.filter((s, sidx) => idx !== sidx)
    });
    this.props.parentUpdateLevelsData(this.state.levelsArray);
  };

  getLevelData(){
    var levelData = {};
    if(this.props.featureEngineering != undefined || this.props.featureEngineering !=null){
    var slugData = this.props.featureEngineering[this.props.selectedItem.slug];
      if(slugData != undefined){
        levelData = slugData.levelData;
      }
    }
    return levelData;
  }

  pickValue(event){
    this.props.parentPickValue("levelData", event);
  }

  onchangeInput(event){
    return event.target.value;
  }

  onClickCheckBox(event) {
    var checkedValue = event.target.checked;
    var checkedAttr = event.target.name;
    console.log("checkedval:", checkedValue, "checkedAttr:", checkedAttr);
    if (checkedValue) {
        this.state.statesArray.filter(item => item.name == checkedAttr);
    } else {
        var obj = { name: checkedAttr };
        if (this.state.statesArray[checkedAttr] != undefined) {
          this.state.statesArray.push(obj);
        }
      }
    }

    inputOnChangeHandler(idx, valueToChange, event){
      var newArray = this.state.levelsArray;
      newArray[idx][valueToChange] = event.target.value;
      this.setState({
        levelsArray: newArray
      });
    }

    multiSelectOnChangeHandler(idx,event){
      var newArray = this.state.levelsArray;
      newArray[idx]["multiselectValue"] = event.target.value;
      this.setState({
        levelsArray: newArray
      });
    }

  render() {
    console.log("Levels render method is called...");


if(this.props.selectedItem.columnType == "dimension")
{
    var levelData = this.getLevelData();
        var levels = "";
    levels = (
      <Tab.Pane>
        <form id="binsForm">
      <div>
        {this.state.levelsArray.map((level, idx) => (
          <div className="form_withrowlabels form-inline" key={idx} >
          <div className="form-group">
            <label for="txt_lName1">{`${idx + 1}`}&nbsp;&nbsp;&nbsp;</label>
            <input type="text" value={level.inputValue}  name={`name #${idx + 1}`} name="newcolumnname" className="form-control" placeholder={`Level #${idx + 1} name`} onInput={this.inputOnChangeHandler.bind(this, idx, "inputValue")} />
          </div>
          <div className="form-group">
            <label for="txt_sPeriod">&nbsp;&nbsp;&nbsp; Which will include:&nbsp;</label>
          </div>
          <div className="form-group">

          <div className="content-section implementation multiselect-demo">
          <MultiSelect value={level.multiselectValue} options={this.getMultiSelectOptions(idx)} onChange={this.multiSelectOnChangeHandler.bind(this,idx)}
                            style={{minWidth:'12em'}} filter={true} placeholder="choose" />
          </div>
          </div>
          <div className="form-group">
          &nbsp;<button className="btn btn-grey b-inline" data-levelIndex={idx} onClick={this.handleRemoveLevel.bind(this, idx)} ><i className="fa fa-close"></i></button>
          </div>

        </div>

        ))}
        <button className="btn btn-primary b-inline addn" onClick={this.addNewLevel.bind(this)} ><i className="fa fa-plus"> Add</i></button>

      </div>
      <div className="row form-group">
        <div className="col-sm-12 text-center">
          <div className="text-danger visibilityHidden" id="fileErrorMsg"></div>
        </div>
      </div>
    </form>
  </Tab.Pane>
    )



}
else{


 var dtlevels="";
 var startDate = this.props.dataPreview.meta_data.scriptMetaData.columnData.filter(item => item.slug == this.props.selectedItem.slug )[0].columnStats.filter(options => (options.name == "firstDate"))[0].value
 var endDate = this.props.dataPreview.meta_data.scriptMetaData.columnData.filter(item => item.slug == this.props.selectedItem.slug )[0].columnStats.filter(options => (options.name == "lastDate"))[0].value
    dtlevels = (
      <Tab.Pane>
        <form id="binsForm">
      <div id="dimSEdate" className="wide-modal">
        {this.state.levelsArray.map((level, idx) => (
          <div className="form_withrowlabels form-inline" key={idx} >
          <div className="form-group">
            <label for="txt_lName1">{`${idx + 1}`}&nbsp;&nbsp;&nbsp;</label>
            <input type="text" id="txt_lName1" value={level.inputValue} name="inputVal" defaultValue={level.newcolumnname} className="form-control" placeholder={`Level #${idx + 1} name`} onInput={this.inputOnChangeHandler.bind(this, idx,"inputValue")} />&nbsp;&nbsp;&nbsp;
          </div>
          <div class="form-group">
            <label for="txt_sPeriod1">&nbsp;&nbsp;&nbsp; Start period:</label>
            <input type="date" id="txt_sPeriod1" value={level.startDate} min={startDate} max={endDate}  defaultValue={startDate} className="form-control"   onInput={this.inputOnChangeHandler.bind(this, idx,"startDate")} />
          </div>

          <div class="form-group">
            <label for="txt_ePeriod1">&nbsp;&nbsp;&nbsp; End period:</label>
            <input type="date" id="txt_ePeriod1" value={level.endDate} min={startDate} max={endDate} defaultValue={endDate} className="form-control"   onInput={this.inputOnChangeHandler.bind(this, idx, "endDate")}/>
          </div>
          <div className="form-group">
          &nbsp;<button className="btn btn-grey b-inline" data-levelIndex={idx} onClick={this.handleRemoveLevel.bind(this, idx)} ><i className="fa fa-close"></i></button>
          </div>
        </div>
        ))}
        <button className="btn btn-primary b-inline addn" onClick={this.addNewLevel.bind(this)} ><i className="fa fa-plus"> Add</i></button>
      </div>
      <div className="row form-group">
        <div className="col-sm-12 text-center">
          <div className="text-danger visibilityHidden" id="fileErrorMsg"></div>
        </div>
      </div>
    </form>
  </Tab.Pane>
    )
}

    return (
      <div className="binsLevelsHeight">
        <Tab.Container id="left-tabs-example">
          <Row className="clearfix">
            <Col sm={15}>
              {/* <Tab.Content animation>{levels}</Tab.Content> */}
                <Tab.Content animation>{ (this.props.selectedItem.columnType == "dimension")? levels: dtlevels}</Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    );
  }
}
