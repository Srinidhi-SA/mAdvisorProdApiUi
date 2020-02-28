//all the ocr related reducers..
export default function reducer(state = {
  OcrfileUpload: "",
  OcrDataList: "",
  OcrProjectList:"",
  imageFlag: false,
  imagePath: "http://madvisor-dev.marlabsai.com/media/ocrData/img-uw2ii50xd9_generated_image_fGw3pEk.png",
  ocrS3BucketDetails: {},
  s3Uploaded: false,
  s3Loader: false,
  s3FileList:"",
  s3SelFileList:[],
  s3FileFetchErrorFlag:false,
  s3FileUploadErrorFlag:false,
  s3FileFetchSuccessFlag:false,
  s3FileFetchErrorMsg:"",
  ocrFilesSortType: null,
  ocrFilesSortOn: null,
  documentFlag:false,
  filter_status: '',
  filter_confidence: '',
  filter_assignee: '',
  checked_list: '',
  search_document:'',
  search_project:'',
  selected_project_slug:'',
  selected_project_name:''
}, action) {
  switch (action.type) {
    case "OCR_UPLOAD_FILE":
      {
        return {
          ...state,
          OcrfileUpload:action.files,
        }
      }
    break;
    case "CLEAR_OCR_UPLOAD_FILES":
    {
      return {
        ...state,
        OcrfileUpload:{},
      }
    }
      break;
      case "OCR_PROJECT_LIST":
      {
        return {
          ...state,
          OcrProjectList: action.data
        }
      }
      break;
      case "OCR_PROJECT_LIST_FAIL":
      {
      throw new Error("Unable to fetch projects list!!");
      }
      
      case "OCR_UPLOADS_LIST":
      {
        return {
          ...state,
          OcrDataList: action.data
        }
      }
      break;
    case "OCR_UPLOADS_LIST_FAIL":
    {
      throw new Error("Unable to fetch uploaded images list!!");
    }
    break;
    case "OCR_UPLOADS_LIST":
    {
      return{
        ...state,
        OcrDataList:action.data
      }
    }
      break;
      case "SAVE_DOCUMENT_FLAG":
      {
        return {
          ...state,
          documentFlag: action.flag
        }
      }
      break;
    case "SAVE_S3_BUCKET_DETAILS": {
      let curS3Bucket = state.ocrS3BucketDetails;
      curS3Bucket[action.name]= action.val
      return {
        ...state,
        ocrS3BucketDetails : curS3Bucket
      }
    }
    break;
    case "SAVE_S3_FILE_LIST": {
      return {
        ...state,
        s3FileList : action.fileList,
        s3FileFetchErrorFlag : false,
        s3FileFetchSuccessFlag : true,
        s3Loader : false
      }
    }
    break;
    case "CLEAR_S3_DATA": {
      return {
        ...state,
        s3FileList : "",
        s3SelFileList: [],
        s3Loader: false,
        s3Uploaded: false,
        s3FileFetchErrorFlag : false,
        s3FileFetchSuccessFlag : false
      }
    }
    break;
    case "SAVE_SEL_S3_FILES": {
      return {
        ...state,
        s3SelFileList : action.fileName
      }
    }
    break;
    case "S3_FILE_ERROR_MSG": {
      return {
        ...state,
        s3FileFetchErrorFlag : action.flag,
        s3Loader : false,
      }
    }
    break;
    case "S3_FETCH_ERROR_MSG": {
      return {
        ...state,
        s3FileFetchErrorMsg : action.msg
      }
    }
    break;
    case "S3_FILE_UPLOAD_ERROR_MSG": {
      return {
        ...state,
        s3Loader : false,
        s3FileUploadErrorFlag : true,
      }
    }
    break;
    case "SET_S3_UPLOADED": {
      return {
        ...state,
        s3Uploaded : action.flag,
        s3FileList: "",
        s3SelFileList:[]
      }
    }
    break;
    case "SET_S3_LOADER": {
      return {
        ...state,
        s3Loader : action.flag
      }
    }
    break;
    case "SAVE_IMAGE_FLAG":
      {
        return {
          ...state,
          imageFlag: action.flag
        }
      }
      break;
    case "SAVE_IMAGE_DETAILS":
      {
        return {
          ...state,
          imagePath: "http://madvisor-dev.marlabsai.com/media/ocrData/img-uw2ii50xd9_generated_image_fGw3pEk.png"
        }
      }
      break;
    case "OCR_FILES_SORT":
      {
        return {
          ...state,
          ocrFilesSortOn: action.ocrFilesSortOn,
          ocrFilesSortType: action.ocrFilesSortType
        }
      }
      break;
    case "FILTER_BY_STATUS":
      {
        return {
          ...state,
          filter_status: action.status,
        }
      }
      break;
    case "FILTER_BY_CONFIDENCE":
      {
        return {
          ...state,
          filter_confidence: action.confidence,
        }
      }
      break;
    case "FILTER_BY_ASSIGNEE":
      {
        return {
          ...state,
          filter_assignee: action.assignee
        }
      }
      break;
    case "UPDATE_CHECKLIST":
      {
        return {
          ...state,
          checked_list: action.list
        }
      }
      break;
      case "SEARCH_OCR_DOCUMENT":
      {
        return {
          ...state,
          search_document:action.elem
        }
      }
      break;
      case "SEARCH_OCR_PROJECT":
      {
        return {
          ...state,
          search_project:action.elem
        }
      }
      break;
      case "SELECTED_PROJECT_SLUG":
      {
        return {
          ...state,
          selected_project_slug:action.slug,
          selected_project_name:action.name

        }
      }
      break;
  }
  return state
}
