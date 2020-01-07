import React from "react";
import {connect} from "react-redux";
import store from "../../store";
import {updateAlgorithmData, tensorValidateFlag} from "../../actions/appActions";
import Layer from './Layer';
import {statusMessages} from  "../../helpers/helper";


@connect((store) => {
    return {
        algorithmData:store.apps.regression_algorithm_data,
        manualAlgorithmData:store.apps.regression_algorithm_data_manual,
        tensorValidateFlag: store.datasets.tensorValidateFlag,
        datasetRow: store.datasets.dataPreview.meta_data.uiMetaData.metaDataUI[0].value,
        tfAlgorithmSlug: store.apps.regression_algorithm_data_manual.filter(i=>i.algorithmName=="TensorFlow")[0].algorithmSlug
    };
})

export class TensorFlow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          panels : [],
          layerType:"dense",
          paramValidateFlag: false,
      }
    }

  componentDidMount(){
      this.props.dispatch(updateAlgorithmData(this.props.tfAlgorithmSlug,"batch_size",this.props.datasetRow-1,"NonTuningParameter"));
    }
  changeTextboxValue(item,e){
      let name = item.name;
      let val = e.target.value === "--Select--"? null:e.target.value;
      if(name=="number_of_epochs" && val<1){
      e.target.parentElement.lastElementChild.innerHTML = "value range is 1 to infinity"
      }
      else if(name=="batch_size" && ((val < 0 ) || (val > this.props.datasetRow-1))){
        e.target.parentElement.lastElementChild.innerHTML = `value range is 1 to ${this.props.datasetRow-1}`
      }
      else{
        e.target.parentElement.lastElementChild.innerHTML = "" 
      }
      this.props.dispatch(updateAlgorithmData(this.props.tfAlgorithmSlug,item.name,e.target.value,"NonTuningParameter"));
  }
  
  handleSelectBox(item,e){
    var loss=$(".loss").val()
    if(e.target.classList.value=="form-control metrics" && loss=="sparse_categorical_crossentropy" && $(".metrics").val().indexOf("sparse")==-1){
      document.getElementById("loss").innerText=""
      document.getElementById("metrics").innerText="Metrics should be sparse 1"
    }
    else if(e.target.classList.value=="form-control loss" && loss!="sparse_categorical_crossentropy" && $(".metrics").val().indexOf("sparse")!=-1){
      document.getElementById("metrics").innerText=""
      document.getElementById("loss").innerText="loss should  be sparse 2"
    }
    else if($(".loss").val().indexOf("sparse")==-1&& $(".metrics").val().indexOf("sparse")!=-1){
      document.getElementById("loss").innerText=""
      document.getElementById("metrics").innerText="metrics should not be sparse 3"
    }
    else if($(".metrics").val().indexOf("sparse")==-1 && $(".loss").val().indexOf("sparse")!=-1){
      document.getElementById("metrics").innerText=""
      document.getElementById("loss").innerText="Metrics & Loss combination does not work 4."
    }
    else
    {
      document.getElementById("metrics").innerText=""
      document.getElementById("loss").innerText=""
      this.props.dispatch(updateAlgorithmData(this.props.tfAlgorithmSlug,item.name,e.target.value,"NonTuningParameter"));
    }
  }

  getOptions(item) {
      var arr = item.defaultValue.map(j=>j.displayName);
      var options = arr.map(k => {
          return <option value={k} > {k}</option>
      })
      return <select onChange={this.handleSelectBox.bind(this,item)} className={`form-control ${item.name}`}> {options} </select>
  }
    
    
  layerValidate=(slectedLayer,tfArray)=>{
       if(tfArray.length>=2)
       var prevLayer=tfArray[tfArray.length-1].layer;

      if(tfArray.length==0 && (slectedLayer=="Dropout"||slectedLayer=="Lambda")){
        bootbox.alert(statusMessages("warning", "First level must be Dense.", "small_mascot"));
        return false
      }
      else if(tfArray.length>=2 && (slectedLayer=="Dropout" && prevLayer=="Dropout"||slectedLayer=="Lambda" && prevLayer=="Lambda")){
      bootbox.alert(statusMessages("warning", "Please select an alternate layer.", "small_mascot"));
      return false
      }
      else{
        this.addLayer(slectedLayer);
      }
  }

   parameterValidate=()=>{

   let unitLength= document.getElementsByClassName("units").length
   let rateLength= document.getElementsByClassName("rate").length
   var errMsgLen=document.getElementsByClassName("error").length

        for(let i=0; i<unitLength; i++){
          var unitFlag;
          if(document.getElementsByClassName("units")[i].value==="")
          unitFlag = true;
        }

        for(let i=0; i<rateLength; i++){
          var rateFlag;
          if(document.getElementsByClassName("rate")[i].value==="")
          rateFlag = true;
        }
      
        for(let i=0; i<errMsgLen; i++){
            var errMsgFlag;
            if(document.getElementsByClassName("error")[i].innerText!="")
            errMsgFlag = true;
        }

    if ($(".activation option:selected").text().includes("--Select--")){
       this.props.dispatch(tensorValidateFlag(false));
       bootbox.alert(statusMessages("warning", "Please select 'Activation' for dense layer in TensorFlow.", "small_mascot"));
    }else if(unitFlag){
       this.props.dispatch(tensorValidateFlag(false));
       bootbox.alert(statusMessages("warning", "Please enter 'Units' for dense layer in TensorFlow.", "small_mascot"));
    }else if ($(".batch_normalization option:selected").text().includes("--Select--")){
      this.props.dispatch(tensorValidateFlag(false));
      bootbox.alert(statusMessages("warning", "Please select 'Batch Normalisation' for dense layer in TensorFlow.", "small_mascot"));
    }else if(rateFlag){
       this.props.dispatch(tensorValidateFlag(false));
       bootbox.alert(statusMessages("warning", "Please enter 'Rate' for dropout layer in TensorFlow.", "small_mascot"));
    }else if(errMsgFlag){
       this.props.dispatch(tensorValidateFlag(false));
       bootbox.alert(statusMessages("warning", "Please resolve erros to add new layer in TensorFlow.", "small_mascot"));
    }else{
       this.props.dispatch(tensorValidateFlag(true));
    }
     
  }

  addLayer=(slectedLayer)=>{
    const nextId = this.state.panels.length + 1
      this.setState({
         panels: this.state.panels.concat([nextId]),
         layerType:slectedLayer
      })
  }

  handleClick(){ 
  var slectedLayer=store.getState().apps.regression_algorithm_data_manual[5].parameters[0].defaultValue.filter(i=>i.selected===true)[0].displayName;
  var tfArray= store.getState().apps.tensorFlowInputs;
  
    if (tfArray.length>0) {
      this.parameterValidate();
    }
    if(store.getState().datasets.tensorValidateFlag || tfArray.length == 0){
      this.layerValidate(slectedLayer,tfArray)
    }
  }
   render() {
    if(this.state.layerType==="Dense")
    var data=this.props.manualAlgorithmData[5].parameters[0].defaultValue[0].parameters
    else if(this.state.layerType==="Dropout")
     data=this.props.manualAlgorithmData[5].parameters[0].defaultValue[1].parameters
     var algorithmData=this.props.manualAlgorithmData[5].parameters.filter(i=>i.name!="layer")
      var rendercontent = algorithmData.map((item,index)=>{
        var uniqueId=item.name;
           if(item.paramType=="list"){
              return (
                <div className ="row mb-20">
                <div className="form-group">
                <label className="col-md-2">{item.displayName}</label>
                <label className="col-md-4">{item.description}</label>
                 <div className="col-md-6">
                 <div className ="row">
                 <div className="col-md-6">
                  {this.getOptions(item)}
                  <div id={uniqueId}className="error"></div>
                  </div>
                  </div>
                   </div>
                </div>
                </div>
              )
           }
           else
            return (
              <div className ="row mb-20">
                <div class="form-group">
                <label class="col-md-2 control-label read">{item.displayName}</label>
                <label className="col-md-4">{item.description}</label>
                <div className="col-md-6">
                 <div className ="row">
                 <div className="col-md-2">
                   <input type="number" className= {`form-control ${item.name}`} onChange={this.changeTextboxValue.bind(this,item)} defaultValue={item.displayName ==="Batch Size"? this.props.datasetRow -1 : item.defaultValue} />
                   <div className="error"></div>
                </div>
                </div> 
                </div>
                </div>
                </div>                
              )
      })
     return (
                <div className="col-md-12">
                  <div className="row mb-20">
                  <div class="form-group">
                   <label class="col-md-2">Layer</label>
                   <label className="col-md-4">A layer is a class implementing common Neural Networks Operations, such as convolution, batch norm, etc.</label>
                   <div className="col-md-6">
                 <div className ="row">
                   <div className="col-md-6">
                    {this.getOptions(this.props.manualAlgorithmData[5].parameters[0])}
                   </div>
                   <div className="col-md-6" style={{textAlign:'center'}}>
                   <div style={{cursor:'pointer',display:'inline-block'}} onClick={this.handleClick.bind(this,)}>
                      <span className="addLayer"> <i className="fa fa-plus" style={{color: '#fff'}}></i></span>
                      <span className="addLayerTxt">Add layer</span>
                  </div>
                  
                   </div>
                  
                 </div>
                 
                 </div>
                </div>
                  </div>
                  <div className='panel-wrapper'>
                  {
                    this.state.panels.map((panelId) => (
                      <Layer key={panelId} id={panelId} parameters={data} layerType={this.state.layerType} />
                    ))
                  }
                  </div>
                  <div id="layerArea"></div>
                    {rendercontent}
                </div>
     );

    }
}
