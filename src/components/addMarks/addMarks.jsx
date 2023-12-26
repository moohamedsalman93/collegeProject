import React, { useEffect, useRef, useState } from "react";
import "../../App.css";
import loading from "../../assets/loading.svg";
import axios from "axios";
import toast from "react-hot-toast";
import { DeleteApi, getApi, getCourseApi, getRegMarksApi, getStaffCourse, searchData } from "../../api/api";
import { debounce } from 'lodash';
import { useNavigate } from "react-router-dom";
import ObComponents from "./obComponents";
import ExistingStudent from "./ExistingStudent";
import jwtDecode from "jwt-decode";

const AddMarks = () => {

  //#region  Variables
  const dropdownRef2 = useRef(null);
  const Navigate = useNavigate();
  const [focusedOptionIndex, setFocusedOptionIndex] = useState(0);
  const [isOpen2, setIsOpen2] = useState(false);
  const [CourseData, setCourseData] = useState([]);
  const [searchValue, setSearchValue] = useState([]);

  const [courseCode, setCourseCode] = useState("");
  const [deparment, setdepartment] = useState("");
  const [regNo, setRegNo] = useState("");
  const [section, setSection] = useState("");
  const [Assignment, setAssignment] = useState('')
  const [examType, setExamType] = useState("C1");
  const [staffIntial, setStaffIntial] = useState('');
  const [Uname, setUname] = useState('');
  const [studentStatus, setStudentStatus] = useState('');
  const [totalMarks, setTotalMarks] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isLoading3, setIsLoading3] = useState(false);
  const [existingData, setExistingData] = useState([]);
  const [marks, setMarks] = useState({});
  const [typeData, setTypeData] = useState([]);
  const [editStudent, setEditstudent] = useState(-1);
  const [regData, setRegData] = useState({});
  const [SortBy, setSortby] = useState(true)
  const [active, setActive] = useState(1)
  const [total, setTotal] = useState(1)
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);

  const questions = [
    "LOT",
    "MOT",
    "HOT",
  ];
  const [value, setValue] = useState("");

  const numRows = Math.ceil(questions.length / 4);
  //#endregion

  useEffect(() => {
    let token = localStorage.getItem('token');


    if (token) {
      const decode = jwtDecode(token);
      setStaffIntial(decode?.name)
      setUname(decode.uname)
    }
  }, [])

  //#region max mark:
  const markLimits = {
    LOT: { min: 0, max: 34 },
    MOT: { min: 0, max: 36 },
    HOT: { min: 0, max: 10 },
  };

  //#endregion

  //#region  Create an array of arrays

  //#endregion

  //#region  markChange
  // const handleMarkChange = (question, value) => {
  //   if (value === "") {
  //     setMarks((prevMarks) => ({
  //       ...prevMarks,
  //       [question]: value,
  //     }));
  //   } else {
  //     const numericValue = value;
  //     const markLimitsForQuestion = markLimits[question];

  //     // Check if the input is a valid number within the allowed range
  //     if (
  //       numericValue >= markLimitsForQuestion.min &&
  //       numericValue <= markLimitsForQuestion.max
  //     ) {
  //       setMarks((prevMarks) => ({
  //         ...prevMarks,
  //         [question]: numericValue,
  //       }));
  //     } else if (numericValue === 0) {
  //       setMarks((prevMarks) => ({
  //         ...prevMarks,
  //         [question]: numericValue,
  //       }));
  //     }
  //   }
  // };
  //#endregion

  //#region  markChange
  const handleMarkChange = (question, value) => {
    if (value === "") {
      setMarks((prevMarks) => ({
        ...prevMarks,
        [question]: value,
      }));
    } else {
      const numericValue = value; // Convert the input value to a number
      const markLimitsForQuestion = markLimits[question];

      if (
        numericValue >= markLimitsForQuestion.min &&
        numericValue <= markLimitsForQuestion.max
      ) {
        setMarks((prevMarks) => ({
          ...prevMarks,
          [question]: numericValue,
        }));
        // } else if (numericValue === 0) {
        //   setMarks((prevMarks) => ({
        //     ...prevMarks,
        //     [question]: numericValue,
        //   }));
      } else {
        // Show a toast message for invalid input
        toast.error(
          "Please enter a mark between " +
          markLimitsForQuestion.min +
          " and " +
          markLimitsForQuestion.max,
          { duration: 1500 }
        );

        // Highlight the input box dynamically using Tailwind CSS classes
        const inputElement = document.getElementById(question);
        if (inputElement) {
          inputElement.classList.add("border-2", "border-red-500");
          setTimeout(() => {
            inputElement.classList.remove("border-red-500");
          }, 1500); // Remove the highlight after 3 seconds
        }
      }
    }
  };
  //#endregion

  //#region  clearMarks
  const handleClear = () => {
    setEditstudent(-1);

    const clearedMarks = {};
    for (const question of questions) {
      clearedMarks[question] = "";
    }
    setMarks(clearedMarks);
    setAssignment('')
  };
  //#endregion

  //#region  HandleSubmit
  const handleSubmit = (e) => {

    e.preventDefault();
    if (examType === 'C1' || examType === 'C2' || examType === 'ESE') {
      for (const question of questions) {
        if (marks[question] === '') {
          toast.error(`Please fill ${question} Field`, { duration: 1500 });
          return;
        }
      }
    }

    if (!deparment || !courseCode || !regNo) {
      toast.error("Please fill all detail first", { duration: 1500 });
      return;
    }


    const addData = async () => {
      setIsLoading(true);

      const marksAsNumbers = {};
      for (const question of questions) {
        marksAsNumbers[examType + question] = parseInt(marks[question] || 0, 10);
      }

      const sStatus = examType + 'STATUS'
      const StaffIn = examType + 'STAFF'

      const statusStudent = studentStatus === '' ? 'present' : studentStatus
      var typeDe = examType

      const newDataforMark = {
        regNo: '23' + deparment + regNo,
        department: deparment,
        code: courseCode,
        claass: deparment,
        section: "A",
        status: statusStudent,
        [sStatus]: statusStudent,
        [StaffIn]: staffIntial,
        exam: examType,
        ...marksAsNumbers,
      };

      const newDataforAss = {
        regNo: '23' + deparment + regNo,
        department: deparment,
        code: courseCode,
        claass: deparment,
        section: "A",
        status: statusStudent,
        exam: "ASG",
        [StaffIn]: staffIntial,
        [typeDe]: parseInt(Assignment, 10),
      };

      var newData;

      if (examType === 'ASG1' || examType === 'ASG2') {
        newData = newDataforAss
      }
      else {
        newData = newDataforMark
      }

      try {
        await axios
          .post("http://localhost:3000/staff/addMarks", newData)
          .then((res) => {
            if (res.status === 200) {
              setIsLoading(false);

              toast.success("Mark saved successfully", { duration: 1500 });
              getApi(`staff/getMarkByCode?code=${courseCode}&department=${deparment}`, setExistingData, setIsLoading3)
              if (editStudent === -1) {
                const last3Digits = parseInt(regNo, 10);
                const newLast3Digits = (last3Digits + 1).toString().padStart(3, "0");
                // Update the state with the new value
                setRegNo(newLast3Digits);
                handleClear()
                setStudentStatus('')
              }
              else {
                setRegNo('')
                handleClear('')
                setEditstudent(-1)
                setStudentStatus('')
              }

            } else {
              toast.error(res.data.error.message, { duration: 1500 });
              setIsLoading(false);
            }
          });
      } catch (err) {
        toast.error(err.response.data.error.message, { duration: 1500 });
        setIsLoading(false);
      }
    };

    addData();
  };
  //#endregion

  //#region Handle Input Change
  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    if (inputValue === "" || (inputValue >= 0 && inputValue <= 3)) {
      setValue(inputValue);
    } else {
      toast.error("Please enter a number between 0 and 3.", { duration: 1500 });
    }
  };
  //#endregion

  //#region Handle Outside Click
  const handleOutsideClick2 = event => {
    if (dropdownRef2.current && !dropdownRef2.current.contains(event.target)) {
      setIsOpen2(false);
    }
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
    document.addEventListener('click', handleOutsideClick2);
    return () => {
      document.removeEventListener('click', handleOutsideClick2);
    };
  }, []);
  //#endregion

  //#region useEffect
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Arrow down
      if (event.keyCode === 40) {
        event.preventDefault();
        setFocusedOptionIndex((prevIndex) => Math.min(prevIndex + 1, searchValue.length - 1));
      }
      // Arrow up
      else if (event.keyCode === 38) {
        event.preventDefault();
        setFocusedOptionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      }
      // Enter
      else if (event.keyCode === 13) {
        event.preventDefault();
        if (searchValue[focusedOptionIndex]) {
          departmentOnSelect(searchValue[focusedOptionIndex]);
        }
      }
    };

    if (isOpen2) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen2, searchValue, focusedOptionIndex]);
  //#endregion

  //#region departmentOnSelect
  const departmentOnSelect = item => {
    setdepartment(item.departmentCode);
    setIsOpen2(false);
    getStaffCourse(`staff/getStaff?department=${item.departmentCode}&uname=${Uname}`, setCourseData, setIsLoading2)
  };
  //#endregion

  //#region search
  const handleDepSearch = debounce(async (val) => {
    if (val.length > 0) {
      searchData('staff/searchDepartment/?question=' + val, setSearchValue, setIsLoading2)
    }

  }, 500);
  //#endregion

  //#region drop
  const handleDropdownToggle2 = () => {
    setIsOpen2(!isOpen2);
  };
  //#endregion

  //#region departmentOnChange
  const departmentOnChange = event => {
    setEditstudent(-1)
    setdepartment(event.target.value.toUpperCase());
    handleDepSearch(event.target.value.toUpperCase());
    setMarks({})
  };
  //#endregion

  //#region useffect total
  useEffect(() => {
    // Calculate the sum of all marks
    const sum = Object.values(marks).reduce((acc, curr) => acc + parseInt(curr || 0), 0);
    setTotalMarks(sum);
  }, [marks]);
  //#endregion

  //#region hanledOnselectCource
  const handleCourseOnslect = (e) => {
    setCourseCode(e.target.value)
    getCourseApi(`staff/getMarkByCode?code=${e.target.value}&department=${deparment}&sortby=${SortBy}`, setExistingData, setTotal, setIsLoading3)
  }
  //#endregion

  //#region typeStudent
  useEffect(() => {
    const ex = examType + 'STAFF'
    setIsLoading3(true)
    if (courseCode && deparment) {
      const sData = existingData?.filter((item) => item.marks.length !== 0 ? item?.marks[0][ex] !== null : null);
      setTypeData(sData)
    }
    setIsLoading3(false)
  }, [existingData, examType])
  //#endregion

  //#region handleEditClick
  const handleEditClick = (index) => {
    let temp = {}
    setEditstudent(index)
    setRegNo(typeData[index].regNo.slice(-3))
    console.log(examType)
    if (examType === 'ASG1') {
      setAssignment(typeData[index].marks[0].ASG1)
    }
    else if (examType === 'ASG2') {
      setAssignment(typeData[index].marks[0].ASG2)
    }
    else {
      setStudentStatus(typeData[index].marks[0][examType + 'STATUS'] === 'present' ? '' : typeData[index].marks[0][examType + 'STATUS'])
      for (let m in questions) {
        temp[questions[m]] = typeData[index].marks[0][examType + questions[m]]
      }
      setMarks(temp)
    }

  }
  //#endregion

  //#region setExamtype
  const handleSetExamtype = (e) => {
    setEditstudent(-1)
    setMarks({})
    setdepartment('');
    setCourseCode('')
    setRegNo('')
    setSection('')
    setExamType(e.target.value)
    setAssignment('')
  }
  //#endregion

  //#region handleAssignment
  const handleAssignment = (e) => {
    if (e.target.value >= 0 && e.target.value <= 3) {
      setAssignment(e.target.value);
    }
    else {
      toast.error('Value Should be between 0 and 3 only')
    }
  }
  //#endregion

  //#region handleFillmark
  const handleFillmark = () => {
    setMarks({
      Q1: "1",
      Q2: "1",
      Q3: "1",
      Q4: "1",
      Q5: "1",
      Q6: "1",
      Q7: "1",
      Q8: "1",
      Q9: "1",
      Q10: "1",
      Q11: "1",
      Q12: "1",
      Q13: "1",
      Q14: "1",
      Q15: "1",
      Q16: "1",
      Q17: "1",
      Q18: "1",
      Q19: "1",
      Q20: "1",
      Q21: "1",
      Q22: "1",
      Q23: "1",
      Q24: "1",
      Q25: "1",
      Q26: "1",
      Q27: "1",
      Q28: "1",
    })
  }
  //#endregion

  //#region handleDelete
  const handleDelete = () => {
    const markId = typeData[editStudent]?.marks[0]?.id
    DeleteApi('staff/deleteMark', { id: markId, exam: examType }, setIsLoading).then(res => {
      if (res.status === 200) {
        toast.success('mark deleted successfully')
        getApi(`staff/getMarkByCode?code=${courseCode}&department=${deparment}&sortby=${SortBy}`, setExistingData, setIsLoading3)
        handleClear()
        setRegNo('')
      }
    })

  }
  //#endregion

  //#region handleReg
  const handleReg = (e) => {
    setRegNo(e.target.value)
    if (editStudent !== -1) {
      setEditstudent(-1)
      handleClear()
    }
  }
  //#endregion

  //#region handleGetreg
  const handleGetreg = () => {

    const params = {
      code: courseCode,
      department: deparment,
      regNo: '23' + deparment + regNo
    }

    let temp = {}

    if (regNo && deparment && courseCode) {
      const temp = {}
      getRegMarksApi('staff/byCode', setRegData, params, setIsLoading).then((res) => {
        if (res.data.success) {
          if (examType === 'ASG1') {
            if (res.data.marks[0].ASG1STAFF !== null) {
              toast.success('marks Already exist in reg No')
              setAssignment(res.data.marks[0].ASG1)
            }

          }
          else if (examType === 'ASG2') {
            if (res.data.marks[0].ASG2STAFF !== null) {
              toast.success('marks Already exist in reg No')
              setAssignment(res.data.marks[0].ASG2)
            }

          }
          else {
            if (res.data.marks[0][examType + 'STAFF'] === null) {

            } else {
              for (let m in questions) {
                temp[questions[m]] = res.data.marks[0][examType + questions[m]]
              }
              toast.success('marks Already exist in reg No')
              setMarks(temp)
            }

          }
        }
        else {
          for (let m in questions) {
            temp[questions[m]] = ''
          }
          setMarks(temp)
        }
      })
    }

  }
  //#endregion

  //#region sortBy
  useEffect(() => {
    setActive(1)
    if (courseCode && deparment) {
      getCourseApi(`staff/getMarkByCode?code=${courseCode}&department=${deparment}&sortby=${SortBy}`, setExistingData, setTotal, setIsLoading3)
    }

  }, [SortBy])
  //#endregion

  //#region useEffect paginationChange
  useEffect(() => {
    getCourseApi(`staff/getMarkByCode?code=${courseCode}&department=${deparment}&sortby=${SortBy}&page=${active}`, setExistingData, setTotal, setIsLoading3)
  }, [active])
  //#endregion

  return (
    <div className=" w-full h-full  relative  flex justify-center items-center ">

      <div className="flex flex-row w-full h-full gap-3 justify-between">
        <div className="flex flex-col  space-y-4 bg-white p-2 rounded-lg w-[72%] border-r shadow-md">

          <div className="flex flex-wrap gap-4 pt-20 w-full h-fit px-5">

            <div className=" space-y-2">
              <h1 className="text-base font-normal text-[#676060]">
                OB components :
              </h1>
              <div className=" flex space-x-4 items-end ">
                <ObComponents examType={examType} handleSetExamtype={handleSetExamtype} value={'C1'} textlabel={'CIA-1'} />
                <ObComponents examType={examType} handleSetExamtype={handleSetExamtype} value={'C2'} textlabel={'CIA-2'} />
                <ObComponents examType={examType} handleSetExamtype={handleSetExamtype} value={'ESE'} textlabel={'ESE'} />
                <ObComponents examType={examType} handleSetExamtype={handleSetExamtype} value={'ASG1'} textlabel={'OC-1'} />
                <ObComponents examType={examType} handleSetExamtype={handleSetExamtype} value={'ASG2'} textlabel={'OC-2'} />
              </div>
            </div>

            <div className=" flex justify-between w-full">
              <div className='w-[9rem] space-y-2 xl:w-[9rem] ' ref={dropdownRef2}>
                <h1 className="text-[#676060]">Department :</h1>
                <input
                  type="text"
                  value={deparment}
                  maxLength={3}
                  // onBlur={() => !optionSelected && setdepartment('')} // Modify this line
                  onChange={departmentOnChange}
                  onFocus={handleDropdownToggle2}
                  placeholder="Eg: MCA"
                  className='bg-[#F8FCFF] shadow-sm border h-10 w-[9rem] xl:w-[9rem] rounded px-2 text-black font-medium'
                />
                {isOpen2 && (
                  <ul className="absolute z-20 mt-2 w-[9rem] xl:w-[9rem] flex flex-col items-center min-h-min max-h-[20rem] overflow-y-hidden  bg-white border border-gray-300 rounded-md shadow-md">
                    {isLoading2 ? (<img src={loading} alt="" className=" w-8 h-8 animate-spin text-black" />) :
                      (searchValue.length === 0 ? (
                        <li className="py-1 px-4 text-gray-400">{deparment.length === 0 ? "Type..." : "No Department found"}</li>
                      ) : (
                        searchValue.map((item, index) => (
                          <li
                            key={item.id}
                            onClick={() => departmentOnSelect(item)}
                            className={`py-1 px-4 cursor-pointer ${index === focusedOptionIndex ? 'bg-blue-200 w-full flex justify-center' : ''}`}
                          >
                            {item.departmentCode}
                          </li>
                        ))
                      ))
                    }
                  </ul>
                )}
              </div>

              <div className=" space-y-2 ">
                <h1 className="text-[#676060]">Course Code :</h1>
                <select
                  value={courseCode}
                  onChange={handleCourseOnslect}
                  className={`bg-[#F8FCFF] shadow-sm border h-10 w-[9rem]   rounded px-2 ${courseCode === '' ? 'text-gray-400' : 'text-black'}`}
                >
                  <option value='' className="rounded mt-10">
                    Select Code
                  </option>

                  {CourseData.map((course, index) => (
                    <option key={index} value={course.courseCode} className="rounded">
                      {course.courseCode}
                    </option>
                  ))}
                </select>
              </div>

              <div className=" space-y-2">
                <h1 className="text-[#676060]">Register No:</h1>
                <div className=" flex bg-[#F8FCFF] border rounded px-2 items-center min-w-[100px] max-w-fit space-x-1">
                  <h1 className=" font-medium">23{deparment !== '' ? deparment : 'MCA'}</h1>
                  <input
                    type="tel"
                    placeholder="XXX"
                    value={regNo}
                    onBlur={handleGetreg}
                    onChange={handleReg}
                    maxLength={3}
                    max={3}
                    required
                    className="bg-[#F8FCFF] shadow-sm border  h-10 w-[2rem] xl:w-[2rem] rounded  placeholder-gray-400 placeholder:text-gray-400   text-black  placeholder-opacity-0 transition duration-200"
                    style={{ border: 'none', outline: 'none' }}
                    tabIndex={1}
                  />

                </div>

              </div>

              <div className=" bg-slate-200 py-2 col-span-2 space-x-2 flex items-center shadow-md border justify-center rounded-md  px-3 w-fit">

                <h1 className="">Status :</h1>

                <button
                  tabIndex={3}
                  className={`transition-all duration-300 bg-[#F8FCFF] shadow-sm border h-10 w-fit font-medium rounded-md px-2 ${studentStatus === 'absent' ? 'bg-[#4f72cc] text-white' : 'text-black'}`}
                  onClick={() => {
                    if (studentStatus === 'absent') {
                      setStudentStatus('');
                      handleClear()
                    }
                    else {
                      setStudentStatus('absent');
                      setMarks({
                        ...marks,
                        ...Object.fromEntries(questions.map(q => [q, 0]))
                      });
                    }
                  }}
                >
                  Absent
                </button>

                <button
                  tabIndex={2}
                  className={`transition-all duration-300 bg-[#F8FCFF] shadow-sm border h-10 w-[6.5rem] font-medium rounded-md  px-2 ${studentStatus === 'notOnrole' ? 'bg-[#4f72cc] text-white' : 'text-black'}`}
                  onClick={() => {
                    if (studentStatus === 'notOnrole') {
                      setStudentStatus('');

                    }
                    else {
                      setStudentStatus('notOnrole');
                      handleClear()
                    }
                  }}
                >
                  Not on Roll
                </button>

              </div>
            </div>

          </div>

          <div className="w-full flex  relative justify-center grow  p-3 border-b ">
            {examType === 'ASG1' || examType === 'ASG2' ?
              (<div className="flex items-center space-x-2 ">
                <h1 className="text-[#676060] font-semibold">{examType === 'ASG1' ? 'OC1' : 'OC2'} :</h1>

                <input
                  type="text"
                  placeholder="0"
                  value={Assignment}
                  onChange={handleAssignment}
                  maxLength={1}
                  required
                  className="bg-[#F8FCFF] shadow-sm border border-black   h-10 w-[10rem] xl:w-[10rem] rounded px-2  placeholder-gray-400 placeholder:text-gray-400   text-black  placeholder-opacity-0 transition duration-200"
                />
              </div>) :
              (
                <div className=" flex space-x-5">

                  <div className=" space-x-2 flex items-center">
                    <h1 className="text-[#df6363] font-semibold">LOT :</h1>
                    <input
                      type="text"
                      placeholder="0"
                      value={marks['LOT']}
                      onChange={(e) => handleMarkChange('LOT', e.target.value)}
                      className='bg-[#F8FCFF] shadow-sm border h-10 w-[7rem] border-black rounded px-2 text-black font-medium'
                    />
                  </div>

                  <div className=" space-x-2 flex items-center">
                    <h1 className="text-[#dfa563] font-semibold">MOT :</h1>
                    <input
                      type="text"
                      placeholder="0"
                      value={marks['MOT']}
                      onChange={(e) => handleMarkChange('MOT', e.target.value)}
                      className='bg-[#F8FCFF] shadow-sm border h-10 w-[7rem] border-black rounded px-2 text-black font-medium'
                    />
                  </div>

                  <div className=" space-x-2 flex items-center">
                    <h1 className="text-[#6bdf63] font-semibold">HOT :</h1>
                    <input
                      type="text"
                      placeholder="0"
                      value={marks['HOT']}
                      onChange={(e) => handleMarkChange('HOT', e.target.value)}
                      className='bg-[#F8FCFF] shadow-sm border h-10 w-[7rem] border-black rounded px-2 text-black font-medium'
                    />
                  </div>
                </div>
              )
            }
            {studentStatus !== '' &&
              <div className=" bg-slate-500 transition-all duration-300 opacity-25 cursor-not-allowed absolute  w-full h-full top-0"></div>
            }
          </div>

          <div className=" flex justify-between items-center ">
            <div className=" space-x-2 flex">
              {editStudent !== -1
                && <div
                  onClick={handleOpen}
                  className=" bg-red-700 text-white p-2 rounded w-[5.67rem] flex justify-center items-center mr-4"
                >
                  Delete
                </div>
              }

              <div
                onClick={handleClear}
                className=" bg-black hover:bg-red-700 transition-all duration-300 cursor-pointer text-white p-2 rounded w-[5.67rem] flex justify-center items-center mr-4"
              >
                {editStudent === -1 ? 'Clear All' : 'Cancel'}
              </div>
            </div>




            {
              examType === 'ASG1' || examType === 'ASG2' ? <div></div> :
                <div className="flex space-x-2 items-center">

                  <div className=" h-10 px-4 bg-slate-800 flex items-center justify-center rounded-lg text-white" onClick={handleFillmark}> Fill marks</div>
                  <p>Total Marks: {totalMarks}</p>
                </div>
            }

            <button
              disabled={isLoading}
              onClick={handleSubmit}
              className="bg-[#4f72cc] hover:bg-blue-700 transition-all duration-300 text-white p-2 rounded w-[5.67rem] flex justify-center items-center"
            >
              {isLoading ? (
                <img
                  src={loading}
                  alt=""
                  className=" w-6 h-6 animate-spin text-white"
                />
              ) : (
                editStudent === -1 ? "Save" : "Update"
              )}
            </button>

          </div>

        </div>

        <ExistingStudent isLoading3={isLoading3} courseCode={courseCode} typeData={typeData} editStudent={editStudent} handleEditClick={handleEditClick} examType={examType} Sortby={SortBy} setSortby={setSortby} active={active} setActive={setActive} total={total} />

      </div>
      {open &&
        <div className=" fixed z-20 w-screen h-screen  top-0 right-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center">
          <div className=" w-[30%] h-[30%] rounded-lg bg-white shadow-2xl antialiased p-2 flex flex-col">
            <div className="w-full grow flex flex-col">

              <div className=" flex space-x-2 text-xl font-semibold items-center">
                <ion-icon name="alert-circle"></ion-icon>
                <p >Alert</p>
              </div>

              <div className=" w-full  grow flex justify-center items-center">
                Are you sure to delete mark of this {typeData[editStudent]?.regNo}
              </div>

            </div>
            <div className=" w-full space-x-2 flex justify-end font-medium ">
              <button className=" px-3 py-2 rounded-md hover:bg-red-700 text-red-700 hover:bg-opacity-10 transition-all duration-700" onClick={handleOpen}>Cancel</button>
              <button className=" px-2 py-2 rounded-md bg-[#4f72cc] text-white hover:shadow-lg hover:shadow-[#4f72cc] transition-all duration-700" onClick={handleDelete}>Confirm</button>
            </div>
          </div>
        </div>
      }

    </div>
  );
};

export default AddMarks;
