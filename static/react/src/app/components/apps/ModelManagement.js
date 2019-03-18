import React from "react";
import {connect} from "react-redux";
import store from "../../store"
import { Router, Route, IndexRoute } from 'react-router';
import {openModelSummaryAction} from "../../actions/modelSummaryActions";
import {isEmpty} from "../../helpers/helper";
import {Button} from "react-bootstrap";
import {getAppsAlgoList,getAppDetails,refreshAppsAlgoList,refreshAppsModelList} from "../../actions/appActions";
  var dateFormat = require('dateformat');
@connect((store) => {
  return {
    algoList: store.apps.algoList,
    selectedSummary:store.summarySelected,
    dataPreviewFlag: store.datasets.dataPreviewFlag,
    currentAppId: store.apps.currentAppId,
    roboDatasetSlug: store.apps.roboDatasetSlug,
    modelSlug: store.apps.modelSlug,
    apps_regression_modelName:store.apps.apps_regression_modelName,
    currentAppDetails: store.apps.currentAppDetails,
  };
})

export class ModelManagement extends React.Component {
  constructor(props) {
    super(props);

  }
  
 componentWillMount() {
  // var pageNo = 1;
  //   if(this.props.history.location.search.indexOf("page") != -1){
  //       pageNo = this.props.history.location.search.split("page=")[1];
  //   }
  //   if(store.getState().apps.currentAppId == ""){
  //       this.props.dispatch(getAppDetails(this.props.match.params.AppId,pageNo));
  //   }else
  //   {
  //       this.props.dispatch(getAppsAlgoList(pageNo));
  //   }

    if (isEmpty(this.props.algoList)) {
      if (!this.props.match.path.includes("robo")) {
        let url = '/signals/'
        console.log(this.props);
        this.props.history.push(url)
      }
		}
  }

  componentDidMount() {
    this.props.dispatch(refreshAppsAlgoList(this.props));
  }
  proceedToModelSummary(item)
  {
    this.props.history.push('/apps/' + this.props.match.params.AppId + '/modelManagement/modelSummary');
    console.log(item,"item called for individual page...........................")
    this.props.dispatch(openModelSummaryAction(item));

  }
  closeModelmanagement()
  {
    var proccedUrl = this.props.match.url.replace('modelManagement','models');
    this.props.history.push(proccedUrl);
  }

  render(){
console.log(this.props.algoList,"@@@@@@@@@@@@@##################@@@@@@@@@@@@@@@@@")
var mmTable = "";
const algoList = store.getState().apps.algoList.data;

      mmTable = this.props.algoList.data.map((item,key )=> {
        return (
        <tr  className={('all ' + item.name)}>
      <td className="text-left"> {item.model_id}</td>
      <td> <i className="fa fa-briefcase text-primary"></i> {item.name}</td>
      <td className="text-left"> {item.algorithm}</td>
      <td ><span className="text-success"></span> {item.status}</td>
      <td > {item.accuracy}</td>
      <td > <i class="fa fa-calendar text-info"></i>{dateFormat( item.created_on, " mmm d,yyyy HH:MM")}</td>
      <td > {item.deployment}</td>
      <td ><i class="fa fa-clock-o text-warning"></i> {item.runtime}</td>
      <td><Button   onClick={this.proceedToModelSummary.bind(this,item)} bsStyle="primary"> Details</Button></td>
      <td>
                <div class="pos-relative">
                    <a class="btn btn-space btn-default btn-round btn-xs" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="More..">
                      <i class="ci zmdi zmdi-hc-lg zmdi-more-vert"></i>
                    </a>    
                    <ul class="dropdown-menu dropdown-menu-right">
                          <li>
                              <a href="#">Deploy</a>
                          </li>
                          <li>
                              <a href="#">Clone</a>
                          </li>
                          <li>
                              <a href="#">Delete</a>
                          </li>
                      </ul>
                  </div>
            </td>
    </tr>
  );
})

    return (
      // <!-- Main Content starts with side-body -->
      <div class="side-body">
    
        {/* <!-- Page Title and Breadcrumbs --> */}
        <div class="page-head">
          <h3 class="xs-mt-0 xs-mb-0 text-capitalize"> Model Management <br></br><small>Automated Prediction</small></h3>
        </div>
        {/* <!-- /.Page Title and Breadcrumbs --> */}
    
        {/* <!-- Page Content Area --> */}
        <div class="main-content">
    
        {/* <!-- Copy the Code From Here ////////////////////////////////////////////////// --> */}
    
        <div class="row">
            <div class="col-md-12">           
              <div class="panel box-shadow">
                <div class="panel-body no-border xs-p-20">
             <div class="row xs-mb-10">
              <div className="col-md-3">
                <div class="form-inline" >
                  <div class="form-group">
                    <label for="sdataType">Filter By: </label>
                      <input type="text" id="searchBypname" class="form-control" list="listProjectName" placeholder="Project Name"></input>
                        <datalist id="listProjectName">
                           <option value="Credit Churn Prediction"></option>
                           <option value="Ecommerce Predict"></option>
                           <option value="Call Volume"></option>
                           <option value="Student Performance"></option>								
                        </datalist> &nbsp;&nbsp;&nbsp;
                   </div>
						    </div>
               </div>
                <div class="col-md-3 col-md-offset-6">
                   <div class="form-inline" >
                      <div class="form-group pull-right">
                          <input type="text" id="search" className="form-control" placeholder="Search variables..."></input>
                      </div>
                   </div>
               </div>
            </div>
             <div class="table-responsive">
                    <table  id="mmtable" class="tablesorter table table-striped table-hover table-bordered break-if-longText">
                      <thead>
                        <tr className="myHead">
                {/* <th>
                      #
                      </th> */}
                          <th><b>Model Id</b></th>
                          <th class="text-left"><b>Project Name</b></th>
                          <th class="text-left"><b>Algorithm</b></th>
                          <th><b>Status</b></th>
                          <th><b>Accuracy</b></th>
                          <th><b>Created On</b></th>
                          <th><b>Deployments</b></th>
                <th><b>Runtime</b></th>
                <th><b>View Summary</b></th>

                <th><b>Action</b></th>
                        </tr>
                      </thead>

                      <tbody className="no-border-x">
                        {mmTable}
                      </tbody>
                    </table>
                    <div class="col-md-12 text-center">
                    </div>
                  </div>
                  <div class="buttonRow pull-right">
                    <Button   onClick={this.closeModelmanagement.bind(this)} bsStyle="primary">Close</Button>
                  </div>
                </div>
              </div>
              <div class="xs-p-30"></div>
            </div>
            {/* <!-- Open Column --> */}
          </div>
          {/* <!-- End Row --> */}
    
    
      {/* <!-- End of the Copying Code Till Here /////////////////////////////////////////// --> */}
    
        </div>
        {/* <!-- End Main Content --> */}
      </div>
    
    );
    }
  }