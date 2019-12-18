import React, { Component } from 'react'
import {updateTensorFlowArray,addTensorFlowArray} from '../../actions/appActions'
import store from "../../store";
import { connect } from "react-redux";



@connect((store) => {
	return {
    login_response: store.login.login_response, 
		};
})

export default class Layer extends Component {
    
  componentDidMount(){
      this.props.dispatch(addTensorFlowArray(this.props.id,this.props.layerType))
    }
    
    shouldComponentUpdate(nextProps){
        return false
    }
  
  myChangeHandler(item,e){
    let name = item.name;
    let val = e.target.value;
    this.props.dispatch(updateTensorFlowArray(this.props.id,name,val))
  }
  getOptions(item) {

    var arr = item.defaultValue.map(j=>j.displayName);
    arr.unshift("--Select--")
    var optionsHtml = arr.map(k => {
        return <option value={k} > {k}</option>
    })
    return <select className="form-control" onChange={this.myChangeHandler.bind(this,item)}>{optionsHtml} </select>
  }
  
  render() { 
    var cls =`row layerPanel ${this.props.id}`
    var mandateField= ["Activation","Units","Rate"]
    var rendercontent = this.props.parameters.map((item,index)=>{
             if(item.paramType=="list"){
              return (
                <div className ="row mb-20">
                <div className="form-group">
                <label className={mandateField.includes(item.displayName)? "col-md-2 mandate" : "col-md-2"}>{item.displayName}</label>
                <label className="col-md-4">{item.description}</label>
                 <div className="col-md-6">
                 <div className ="row">
                 <div className="col-md-6">
                  {this.getOptions(item)}
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
                <div className="form-group">
                <label className={mandateField.includes(item.displayName)? "col-md-2 mandate" : "col-md-2"}>{item.displayName}</label>
                <label className="col-md-4">{item.description}</label>
                <div className="col-md-6">
                 <div className ="row">
                 <div className="col-md-2">
                   <input type="number" className="form-control"  name={item.name} onChange={this.myChangeHandler.bind(this,item)}></input>
                   </div>
                </div> 
                </div>
                </div>
                </div>
                    
                )
   
         })
   
    return ( 
      <div className={cls}>
      <div className="layer">
      <div className="layerHeader">
      {this.props.layerType} 
      <i className="fa fa-chevron-down" type="button" data-toggle="collapse" data-target={`#collapseExample${this.props.id}`} aria-expanded="true" aria-controls={`collapseExample${this.props.id}`}>
      </i>
      </div>
      <div className="collapse in" id={`collapseExample${this.props.id}`}>
       <div className="card card-body">
       <div className="layerBody">
        {rendercontent}
        </div>
     </div>
    </div>
     
      </div>
      </div>
    )
  }
}
