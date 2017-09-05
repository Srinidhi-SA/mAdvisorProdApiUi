import React from "react";
import { Scrollbars } from 'react-custom-scrollbars';
import { MainHeader } from "../common/MainHeader";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router";
import { Modal, Button, Tab, Row, Col, Nav, NavItem, Popover, OverlayTrigger } from "react-bootstrap";
import ReactDOM from 'react-dom';

import store from "../../store";
import { C3Chart } from "../c3Chart";
import $ from "jquery";

import { updateSelectedVariables, resetSelectedVariables, setSelectedVariables,updateDatasetVariables,handleDVSearch,handelSort,handleSelectAll } from "../../actions/dataActions";

@connect(( store ) => {
    return {
        login_response: store.login.login_response, dataPreview: store.datasets.dataPreview,
        selectedVariablesCount: store.datasets.selectedVariablesCount,
        selectedMeasures: store.datasets.selectedMeasures,
        selectedDimensions: store.datasets.selectedDimensions,
        selectedTimeDimensions: store.datasets.selectedTimeDimensions,
        dataSetMeasures:store.datasets.dataSetMeasures,
        dataSetDimensions:store.datasets.dataSetDimensions,
        dataSetTimeDimensions:store.datasets.dataSetTimeDimensions,
        measureAllChecked:store.datasets.measureAllChecked,
        measureChecked:store.datasets.measureChecked,
        dimensionAllChecked:store.datasets.dimensionAllChecked,
        dimensionChecked:store.datasets.dimensionChecked,
    };
} )

export class DataVariableSelection extends React.Component {
    constructor( props ) {
        super( props );
        this.firstLoop = true;
        //this.props.dispatch(resetSelectedVariables());
        this.handleCheckboxEvents = this.handleCheckboxEvents.bind( this );
        this.setVariables = this.setVariables.bind( this );
        this.measures = [];
        this.dimensions = [];
        this.datetime = [];
        this.measureChkBoxList = [];
        this.dimensionChkBoxList = [];
    }
    handleCheckboxEvents( e ) {
        this.props.dispatch( updateSelectedVariables( e ) )
    }
    setVariables( dimensions, measures, timeDimension, count ) {
        //	this.props.dispatch(resetSelectedVariables());
        this.props.dispatch( setSelectedVariables( dimensions, measures, timeDimension ) )
    }

    componentWillMount() {
        //this.props.dispatch(resetSelectedVariables());
    }

    componentDidMount() {
        this.props.dispatch( resetSelectedVariables() );
        this.setVariables( this.dimensions, this.measures, this.datetime[this.datetime.length - 1] );
        this.props.dispatch(updateDatasetVariables(this.measures,this.dimensions,this.datetime,this.measureChkBoxList,this.dimensionChkBoxList));
        
    }

    handleDVSearch(evt){
    this.props.dispatch(handleDVSearch(evt))
    }
    handelSort(variableType,sortOrder){
    	this.props.dispatch(handelSort(variableType,sortOrder))
    }
    handleSelectAll(evt){
    	this.props.dispatch(handleSelectAll(evt))
    }
    render() {

        console.log( "data variableSelection is called##########3" );

        let dataPrev = store.getState().datasets.dataPreview;
        if ( dataPrev ) {
            console.log( "data variable selection" );
            console.log( dataPrev );
            const metaData = dataPrev.meta_data.columnData;
            // var measures =[], dimensions =[],datetime =[];
            metaData.map(( metaItem, metaIndex ) => {
                if ( this.firstLoop ) {
                    switch ( metaItem.columnType ) {
                        case "measure":
                            //m[metaItem.slug] = metaItem.name;
                            this.measures.push( metaItem.name );
                            this.measureChkBoxList.push(true);
                            //m={};
                            break;
                        case "dimension":
                            this.dimensions.push( metaItem.name );
                            this.dimensionChkBoxList.push(true)
                            break;
                        case "datetime":
                            this.datetime.push( metaItem.name );
                            break;
                    }
                }


            } );
            this.firstLoop = false;
            
            if ( store.getState().datasets.dataSetMeasures.length > 0 ) {
                var measureTemplate = store.getState().datasets.dataSetMeasures.map(( mItem, mIndex ) => {
                    const mId = "chk_mea" + mIndex;
                    return (
                        <li key={mIndex}><div className="ma-checkbox inline"><input id={mId} name={mIndex} type="checkbox" className="measure" onChange={this.handleCheckboxEvents} value={mItem} checked={store.getState().datasets.measureChecked[mIndex]}   /><label htmlFor={mId} className="radioLabels">{mItem}</label></div> </li>
                    );
                } );
            } else {
                var measureTemplate = <label>No measure variable present</label>
            }
            if ( store.getState().datasets.dataSetDimensions.length > 0 ) {
                var dimensionTemplate = store.getState().datasets.dataSetDimensions.map(( dItem, dIndex ) => {
                    const dId = "chk_dim" + dIndex;
                    return (
                        <li key={dIndex}><div className="ma-checkbox inline"><input id={dId} name={dIndex} type="checkbox" className="dimension" onChange={this.handleCheckboxEvents} value={dItem} checked={store.getState().datasets.dimensionChecked[dIndex]} /><label htmlFor={dId}>{dItem}</label></div> </li>
                    );
                } );
            } else {
                var dimensionTemplate = <label>No dimension variable present</label>
            }

            if ( store.getState().datasets.dataSetTimeDimensions.length > 0 ) {
                var datetimeTemplate = store.getState().datasets.dataSetTimeDimensions.map(( dtItem, dtIndex ) => {
                    const dtId = "rad_dt" + dtIndex;
                    return (
                        <li key={dtIndex}><div className="ma-radio inline"><input type="radio" className="timeDimension" onChange={this.handleCheckboxEvents} name="date_type" id={dtId} value={dtItem} defaultChecked={true} /><label htmlFor={dtId}>{dtItem}</label></div></li>
                    );
                } );
            } else {
                var datetimeTemplate = <label>No date dimensions to display</label>
            }

            const popoverLeft = (
                <Popover id="popover-positioned-top" title="Variables List">
                    Testing
							  </Popover>
            );
            return (
                <div>


                    <div className="row">
                        <div className="col-lg-4">
                            <label>Including the follwing variables:</label>
                        </div>{/*<!-- /.col-lg-4 -->*/}
                    </div>
                    {/*<!-------------------------------------------------------------------------------->*/}
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="panel panel-primary-p1 cst-panel-shadow">
                                <div className="panel-heading"><i className="mAd_icons ic_inflnce"></i> Measures</div>
                                <div className="panel-body">
                                    {/*  <!-- Row for select all-->*/}
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="ma-checkbox inline">
                                                <input id="measure" type="checkbox" className="measureAll" onChange={this.handleSelectAll.bind(this)} checked={store.getState().datasets.measureAllChecked}/>
                                                <label htmlFor="measure">Select All</label>
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="input-group pull-right">
                                                <input type="text" name="measure" title="Search Measures" id="measureSearch"  onChange={this.handleDVSearch.bind(this)} className="form-control" placeholder="Search measures..." />
                                                {/*<span className="input-group-addon"><i className="fa fa-search fa-lg"></i></span>*/}
                                                <span className="input-group-btn">
                                                    <button type="button" data-toggle="dropdown" title="Sorting" className="btn btn-default dropdown-toggle" aria-expanded="false"><i className="fa fa-sort-alpha-asc fa-lg"></i> <span className="caret"></span></button>
                                                    <ul role="menu" className="dropdown-menu dropdown-menu-right">
                                                        <li onClick={this.handelSort.bind(this,"measure","ASC")}><a href="#">Ascending</a></li>
                                                        <li onClick={this.handelSort.bind(this,"measure","DESC")}><a href="#">Descending</a></li>
               
                                                    </ul>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {/*  <!-- End -->*/}
                                    {/*  <hr /> */}
                                    {/*  <!-- Row for list of variables-->*/}
                                    <div className="row">
                                        <div className="col-md-12 cst-scroll-panel">
                                            <Scrollbars>
                                                <ul className="list-unstyled">
                                                    {measureTemplate}
                                                </ul>
                                            </Scrollbars>
                                        </div>
                                    </div>
                                    {/*  <!-- End Row for list of variables-->*/}
                                </div>
                            </div>

                        </div>{/*<!-- /.col-lg-4 -->*/}
                        <div className="col-lg-4">
                            <div className="panel panel-primary-p2 cst-panel-shadow">


                                <div className="panel-heading"><i className="mAd_icons ic_perf "></i> Dimensions</div>

                                <div className="panel-body">
                                    {/*  <!-- Row for select all-->*/}
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="ma-checkbox inline">
                                                <input id="dimension" type="checkbox" className="dimensionAll" onChange={this.handleSelectAll.bind(this)} checked={store.getState().datasets.dimensionAllChecked}/>
                                                <label htmlFor="dimension">Select All</label>
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="input-group pull-right">
                                                <input type="text" name="dimension" title="Search Dimension" id="dimensionSearch" onChange={this.handleDVSearch.bind(this)}  className="form-control" placeholder="Search dimension..." />
                                                {/* <span className="input-group-addon"><i className="fa fa-search fa-lg"></i></span>*/}
                                                <span className="input-group-btn">
                                                    <button type="button" data-toggle="dropdown" title="Sorting" className="btn btn-default dropdown-toggle" aria-expanded="false"><i className="fa fa-sort-alpha-asc fa-lg"></i> <span className="caret"></span></button>
                                                    <ul role="menu" className="dropdown-menu dropdown-menu-right">
                                                        <li onClick={this.handelSort.bind(this,"dimension","ASC")}><a href="#">Ascending</a></li>
                                                        <li onClick={this.handelSort.bind(this,"dimension","DESC")}><a href="#">Descending</a></li>
                                                    </ul>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {/*  <!-- End -->*/}
                                    {/* <hr /> */}
                                    {/*  <!-- Row for list of variables-->*/}
                                    <div className="row">
                                        <div className="col-md-12 cst-scroll-panel">
                                            <Scrollbars>
                                                <ul className="list-unstyled">
                                                    {dimensionTemplate}
                                                </ul>
                                            </Scrollbars>
                                        </div>
                                    </div>
                                    {/*  <!-- End Row for list of variables-->*/}


                                </div>
                            </div>


                        </div>{/*<!-- /.col-lg-4 -->*/}
                        <div className="col-lg-4">
                            <div className="panel panel-primary-p3 cst-panel-shadow">
                                <div className="panel-heading"><i className="pe-7s-date"></i> Dates</div>
                                <div className="panel-body">

                                    {/*  <!-- Row for options all-->*/}
                                    <div className="row hidden">
                                        <div className="col-md-4">

                                        </div>
                                        <div className="col-md-8">
                                            <div className="input-group pull-right">
                                                <input type="text" name="datetime" title="Search Time Dimensions" id="datetimeSearch" className="form-control" onChange={this.handleDVSearch.bind(this)} placeholder="Search time dimensions..." />
                                                {/* <span className="input-group-addon"><i className="fa fa-search fa-lg"></i></span>*/}
                                                <span className="input-group-btn">
                                                    <button type="button" data-toggle="dropdown" title="Sorting" className="btn btn-default dropdown-toggle" aria-expanded="false"><i className="fa fa-sort-alpha-asc fa-lg"></i> <span className="caret"></span></button>
                                                    <ul role="menu" className="dropdown-menu dropdown-menu-right">
                                                        <li onClick={this.handelSort.bind(this,"datetime","ASC")}><a href="#">Ascending</a></li>
                                                        <li onClick={this.handelSort.bind(this,"datetime","DESC")}><a href="#">Descending</a></li>
                                                       
                                                    </ul>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {/*<!-- End Row for options all -->*/}
                                    {/* <hr /> */}
                                    {/*<!-- Row for list of variables-->*/}
                                    <div className="row">
                                        <div className="col-md-12 cst-scroll-panel">
                                            <Scrollbars>
                                                <ul className="list-unstyled">
                                                    {datetimeTemplate}
                                                </ul>
                                            </Scrollbars>
                                        </div>
                                    </div>
                                    {/*<!-- End Row for list of variables-->*/}

                                </div>
                            </div>
                        </div>{/*<!-- /.col-lg-4 -->*/}
                    </div>  {/*<!-- /.row -->*/}
                    {/*<!-------------------------------------------------------------------------------->*/}
                    <div className="row">
                        <div className="col-md-4 col-md-offset-5">

                            <h4>{store.getState().datasets.selectedVariablesCount} Variables selected </h4>
                            {/*<OverlayTrigger trigger="click" placement="left" overlay={popoverLeft}><a><i className="pe-7s-more pe-2x pe-va"></i></a></OverlayTrigger>*/}

                        </div>
                    </div>
                </div>



            );
        } else {
            return (
                <div>No data Available</div>
            );
        }
    }
}
