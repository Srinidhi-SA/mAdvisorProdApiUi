import React from 'react'
import { Link, Redirect } from "react-router-dom";
import { saveDocumentPageFlag, getOcrProjectsList } from '../../../actions/ocrActions';
import { connect } from "react-redux";
import { store } from '../../../store';
import { Pagination } from "react-bootstrap";
import { OcrProjectUpload } from './OcrProjectUpload';
import { STATIC_URL } from '../../../helpers/env';

@connect((store) => {
   return {
      OcrProjectList: store.ocr.OcrProjectList
   };
})


export class OcrProjectScreen extends React.Component {

   handleDocumentPageFlag = () => {
      this.props.dispatch(saveDocumentPageFlag(true));
   }
   componentWillMount = () => {
      this.props.dispatch(getOcrProjectsList())
   }

   handlePagination=(pageNo)=> {
      this.props.dispatch(getOcrProjectsList(pageNo))
    }

   render() {
      const pages = this.props.OcrProjectList.total_number_of_pages;
      const current_page = this.props.OcrProjectList.current_page;
      let paginationTag = null
      if (pages > 1) {
        paginationTag = (
          <div class="col-md-12 text-center">
           <div className="footer" id="Pagination">
            <div className="pagination">
              <Pagination ellipsis bsSize="medium" maxButtons={10} onSelect={this.handlePagination} first last next prev boundaryLinks items={pages} activePage={current_page} />
            </div>
           </div>
          </div>
        )
      }
      var OcrProjectTable = (
         this.props.OcrProjectList != '' ? (this.props.OcrProjectList.data.length != 0 ? this.props.OcrProjectList.data.map((item, index) => {
            return (
               <tr id={index}>
                  <td><i class="fa fa-briefcase"></i></td>
                  <td>
                     <Link to='/apps/ocr-mq44ewz7bp/project/' onClick={this.handleDocumentPageFlag}>{item.name}</Link>
                  </td>
                  <td>{item.slug}</td>
                  <td>{item.slug}</td>
                  <td>{item.slug}</td>
                  <td>{item.slug}</td>
               </tr>
            )
         }
         )
            : (<tr><td className='text-center' colSpan={6}>"No data found for your selection"</td></tr>)
         )
            : (<img id="loading" style={{ position: 'relative', left: '500px' }} src={STATIC_URL + "assets/images/Preloader_2.gif"} />)
      )
      return (
         <div>
            <OcrProjectUpload />
            <div class="table-responsive">
               <table class="table table-condensed table-hover cst_table ">
                  <thead>
                     <tr>
                        <th></th>
                        <th>Poject Name</th>
                        <th>Created At</th>
                        <th>Workflows</th>
                        <th>Last Update</th>
                        <th>Complete %</th>
                     </tr>
                  </thead>
                  <tbody class="no-border-x">
                     {OcrProjectTable}
                  </tbody>
               </table>
              {paginationTag}
            </div>
         </div>

      )
   }
}
