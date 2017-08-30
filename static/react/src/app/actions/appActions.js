import {API} from "../helpers/env";
import {PERPAGE} from "../helpers/helper";
import store from "../store";
import {DULOADERPERVALUE,LOADERMAXPERVALUE,DEFAULTINTERVAL,APPSDEFAULTINTERVAL,CUSTOMERDATA,HISTORIALDATA,EXTERNALDATA} from "../helpers/helper";
import {hideDataPreview,getDataSetPreview} from "./dataActions";
import {getHeaderWithoutContent} from "./dataUploadActions";
export var appsInterval = null;

function getHeader(token){
	return {
		'Authorization': token,
		'Content-Type': 'application/json'
	};
}

export function openModelPopup() {
	return {
		type: "APPS_MODEL_SHOW_POPUP",
	}
}

export function closeModelPopup() {
	return {
		type: "APPS_MODEL_HIDE_POPUP",
	}
}

export function getAppsModelList(pageNo) {
	return (dispatch) => {
		return fetchModelList(pageNo,sessionStorage.userToken).then(([response, json]) =>{
			if(response.status === 200){
				console.log(json)
				dispatch(fetchModelListSuccess(json))
			}
			else{
				dispatch(fetchModelListError(json))
			}
		})
	}
}

function fetchModelList(pageNo,token) {
	return fetch(API+'/api/trainer/?app_id='+store.getState().apps.currentAppId+'&page_number='+pageNo+'&page_size='+PERPAGE+'',{
		method: 'get',
		headers: getHeader(token)
	}).then( response => Promise.all([response, response.json()]));
}

function fetchModelListError(json) {
	return {
		type: "MODEL_LIST_ERROR",
		json
	}
}
export function fetchModelListSuccess(doc){
	var data = doc;
	var current_page =  doc.current_page
	return {
		type: "MODEL_LIST",
		data,
		current_page,
	}
}
export function updateTrainAndTest(e) {
	var trainValue = e.target.value;
	var testValue = 100-trainValue;
	return {
		type: "UPDATE_MODEL_RANGE",
		trainValue,
		testValue,
	}
}

export function createModel(modelName,targetVariable) {
	console.log(modelName);
	console.log(targetVariable);
	  return (dispatch) => {
		  dispatch(openAppsLoader(DULOADERPERVALUE,"Please wait while mAdvisor is creating model... "));
			return triggerCreateModel(sessionStorage.userToken,modelName,targetVariable).then(([response, json]) =>{
				if(response.status === 200){
					console.log(json)
					dispatch(createModelSuccess(json,dispatch))
				}
				else{
					dispatch(closeAppsLoaderValue());
					dispatch(updateModelSummaryFlag(false));
					dispatch(createModelError(json))
				}
			})
		}
}

function triggerCreateModel(token,modelName,targetVariable) {
		var datasetSlug = store.getState().datasets.dataPreview.slug;
		var app_id=store.getState().apps.currentAppId;
		var details = {"measures":store.getState().datasets.selectedMeasures,
			"dimension":store.getState().datasets.selectedDimensions,
			"timeDimension":store.getState().datasets.selectedTimeDimensions,
			 "trainValue":store.getState().apps.trainValue,
			 "testValue":store.getState().apps.testValue,
			 "analysisVariable":targetVariable}
		return fetch(API+'/api/trainer/',{
			method: 'post',
			headers: getHeader(token),
			body:JSON.stringify({
				"name":modelName,
				"dataset":datasetSlug,
				"app_id":app_id,
				"config":details
		 }),
		}).then( response => Promise.all([response, response.json()]));
}
function createModelSuccess(data,dispatch){
	var slug = data.slug;
	appsInterval = setInterval(function(){
			if(store.getState().apps.appsLoaderPerValue < LOADERMAXPERVALUE){
				dispatch(updateAppsLoaderValue(store.getState().apps.appsLoaderPerValue+DULOADERPERVALUE));
			}
			dispatch(getAppsModelSummary(data.slug));
			return {
				type: "CREATE_MODEL_SUCCESS",
				slug,	
			}
	},APPSDEFAULTINTERVAL);
	return {
		type: "CREATE_MODEL_SUCCESS",
		slug,	
	}
}
export function getAppsScoreList(pageNo) {
	return (dispatch) => {
		return fetchScoreList(pageNo,sessionStorage.userToken).then(([response, json]) =>{
			if(response.status === 200){
				console.log(json)
				dispatch(fetchScoreListSuccess(json))
			}
			else{
				dispatch(fetchScoreListError(json))
			}
		})
	}
}

function fetchScoreList(pageNo,token) {
	return fetch(API+'/api/score/?app_id='+store.getState().apps.currentAppId+'&page_number='+pageNo+'&page_size='+PERPAGE+'',{
		method: 'get',
		headers: getHeader(token)
	}).then( response => Promise.all([response, response.json()]));
}

function fetchScoreListError(json) {
	return {
		type: "SCORE_LIST_ERROR",
		json
	}
}
export function fetchScoreListSuccess(doc){
	var data = doc;
	var current_page =  doc.current_page
	return {
		type: "SCORE_LIST",
		data,
		current_page,
	}
}

export function showCreateScorePopup() {
	return {
		type: "APPS_SCORE_SHOW_POPUP",
	}
}

export function hideCreateScorePopup() {
	return {
		type: "APPS_SCORE_HIDE_POPUP",
	}
}

export function getAppsModelSummary(slug) {
	return (dispatch) => {
		return fetchModelSummary(sessionStorage.userToken,slug).then(([response, json]) =>{
			if(response.status === 200){
				if(json.analysis_done){
					clearInterval(appsInterval);
					dispatch(fetchModelSummarySuccess(json));
					dispatch(closeAppsLoaderValue());
					dispatch(hideDataPreview());
					dispatch(updateModelSummaryFlag(true));
				}
			}
			else{
				dispatch(closeAppsLoaderValue())
				dispatch(fetchModelSummaryError(json));
				dispatch(updateModelSummaryFlag(false));
			}
		})
	}
}

function fetchModelSummary(token,slug) {
	return fetch(API+'/api/trainer/'+slug+'/',{
		method: 'get',
		headers: getHeader(token)
	}).then( response => Promise.all([response, response.json()]));
}

function fetchModelSummaryError(json) {
	return {
		type: "MODEL_SUMMARY_ERROR",
		json
	}
}
export function fetchModelSummarySuccess(doc){
	var data = doc;
	return {
		type: "MODEL_SUMMARY_SUCCESS",
		data,
	}
}
export function getListOfCards(totalCardList){
	console.log("In Apps Model Detail");
	let cardList = new Array();
	for(var i=0;i<totalCardList.length;i++){
		cardList.push(totalCardList[i].cardData)
	}
	console.log(cardList)
	return cardList;
}

export function updateSelectedAlg(name){
	return {
		type: "SELECTED_ALGORITHM",
		name,
	}
}

export function createScore(scoreName,targetVariable) {
	console.log(scoreName);
	console.log(targetVariable);
	  return (dispatch) => {
		  dispatch(openAppsLoader(DULOADERPERVALUE,"Please wait while mAdvisor is creating score... "));
			return triggerCreateScore(sessionStorage.userToken,scoreName,targetVariable).then(([response, json]) =>{
				if(response.status === 200){
					
					dispatch(createScoreSuccess(json,dispatch))
				}
				else{
					dispatch(createScoreError(json));
					dispatch(updateScoreSummaryFlag(false));
					dispatch(closeAppsLoaderValue())
				}
			})
		}
}

function triggerCreateScore(token,scoreName,targetVariable) {
		var datasetSlug = store.getState().datasets.dataPreview.slug;
		var app_id=store.getState().apps.currentAppId;
		var details = {"measures":store.getState().datasets.selectedMeasures,
			"dimension":store.getState().datasets.selectedDimensions,
			"timeDimension":store.getState().datasets.selectedTimeDimensions,
			 "analysisVariable":targetVariable,
			 "algorithmName":store.getState().apps.selectedAlg,
			 "app_id":app_id}
		return fetch(API+'/api/score/',{
			method: 'post',
			headers: getHeader(token),
			body:JSON.stringify({
				"name":scoreName,
				"dataset":datasetSlug,
				"trainer":store.getState().apps.modelSlug,
				"config":details
		 }),
		}).then( response => Promise.all([response, response.json()]));
}

function createScoreSuccess(data,dispatch){
	var slug = data.slug;
	appsInterval = setInterval(function(){
			if(store.getState().apps.appsLoaderPerValue < LOADERMAXPERVALUE){
				dispatch(updateAppsLoaderValue(store.getState().apps.appsLoaderPerValue+DULOADERPERVALUE));
			}
			dispatch(getAppsScoreSummary(data.slug));
			return {
				type: "CREATE_SCORE_SUCCESS",
				slug,	
			}
	},APPSDEFAULTINTERVAL);
	return {
		type: "CREATE_SCORE_SUCCESS",
		slug,	
	}
}

export function getAppsScoreSummary(slug) {
	return (dispatch) => {
		return fetchScoreSummary(sessionStorage.userToken,slug).then(([response, json]) =>{
			if(response.status === 200){
				if(json.analysis_done){
					clearInterval(appsInterval);
					dispatch(fetchScoreSummarySuccess(json));
					dispatch(closeAppsLoaderValue());
					dispatch(hideDataPreview());
					dispatch(updateScoreSummaryFlag(true));
				}
				
			}
			else{
				dispatch(closeAppsLoaderValue());
				dispatch(updateScoreSummaryFlag(false));
				dispatch(fetchScoreSummaryError(json))
			}
		})
	}
}

function fetchScoreSummary(token,slug) {
	return fetch(API+'/api/score/'+slug+'/',{
		method: 'get',
		headers: getHeader(token)
	}).then( response => Promise.all([response, response.json()]));
}

function fetchScoreSummaryError(json) {
	return {
		type: "SCORE_SUMMARY_ERROR",
		json
	}
}
export function fetchScoreSummarySuccess(data){
	return {
		type: "SCORE_SUMMARY_SUCCESS",
		data,
	}
}
export function updateSelectedApp(appId,appName){
	return {
		type: "SELECTED_APP_DETAILS",
		appId,
		appName,
	}
}

export function openAppsLoaderValue(value,text){
	return {
		type: "OPEN_APPS_LOADER_MODAL",
		value,
		text,
	}
}
export function closeAppsLoaderValue(){
	return {
		type: "HIDE_APPS_LOADER_MODAL",
	}
}
function createModelError(){
	return {
		type: "CREATE_MODEL_ERROR",
	}
}


function updateAppsLoaderValue(value){
	return {
		type: "UPDATE_APPS_LOADER_VALUE",
		value,
	}
}

export function openAppsLoader(value,text){
	return {
		type: "OPEN_APPS_LOADER_MODAL",
		value,
		text,
	}
}
export function updateModelSummaryFlag(flag){
	return {
		type: "UPDATE_MODEL_FLAG",
		flag,
	}
}
export function updateScoreSummaryFlag(flag){
	return {
		type: "UPDATE_SCORE_FLAG",
		flag,
	}
}

export function updateModelSlug(slug){
	return {
		type: "CREATE_MODEL_SUCCESS",
		slug,	
	}
}
export function updateScoreSlug(slug){
	return {
		type: "CREATE_SCORE_SUCCESS",
		slug,	
	}
}

export function getAppsRoboList(pageNo) {
	return (dispatch) => {
		return fetchRoboList(pageNo,sessionStorage.userToken).then(([response, json]) =>{
			if(response.status === 200){
				console.log(json)
				dispatch(fetchRoboListSuccess(json))
			}
			else{
				dispatch(fetchRoboListError(json))
			}
		})
	}
}

function fetchRoboList(pageNo,token) {
	return fetch(API+'/api/robo/?page_number='+pageNo+'&page_size='+PERPAGE+'',{
		method: 'get',
		headers: getHeader(token)
	}).then( response => Promise.all([response, response.json()]));
}

function fetchRoboListError(json) {
	return {
		type: "ROBO_LIST_ERROR",
		json
	}
}
export function fetchRoboListSuccess(doc){
	var data = doc;
	var current_page =  doc.current_page
	return {
		type: "ROBO_LIST",
		data,
		current_page,
	}
}
export function closeRoboDataPopup() {
	return {
		type: "APPS_ROBO_HIDE_POPUP",
	}
}

export function openRoboDataPopup() {
	return {
		type: "APPS_ROBO_SHOW_POPUP",
	}
}

export function saveFilesToStore(files,uploadData) {
	console.log(files)
	var file = files[0]
	if(uploadData == CUSTOMERDATA){
		return {
			type: "CUSTOMER_DATA_UPLOAD_FILE",
			files
		}
	}
	else if(uploadData == HISTORIALDATA){
		return {
			type: "HISTORIAL_DATA_UPLOAD_FILE",
			files
		}
	}
	else if(uploadData == EXTERNALDATA){
		return {
			type: "EXTERNAL_DATA_UPLOAD_FILE",
			files
		}
	}
	
}


export function uploadFiles() {

	  return (dispatch) => {
		  dispatch(closeRoboDataPopup());
		  dispatch(openAppsLoader(DULOADERPERVALUE,"Please wait while mAdvisor is processing data... "));
			return triggerDataUpload(sessionStorage.userToken).then(([response, json]) =>{
				if(response.status === 200){
					
					dispatch(dataUploadFilesSuccess(json,dispatch))
				}
				else{
					dispatch(dataUploadFilesError(json));
					dispatch(closeAppsLoaderValue())
				}
			})
		}
}

function triggerDataUpload(token) {
		var data = new FormData();
		data.append("customer_file",store.getState().apps.customerDataUpload);
		data.append("historical_file",store.getState().apps.historialDataUpload);
		data.append("market_file",store.getState().apps.externalDataUpload);
		return fetch(API+'/api/robo/',{
			method: 'post',
			headers: getHeaderWithoutContent(token),
			body:data,
		}).then( response => Promise.all([response, response.json()]));	
}

function dataUploadFilesSuccess(data,dispatch) {
	var slug = data.slug;
	appsInterval = setInterval(function(){
			if(store.getState().apps.appsLoaderPerValue < LOADERMAXPERVALUE){
				dispatch(updateAppsLoaderValue(store.getState().apps.appsLoaderPerValue+DULOADERPERVALUE));
			}
			dispatch(getRoboDataset(data.slug));
	},APPSDEFAULTINTERVAL);
	return {
		type: "ROBO_DATA_UPLOAD_SUCCESS",
		slug,	
	}
}

export function dataUploadFilesError(josn){
	return {
		type: "ROBO_DATA_UPLOAD_ERROR",
		json
	}
}

export function getRoboDataset(slug) {
	return (dispatch) => {
		return fetchRoboDataset(sessionStorage.userToken,slug).then(([response, json]) =>{
			if(response.status === 200){
				if(json.analysis_done){
					clearInterval(appsInterval);
					dispatch(fetchRoboSummarySuccess(json));
					dispatch(closeAppsLoaderValue());
					dispatch(getDataSetPreview(store.getState().apps.customerDataset_slug))
					dispatch(showRoboDataUploadPreview(true));
					dispatch(hideDataPreview());
				}
			}
			else{
				dispatch(closeAppsLoaderValue());
				dispatch(showRoboDataUploadPreview(false));
				dispatch(fetchModelSummaryError(json));
			}
		})
	}
}

function fetchRoboDataset(token,slug) {
	return fetch(API+'/api/robo/'+slug+'/',{
		method: 'get',
		headers: getHeader(token)
	}).then( response => Promise.all([response, response.json()]));
}

function fetchRoboSummaryError(json) {
	return {
		type: "ROBO_SUMMARY_ERROR",
		json
	}
}
export function fetchRoboSummarySuccess(doc){
	var data = doc;
	return {
		type: "ROBO_SUMMARY_SUCCESS",
		data,
	}
}
export function showRoboDataUploadPreview(flag){
	return {
		type: "ROBO_DATA_UPLOAD_PREVIEW",
		flag,
	}
}


