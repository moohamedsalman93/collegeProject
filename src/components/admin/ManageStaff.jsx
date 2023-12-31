import React, { useEffect, useRef, useState } from 'react'
import { AddNewCourse, addStaff, deleteCourse, deleteStaff, deleteStaffCourse, excelApi, getApi, getCourseApi, searchData, staffCourseAssign } from '../../api/api';
import { Pagination } from '../addMarks/pagiNation';
import loading from "../../assets/loading.svg";
import { debounce } from 'lodash';
import toast, { LoaderIcon } from 'react-hot-toast';

function ManageStaff() {
  const [StaffData, setStaffData] = useState([]);
  const [CourseData, setCourseData] = useState([]);
  const [Total, setTotal] = useState(0);
  const [Active, setActive] = useState(1);
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isPopup, setIsPopup] = useState(-1);
  const [isDeletePopup, setIsDeletePopup] = useState(-1)
  const [isAssignPopup, setIsAssignPopup] = useState(-1)
  const dropdownRef2 = useRef(null);
  const [isLoading3, setIsLoading3] = useState(false);
  const [isLoading4, setIsLoading4] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [addCourse, setAddCourse] = useState('')
  const [addCourseIndex, setAddCourseIndex] = useState(-1)
  const [focusedOptionIndex, setFocusedOptionIndex] = useState(0);
  const [searchValue, setSearchValue] = useState([]);
  const [isOpen2, setIsOpen2] = useState(false)
  const [Code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [Name, setName] = useState('');
  const [searchText, setSearchText] = useState('');

  const [isOpenImport, setIsOpenImport] = useState(false)
  const [fileList, setFileList] = useState(null);
  const [shouldHighlight, setShouldHighlight] = useState(false);
  const [progress, setProgress] = useState(0);

  const preventDefaultHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleUpload = async () => {

    let extention = (fileList.name).split('.')[(fileList.name).split('.').length - 1]

    if (extention !== 'csv') {
      toast.error("Please upload only csv file", { duration: 1500 });
      return
    }

    const data = new FormData();

    data.append('Excel', fileList);

    excelApi('staff/addStaffByExcel', data, setProgress, setFileList).then((res) => {
      if (res.status === 200) {
        toast.success("Imported successfully", { duration: 1500 });
      }
    })

  };

  const uploading = progress > 0 && progress < 100;

  useEffect(() => {
    getCourseApi(`staff/getAllStaff?page=${Active}`, setStaffData, setTotal, setIsLoading)
  }, [Active])


  const handleSubmit = () => {
    if (!Code || !Name || !newPassword) {
      return toast.error('Please fill all field')
    }

    const data = {
      email: Code,
      name: Name,
      password: newPassword
    }

    addStaff(data, setIsLoading3).then((res) => {
      if (res?.status === 200) {
        toast.success('Staff added successfully')
        setIsOpen(false);
        getCourseApi(`staff/getAllStaff?page=${Active}`, setStaffData, setTotal, setIsLoading)
      }
    })
  }

  const handleAssign = () => {
    if (!addCourse) {
      return toast.error('Please select code')
    }

    const data = {
      codeid: addCourseIndex,
      uname: StaffData[isAssignPopup]?.email,
      name: StaffData[isAssignPopup]?.name,
    }

    staffCourseAssign(data, setIsLoading3).then((res) => {
      if (res?.status === 200) {
        toast.success('Course assigned successfully')
        setIsAssignPopup(-1)
      }
    })
  }

  const handleUnAssign = (ItemId) => {
    deleteStaffCourse(ItemId, setIsLoading).then(res => {
      if (res?.status === 200) {
        toast.success(res.data.success)
        getApi(`staff/getStaffsDetails?uname=${StaffData[isPopup].email}`, setCourseData, setIsLoading4)
      }
    })
  }

  //#region courseOnSelect
  const courseOnSelect = index => {
    setAddCourse(searchValue[index]?.code);
    setAddCourseIndex(searchValue[index]?.id)
    setIsOpen2(false);
  };
  //#endregion

  const handlePopup = (ItemId) => {
    setIsPopup(ItemId)
    const userId = StaffData[ItemId].email
    getApi(`staff/getStaffsDetails?uname=${userId}`, setCourseData, setIsLoading4)
  }

  const handleDeletePop = (ItemId) => {
    setIsDeletePopup(ItemId)
  }

  const handleDelete = (ItemId) => {
    deleteStaff(ItemId, setIsLoading).then(res => {
      if (res?.status === 200) {
        setIsDeletePopup(-1)
        toast.success(res.data.success)
        getCourseApi(`staff/getAllStaff?page=${Active}`, setStaffData, setTotal, setIsLoading)
      }
    })
  }


  //#region apicall
  const handleInputChange = debounce(async (value) => {
    if (value.length % 2 !== 0) {
      getCourseApi(`staff/getAllStaff?page=1&question=${value}`, setStaffData, setTotal, setIsLoading)
    }
    else if (value.length == 0) {
      getCourseApi(`staff/getAllStaff?page=1&question=`, setStaffData, setTotal, setIsLoading)
    }
  }, 500);
  //#endregion

  //#region handle input changes for search
  const handleInput = (e) => {
    const value = e.target.value;
    setSearchText(value);
    handleInputChange(value);
  };
  //#endregion

  //#region search
  const handleCourseSearch = debounce(async (val) => {
    if (val.length > 0) {
      searchData('staff/searchCourse?question=' + val, setSearchValue, setIsLoading2)
    }

  }, 500);
  //#endregion

  //#region courseOnChange
  const courseOnChange = event => {
    setAddCourse(event.target.value.toUpperCase());
    handleCourseSearch(event.target.value.toUpperCase());
  };
  //#endregion

  //#region drop
  const handleDropdownToggle2 = () => {
    setIsOpen2(!isOpen2);
  };
  //#endregion


  return (
    <div className=' h-full w-full flex flex-col'>
      <div className=' h-20 px-10  py-2 w-full flex justify-between items-end space-x-2'>
        <p className=' font-semibold text-xl grow'>Manage Staff</p>

        <div className=' flex relative w-fit h-fit'>
          <input
            type="text"
            value={searchText}
            onChange={handleInput}
            placeholder="Search here"
            className='bg-[#F8FCFF] shadow-xl border-[1.5px] h-10 w-[14rem] rounded-md px-2 placeholder:text-gray-600 text-black font-medium'
          />
          <div className=' absolute right-2 h-full flex flex-col justify-center'>
            <ion-icon name="search"></ion-icon>
          </div>
        </div>

        <button onClick={() => setIsOpen(true)} className=' h-10 px-3 bg-black rounded-lg text-white'>Add Staff</button>
      </div>

      <div className=' w-full grow flex flex-col items-center py-4'>
        <div className=' w-[60%] font-semibold text-lg grid grid-cols-5 h-12 bg-slate-300 place-content-center place-items-center rounded-lg'>
          <p>No</p>
          <p>Code</p>
          <p className=''>Course Name</p>
          <p className=' '>Action</p>
          <p className=' '>Details</p>
        </div>
        {isLoading ? <img src={loading} alt="" className=' h-12 w-12 absolute top-1/2' /> : (StaffData.length === 0 ? <div className=' font-medium mt-5'>No Data Found</div> : StaffData.map((item, index) =>
          <div key={index} className={` w-[60%] font-medium text-sm grid grid-cols-5 h-12 border-b place-content-center place-items-center rounded-lg`}>
            <p>{index + 1 + (Active - 1) * 10}</p>
            <p>{item.email}</p>
            <p className=' text-center truncate overflow-hidden w-full'>{item.name}</p>
            <div className=' flex space-x-2'>
              <div className=' flex space-x-3'>
                <div className=' text-lg' onClick={() => setIsAssignPopup(index)}>
                  <ion-icon name="add"></ion-icon>
                </div>
                <div className=' text-lg text-red-500' onClick={() => handleDeletePop(index)}>
                  <ion-icon name="trash-outline"></ion-icon>
                </div>
              </div>

            </div>
            <div className=' bg-blue-500 px-4 py-1 rounded-md text-white cursor-pointer' onClick={() => handlePopup(index)}>
              show
            </div>

          </div>
        ))
        }
      </div>

      <div className=' h-10 w-full flex justify-center items-start relative'>
        <Pagination active={Active} setActive={setActive} total={Total} />

        <button className=' px-4 py-2 bg-[#4f72cc] absolute right-3 bottom-2 rounded-md text-white font-medium ' onClick={() => setIsOpenImport(true)}>Import</button>

      </div>

      {isOpen &&
        <div className=" fixed z-20 w-screen h-screen  top-0 right-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center">
          <div className=" w-[30%] h-[40%] rounded-lg bg-white shadow-2xl antialiased p-2 flex flex-col">
            <div className="w-full grow flex flex-col">

              <div className=" flex space-x-2 text-xl font-semibold items-center border-b py-2">
                <ion-icon name="add"></ion-icon>
                <p >Add staff</p>
              </div>

              <div className=" w-full  grow flex flex-col space-y-2 justify-start items-center px-7 py-4">

                <div className=' w-full space-x-2 flex items-center '>
                  <h1 className="text-[#676060] w-[40%]">Staff Code :</h1>
                  <input
                    type="text"
                    value={Code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="232421"
                    className='bg-[#F8FCFF] shadow-sm border h-10 w-[9rem] xl:w-[60%] rounded px-2 text-black font-medium'
                  />

                </div>

                <div className=' w-full space-x-2 flex items-center '>
                  <h1 className="text-[#676060] w-[40%]">Password :</h1>
                  <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="password"
                    className='bg-[#F8FCFF] shadow-sm border h-10 w-[9rem] xl:w-[60%] rounded px-2 text-black font-medium'
                  />

                </div>

                <div className=' w-full space-x-2 flex items-center '>
                  <h1 className="text-[#676060] w-[40%]">Staff Name :</h1>
                  <input
                    type="text"
                    value={Name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Salman"
                    className='bg-[#F8FCFF] shadow-sm border h-10 w-[9rem] xl:w-[60%] rounded px-2 text-black font-medium'
                  />

                </div>

              </div>

            </div>

            <div className=" w-full space-x-2 flex justify-end font-medium ">
              <button className=" px-3 py-2 rounded-md hover:bg-red-700 text-red-700 hover:bg-opacity-10 transition-all duration-700" onClick={() => setIsOpen(false)}>Cancel</button>
              <button className=" px-2 py-2 rounded-md bg-[#4f72cc] text-white hover:shadow-lg hover:shadow-[#4f72cc] transition-all duration-700" onClick={() => handleSubmit()}>Add</button>
            </div>


          </div>
        </div>
      }

      {isPopup !== -1 &&
        <div className=" fixed z-20 w-screen h-screen  top-0 right-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center">
          <div className=" w-[40%] h-[60%] rounded-lg bg-white shadow-2xl antialiased p-2 flex flex-col">
            <div className=' flex w-full justify-between h-12 border-b items-center'>
              <p className=' font-bold'>Manage Course </p>
              <p className=' font-medium'>{StaffData[isPopup].name}</p>
            </div>
            <div className="w-full grow max-h-[82%] flex flex-col">
              <div className=' w-full grow flex flex-col items-center py-4'>
                <div className=' w-full font-semibold text-base grid grid-cols-5 h-12 bg-slate-300 place-content-center place-items-center rounded-lg'>
                  <p>index</p>
                  <p>depCode</p>
                  <p>Course Code</p>
                  <p>Course Name</p>
                  <p>Action</p>
                </div>
                {isLoading4 ? <img src={loading} alt="" className=' h-12 w-12 absolute top-1/2' /> :
                  (<div className=' w-full max-h-[78%] overflow-y-auto'>
                    {
                      CourseData.length !== 0 ? CourseData.map((item, index) =>
                        <div key={index} className={` w-full font-medium text-sm grid grid-cols-5 h-12 border-b place-content-center place-items-center rounded-lg`}>
                          <p>{index + 1}</p>
                          <p>{item.code.depCode}</p>
                          <p>{item.code.code}</p>
                          <p className=' text-center truncate overflow-hidden w-full'>{item.code.name}</p>

                          <div className=' bg-red-500 px-4 py-1 rounded-md text-white cursor-pointer' onClick={() => handleUnAssign(item.id)}>
                            remove
                          </div>

                        </div>
                      ) : <div className=' w-full flex justify-center mt-5 font-medium'>Not found</div>
                    }
                  </div>
                  )
                }
              </div>

            </div>

            <div className=" w-full space-x-2 flex justify-end font-medium ">
              <button className=" px-2 py-2 rounded-md bg-[#4f72cc] text-white hover:shadow-lg hover:shadow-[#4f72cc] transition-all duration-700" onClick={() => setIsPopup(-1)}>Close</button>
            </div>


          </div>
        </div>
      }

      {isDeletePopup !== -1 &&
        <div className=" fixed z-20 w-screen h-screen  top-0 right-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center">
          <div className=" w-[30%] h-[40%] rounded-lg bg-white shadow-2xl antialiased p-2 flex flex-col">
            <div className="w-full grow flex flex-col">

              <div className=" flex space-x-2 text-xl font-semibold items-center border-b py-2">
                <ion-icon name="trash-outline"></ion-icon>
                <p >Delete</p>
              </div>

              <div className=" w-full  grow flex flex-col space-y-2 justify-center items-center px-7 py-4 font-medium">
                <p className=' text-center text-lg text-red-500'><ion-icon name="warning"></ion-icon>Assigned Courses will be Un Assigned</p>
                <p className=' text-center'>Are you sure to delete "<span className=' font-bold'>{StaffData[isDeletePopup].name} </span>" ? </p>
              </div>

            </div>

            <div className=" w-full space-x-2 flex justify-end font-medium ">
              <button className=" px-2 py-2 rounded-md bg-[#4f72cc] text-white hover:shadow-lg hover:shadow-[#4f72cc] transition-all duration-700" onClick={() => setIsDeletePopup(-1)}>Cancel</button>
              <button className=" px-3 py-2 rounded-md hover:bg-red-700 text-red-700 hover:bg-opacity-10 transition-all duration-700" onClick={() => handleDelete(StaffData[isDeletePopup].id)}>Sure</button>

            </div>


          </div>
        </div>
      }

      {isAssignPopup !== -1 &&
        <div className=" fixed z-20 w-screen h-screen  top-0 right-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center">
          <div className=" w-[30%] h-[40%] rounded-lg bg-white shadow-2xl antialiased p-2 flex flex-col">
            <div className="w-full grow flex flex-col">

              <div className=" flex space-x-2 text-xl font-semibold items-center border-b py-2">
                <ion-icon name="add"></ion-icon>
                <p >New course assign</p>
              </div>

              <div className=" w-full  grow flex flex-col space-y-2 justify-start items-center px-7 py-4">

                <div className=' flex space-x-2 w-full font-medium'>
                  <p className='w-[40%]'>Staff Name :</p>
                  <p>{StaffData[isAssignPopup].name}</p>
                </div>

                <div className=' w-full space-x-2 flex items-center relative ' ref={dropdownRef2}>
                  <h1 className="text-[#676060] w-[40%]">Course code :</h1>
                  <input
                    type="text"
                    value={addCourse}
                    onChange={courseOnChange}
                    onFocus={handleDropdownToggle2}
                    placeholder="23MCA1CC3"
                    className='bg-[#F8FCFF] shadow-sm border h-10 w-[60%] rounded px-2 text-black font-medium'
                  />
                  {isOpen2 && (
                    <ul className="absolute z-20 mt-2 w-[60%] flex right-0 top-9 flex-col items-center min-h-min max-h-[10rem] overflow-y-hidden  bg-white border border-gray-300 rounded-md shadow-md">
                      {isLoading2 ? (<img src={loading} alt="" className=" w-8 h-8 animate-spin text-black" />) :
                        (searchValue.length === 0 ? (
                          <li className="py-1 px-4 text-gray-400">{addCourse.length === 0 ? "Type..." : "No course found"}</li>
                        ) : (
                          searchValue.map((item, index) => (
                            <li
                              key={item.id}
                              onClick={() => courseOnSelect(index)}
                              className={`py-1 px-4 font-medium cursor-pointer ${index === focusedOptionIndex ? 'bg-blue-200 w-full flex justify-center' : ''}`}
                            >
                              {item.code}
                            </li>
                          ))
                        ))
                      }
                    </ul>
                  )}
                </div>

              </div>

            </div>

            <div className=" w-full space-x-2 flex justify-end font-medium ">
              <button className=" px-3 py-2 rounded-md hover:bg-red-700 text-red-700 hover:bg-opacity-10 transition-all duration-700" onClick={() => setIsAssignPopup(-1)}>Cancel</button>
              <button className=" px-2 py-2 rounded-md bg-[#4f72cc] text-white hover:shadow-lg hover:shadow-[#4f72cc] transition-all duration-700" onClick={() => handleAssign()}>Assign</button>
            </div>


          </div>
        </div>
      }

      {isOpenImport &&
        <div className=" fixed z-20 w-screen h-screen  top-0 right-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center">
          <div className=" w-[30%] h-[50%] rounded-lg bg-white shadow-2xl antialiased p-2 flex flex-col">
            <div className="w-full grow flex flex-col space-y-4">

              <div className=" flex space-x-2 text-xl font-semibold items-center">
                <ion-icon name="cloud-upload-outline"></ion-icon>
                <p >Excel Import</p>
              </div>

              <div className=" w-full  grow flex  flex-col justify-evenly items-center">

                <div
                  className="w-[70%] h-[50%] p-4 grid place-content-center cursor-pointer bg-blue-50 text-[#4f72cc] rounded-lg hover:bg-blue-100 border-4 border-dashed border-violet-100 hover:border-[#4f72cc] transition-colors"
                  onDragOver={(e) => {
                    preventDefaultHandler(e);
                    setShouldHighlight(true);
                  }}
                  onDragEnter={(e) => {
                    preventDefaultHandler(e);
                    setShouldHighlight(true);
                  }}
                  onDragLeave={(e) => {
                    preventDefaultHandler(e);
                    setShouldHighlight(false);
                  }}
                  onDrop={(e) => {
                    preventDefaultHandler(e);
                    // Get the first file from the dropped files
                    setFileList(e.dataTransfer.files[0]); // Set the fileList state with an array containing only the first file
                    setShouldHighlight(false);
                  }}
                >
                  <div className="flex flex-col items-center">
                    {!fileList ? (
                      <>
                        <ion-icon name="cloud-upload-outline"></ion-icon>
                        <span>
                          <span>Choose a File</span> or drag it here
                        </span>
                      </>
                    ) : (
                      <>
                        <p>Files to Upload</p>

                        <span >{fileList.name}</span>;

                        <div className="flex gap-2 mt-2">
                          <button
                            className="bg-[#4f72cc] text-violet-50 px-2 py-1 rounded-md w-full"

                            onClick={() => handleUpload()}
                          >
                            {uploading
                              ? `Uploading...  ( ${progress.toFixed(2)}% )`
                              : "Upload"}
                          </button>
                          {!uploading && (
                            <button
                              className="border border-[#4f72cc] px-2 py-1 rounded-md"
                              onClick={() => {
                                setFileList(null);
                              }}
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

              </div>

            </div>
            <div className=" w-full space-x-2 flex justify-end font-medium ">
              <button className=" px-3 py-2 rounded-md hover:bg-red-700 text-red-700 hover:bg-opacity-10 transition-all duration-700" onClick={() => setIsOpenImport(false)}>Close</button>

            </div>
          </div>
        </div>
      }


    </div>
  )
}

export default ManageStaff
