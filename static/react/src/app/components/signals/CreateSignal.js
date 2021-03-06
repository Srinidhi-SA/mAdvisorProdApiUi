import React from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import {Modal,Button} from "react-bootstrap";
import store from "../../store";
import {getAllDataList,getDataSetPreview,storeSignalMeta,showDataPreview, setCreateSignalLoaderFlag} from "../../actions/dataActions";
import {ACCESSDENIED,getUserDetailsOrRestart} from "../../helpers/helper";
import {openCreateSignalModal,closeCreateSignalModal} from "../../actions/createSignalActions";

@connect((store) => {
	return {
		newSignalShowModal: store.signals.newSignalShowModal,
		allDataList: store.datasets.allDataSets,
		dataPreview: store.datasets.dataPreview,
		dataPreviewFlag:store.datasets.dataPreviewFlag,
		signalList: store.signals.signalList};
})

export class CreateSignal extends React.Component {
	constructor(props) {
		super(props);
		this.props.dispatch(closeCreateSignalModal());
		this.selectedData = {};
	}
	componentWillMount(){
		if(getUserDetailsOrRestart.get().view_data_permission=="true")
		this.props.dispatch(getAllDataList());
	}
	openSignalModal(){
		if(getUserDetailsOrRestart.get().view_data_permission=="false"){
			bootbox.alert("You don't have access to view datasets,Please contact admin for permissions!");
		}else if($.isEmptyObject(store.getState().datasets.allDataSets)){
			bootbox.alert("No datasets available.Please upload some data or connect to a database");
		}else{
			this.props.dispatch(openCreateSignalModal())
		}
	}
	closeSignalModal(){
		this.props.dispatch(closeCreateSignalModal())
	}

	getPreviewData(){
		if(this.selectedData.name==""||this.selectedData.name==null){
			document.getElementById("errorMsgs").innerText="Please select a dataset to create signal"
			return false
		}else{
			this.props.dispatch(setCreateSignalLoaderFlag(true));
			this.props.dispatch(showDataPreview());
			this.props.dispatch(getDataSetPreview(this.selectedData.name));
		}
	}

	checkSelection(e){
		if(e.target.value === "")
			document.getElementById("errorMsgs").innerText="Please select a dataset to create signal"
		else
			document.getElementById("errorMsgs").innerText=""
		var that = this;
		let selData = e.target.value;
		that.selectedData['name'] = selData
		this.props.dispatch(storeSignalMeta(that.selectedData,that.props.url));
	}
	render() {
		let dataSets = store.getState().datasets.allDataSets.data;
		let renderSelectBox = null;
		let title = "";
		var isDataUpload = this.props.signalList.permission_details.create_signal;
		let cls = "newCardStyle firstCard wow fadeInLeft"
		if(!isDataUpload){
			cls += " disable-card";
			title= ACCESSDENIED
		}else{
			if(store.getState().datasets&&store.getState().datasets.dataPreview&&store.getState().datasets.dataPreviewFlag){
				let _link = "/signals/"+this.selectedData.name;
				return(<Redirect to={_link}/>);
			}
			if(dataSets){
				renderSelectBox =dataSets.map((dataSet) => { 
					return(<option key={dataSet.slug}  value={dataSet.slug}>{dataSet.name}</option>);
				});
			}else if (getUserDetailsOrRestart.get().view_data_permission=="false") {
				renderSelectBox = "You don't have access to view datasets,Please contact admin for permissions!"
			}else{
				renderSelectBox = "No Datasets"
			}
		}

		return (
			<div class="col-md-3 xs-mb-15 list-boxes" title={title}>
				<div class={cls} onClick={this.openSignalModal.bind(this)}>
					<div class="card-header"></div>
					<div class="card-center newStoryCard">
						<h2 class="text-center"><i class="fa fa-pencil-square-o fa-2x"></i> Create Signal </h2> 	
					</div>
				</div>
				<div id="newSignal"  role="dialog" className="modal fade modal-colored-header">
					<Modal show={store.getState().signals.newSignalShowModal} onHide={this.closeSignalModal.bind(this)} dialogClassName="modal-colored-header">
						<Modal.Header closeButton>
							<h3 className="modal-title">Create Signal</h3>
						</Modal.Header>
				<Modal.Body>
					<div class="form-group">
						<label className="pb-2">Select an existing dataset</label>
						<select id="signal_Dataset" name="selectbasic" class="form-control" onChange={this.checkSelection.bind(this)}>
							<option value="">--Select dataset--</option>
							{renderSelectBox}
						</select>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<div id="errorMsgs" className="text-danger" style={{float:"left"}}></div>
						<Button id="createSignalClose"  onClick={this.closeSignalModal.bind(this)}>Close</Button>
						<Button id="createSignalCreate" bsStyle="primary" onClick={this.getPreviewData.bind(this)}>Create</Button>
					</Modal.Footer>
				</Modal>
			</div>
		</div>
		)
	}
}
