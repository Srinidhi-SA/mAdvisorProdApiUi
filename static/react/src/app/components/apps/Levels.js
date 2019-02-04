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
    // meta_data.scriptMetaData.columnData[1].chartData.chart_c3.data.columns[""0""]
    return this.props.dataPreview.meta_data.scriptMetaData.columnData.filter(item => item.slug == this.props.selectedItem.slug )[0].chartData.chart_c3.data.columns[0].slice(1)
  }
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
  handleLevelSubmit = evt => {
  };

  addNewLevel(){
    var newObj = {"inputValue":"", "multiselectValue":""};
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
    }else{
      var obj = { name: checkedAttr };
      if (this.state.statesArray[checkedAttr] != undefined) {
        this.state.statesArray.push(obj);
      }
    }
  }

  inputOnChangeHandler(idx, event){
    var newArray = this.state.levelsArray;
    newArray[idx]["inputValue"] = event.target.value;
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
    var levelData = this.getLevelData();
    var levels = "";
    levels = (
      <div>
        {this.state.levelsArray.map((level, idx) => (
          <div className="form_withrowlabels form-inline" key={idx} >
          <div className="form-group">
            <input type="text" value={level.inputValue} name={`name #${idx + 1}`} className="form-control" placeholder={`Level #${idx + 1} name`} onInput={this.inputOnChangeHandler.bind(this, idx)} />
          </div>
        ))}
        <button className="btn btn-primary b-inline addn" onClick={this.addNewLevel.bind(this)} ><i className="fa fa-plus"> Add</i></button>

      </div>
    )

    return (
      <div>
        <Tab.Container id="left-tabs-example">
          <Row className="clearfix">
            <Col sm={15}>
              <Tab.Content animation>{levels}</Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    );
  }
}
