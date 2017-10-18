import React from "react";
import {API} from "../helpers/env";
import {CSLOADERPERVALUE,LOADERMAXPERVALUE,DEFAULTINTERVAL,PERPAGE,SUCCESS,FAILED,USERDETAILS} from "../helpers/helper";
import {connect} from "react-redux";
import store from "../store";
import {openCsLoaderModal,closeCsLoaderModal,updateCsLoaderValue,updateCsLoaderMsg} from "./createSignalActions";
import Dialog from 'react-bootstrap-dialog'
import { showLoading, hideLoading } from 'react-redux-loading-bar'
// var API = "http://34.196.204.54:9000";

// @connect((store) => {
//   return {signal: store.signals.signalAnalysis};
// })
var createSignalInterval = null;

function getHeader(token){
  return {
    'Authorization': token,
    'Content-Type': 'application/json'
  };
}
//x-www-form-urlencoded'
export function createSignal(metaData) {
    return (dispatch) => {
    return fetchCreateSignal(metaData).then(([response, json]) =>{
        if(response.status === 200){
          //console.log(json)
        dispatch(fetchCreateSignalSuccess(json,dispatch))
      }
      else{
        dispatch(fetchCreateSignalError(json))
         dispatch(closeCsLoaderModal())
        dispatch(updateCsLoaderValue(CSLOADERPERVALUE))
      }
    })
  }
}

function fetchCreateSignal(metaData) {
  //console.log(metaData)

  return fetch(API+'/api/signals/',{
		method: 'POST',
    headers: getHeader(USERDETAILS.userToken),
    body: JSON.stringify(metaData)
		}).then( response => Promise.all([response, response.json()]));
}

function fetchCreateSignalSuccess(signalData, dispatch) {
  //console.log("signal list from api to store")
  if(signalData.type == "dimension"){
    console.log("created in progress slug is:")
    console.log(signalData)

    let msg = store.getState().signals.loaderText
    let loaderVal = store.getState().signals.createSignalLoaderValue

    createSignalInterval = setInterval(function() {

      let loading_message = store.getState().signals.loading_message
      dispatch(getSignalAnalysis(USERDETAILS.userToken,signalData.slug));
      if(store.getState().signals.createSignalLoaderValue < LOADERMAXPERVALUE){
        if (loading_message && loading_message.length > 0) {
          msg = loading_message[loading_message.length - 1].shortExplanation
          loaderVal = loading_message[loading_message.length - 1].globalCompletionPercentage
          //alert(msg + "  " + loaderVal)
        }
        dispatch(updateCsLoaderValue(loaderVal));
        dispatch(updateCsLoaderMsg(msg));
      } else {
        dispatch(clearLoadingMsg())
      }

    }, DEFAULTINTERVAL);

    }else{
     dispatch(updateCsLoaderValue(store.getState().signals.createSignalLoaderValue+CSLOADERPERVALUE))
      createSignalInterval = setInterval(function(){
      	if(store.getState().signals.createSignalLoaderValue < LOADERMAXPERVALUE){
      	  dispatch(updateCsLoaderValue(store.getState().signals.createSignalLoaderValue+CSLOADERPERVALUE))
      	}
            dispatch(getSignalAnalysis(USERDETAILS.userToken,signalData.slug));

    },DEFAULTINTERVAL);
  }

  return {
    type: "CREATE_SUCCESS",
    signalData
  }
}

function fetchCreateSignalError(json) {
  //console.log("fetching list error!!",json)

  return {
    type: "CREATE_ERROR",
    json
  }
}

export function getList(token,pageNo) {
    return (dispatch) => {
    return fetchPosts(token,pageNo).then(([response, json]) =>{
        if(response.status === 200){
          //console.log(json)
        dispatch(fetchPostsSuccess(json))
      }
      else{
        dispatch(fetchPostsError(json))
      }
    })
  }
}

function fetchPosts(token,pageNo) {
  //console.log(token)
  let search_element = store.getState().signals.signal_search_element;
  let signal_sorton =  store.getState().signals.signal_sorton;
  let signal_sorttype = store.getState().signals.signal_sorttype;
    if(signal_sorttype=='asc')
		signal_sorttype = ""
	else if(signal_sorttype=='desc')
		signal_sorttype="-"
  //console.log(search_element)
  if(search_element!=""&&search_element!=null){
    //console.log("calling for search element!!")
    return fetch(API+'/api/signals/?name='+search_element+'&page_number='+pageNo+'&page_size='+PERPAGE+'',{
      method: 'get',
      headers: getHeader(token)
      }).then( response => Promise.all([response, response.json()]));
  }else if((signal_sorton!=""&&signal_sorton!=null) && (signal_sorttype!=null)){
	    return fetch(API+'/api/signals/?sorted_by='+signal_sorton+'&ordering='+signal_sorttype+'&page_number='+pageNo+'&page_size='+PERPAGE+'',{
      method: 'get',
      headers: getHeader(token)
      }).then( response => Promise.all([response, response.json()]));
  }else{
    return fetch(API+'/api/signals/?page_number='+pageNo+'&page_size='+PERPAGE+'',{
      method: 'get',
      headers: getHeader(token)
      }).then( response => Promise.all([response, response.json()]));
  }


}


function fetchPostsSuccess(signalList) {
  //console.log("signal list from api to store")
  //console.log(signalList);
  var current_page =  signalList.current_page
  return {
    type: "SIGNAL_LIST",
    signalList,
    current_page
  }
}

function fetchPostsError(json) {
  //console.log("fetching list error!!",json)
  return {
    type: "SIGNAL_LIST_ERROR",
    json
  }
}

//for getting signal analysis:
export function getSignalAnalysis(token,errandId) {

    return (dispatch) => {
    return fetchPosts_analysis(token,errandId).then(([response, json]) =>{
        if(response.status === 200){

        dispatch(fetchPostsSuccess_analysis(json,errandId,dispatch))
      }
      else{
        dispatch(fetchPostsError_analysis(json));
        dispatch(closeCsLoaderModal())
        dispatch(updateCsLoaderValue(CSLOADERPERVALUE))
      }
    })
  }
}


function fetchPosts_analysis(token,errandId) {
  //console.log(token)

  return fetch(API+'/api/signals/'+errandId+"/",{
		method: 'get',
		headers: {
			'Authorization': token,
			'Content-Type': 'application/x-www-form-urlencoded'
		}
  }).then( response => Promise.all([response, response.json()]));

}


function fetchPostsSuccess_analysis(signalAnalysis, errandId,dispatch) {

  if(signalAnalysis.status == SUCCESS){
    clearInterval(createSignalInterval);
    dispatch(closeCsLoaderModal())
    dispatch(updateCsLoaderValue(CSLOADERPERVALUE))
    dispatch(clearLoadingMsg())
  }else if(signalAnalysis.status == FAILED||signalAnalysis.status == false){
	  bootbox.alert("Your signal could not be created. Please try later.")
	    clearInterval(createSignalInterval);
	    dispatch(closeCsLoaderModal())
	    dispatch(updateCsLoaderValue(CSLOADERPERVALUE))
      dispatch(clearLoadingMsg())
  }else if(signalAnalysis.status == "INPROGRESS"){
		dispatch(dispatchSignalLoadingMsg(signalAnalysis));
	}
  return {
    type: "SIGNAL_ANALYSIS",
    signalAnalysis,
    errandId
  }
}

function fetchPostsError_analysis(json) {
  //console.log("fetching list error!!",json)
  return {
    type: "SIGNAL_ANALYSIS_ERROR",
    json
  }
}


export function setPossibleAnalysisList(varType,varText) {
	return {
		type: "SET_POSSIBLE_LIST",
		varType,
		varText
	}
}
export function showPredictions(predictionSelected) {
	return {
		type: "SEL_PREDICTION",
		predictionSelected
	}
}
export function emptySignalAnalysis() {
	return {
		type: "SIGNAL_ANALYSIS_EMPTY",
	}
}

//delete signal -------------------
export function showDialogBox(slug,dialog,dispatch){
	Dialog.setOptions({
		  defaultOkLabel: 'Yes',
		  defaultCancelLabel: 'No',
		})
	dialog.show({
		  title: 'Delete Signal',
		  body: 'Are you sure you want to delete signal?',
		  actions: [
		    Dialog.CancelAction(),
		    Dialog.OKAction(() => {
		    	deleteSignal(slug,dialog,dispatch)
		    })
		  ],
		  bsSize: 'medium',
		  onHide: (dialogBox) => {
		    dialogBox.hide()
		    //console.log('closed by clicking background.')
		  }
		});
}
export function handleDelete(slug,dialog) {
	return (dispatch) => {
		showDialogBox(slug,dialog,dispatch)
	}
}
function deleteSignal(slug,dialog,dispatch){
	dispatch(showLoading());
	Dialog.resetOptions();
	return deleteSignalAPI(slug).then(([response, json]) =>{
		if(response.status === 200){
			dispatch(getList(USERDETAILS.userToken,store.getState().signals.signalList.current_page));
			dispatch(hideLoading());
		}
		else{
			dialog.showAlert("Error occured , Please try after sometime.");
			dispatch(hideLoading());
		}
	})
}
function deleteSignalAPI(slug){
	//console.log("deleteSignalAPI(slug)");
	//console.log(slug);
	return fetch(API+'/api/signals/'+slug+'/',{
		method: 'put',
		headers: getHeader(USERDETAILS.userToken),
		body:JSON.stringify({
			deleted:true,
		}),
	}).then( response => Promise.all([response, response.json()]));

	}

// end of delete signal
//store search element
export function storeSearchElement(search_element){
  return {
		type: "SEARCH_SIGNAL",
		search_element
	}
}
export function storeSortElements(sorton,sorttype){
	  return {
		type: "SORT_SIGNAL",
		sorton,
		sorttype
	}
}

export function setSideCardListFlag(sideCardListClass){
	 return {
		type: "SET_SIDECARDLIST_FLAG",
		sideCardListClass
	}
}


export function handleRename(slug,dialog,name){
	return (dispatch) => {
		showRenameDialogBox(slug,dialog,dispatch,name)
	}
}
function showRenameDialogBox(slug,dialog,dispatch,name){
	 const customBody = (
		      <div className="form-group">
		      <label for="fl1" className="col-sm-6 control-label">Enter Signal New Name</label>
		      <input className="form-control"  id="idRenameSignal" type="text" defaultValue={name}/>
		      </div>
		    )

	dialog.show({
		  title: 'Rename Signal',
		  body: customBody,
		  actions: [
		    Dialog.CancelAction(),
		    Dialog.OKAction(() => {
		    	renameSignal(slug,dialog,$("#idRenameSignal").val(),dispatch)
		    })
		  ],
		  bsSize: 'medium',
		  onHide: (dialogBox) => {
		    dialogBox.hide()
		    //console.log('closed by clicking background.')
		  }
		});
}

function renameSignal(slug,dialog,newName,dispatch){
	dispatch(showLoading());
	Dialog.resetOptions();
	return renameSignalAPI(slug,newName).then(([response, json]) =>{
		if(response.status === 200){
			dispatch(getList(USERDETAILS.userToken,store.getState().datasets.current_page));
			dispatch(hideLoading());
		}
		else{
			dialog.showAlert("Error occured , Please try after sometime.");
			dispatch(hideLoading());
		}
	})
}
function renameSignalAPI(slug,newName){
	return fetch(API+'/api/signals/'+slug+'/',{
		method: 'put',
		headers: getHeader(USERDETAILS.userToken),
		body:JSON.stringify({
			name:newName,
		}),
	}).then( response => Promise.all([response, response.json()]));

}
export function advanceSettingsModal(flag){
	 return {
			type: "ADVANCE_SETTINGS_MODAL",
		    flag
		}
}

function dispatchSignalLoadingMsg(signalAnalysis){
	let message = signalAnalysis.message
	console.log("loading message########")
	console.log(message)
	return {
		type: "CHANGE_LOADING_MSG",
		message
	}
}
export function clearLoadingMsg() {
  return {type: "CLEAR_LOADING_MSG"}
}


