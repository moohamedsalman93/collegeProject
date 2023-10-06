import React, { useEffect, useRef, useState } from "react";
import "../../App.css";
import loading from "../../assets/loading.svg";
import axios from "axios";
import toast from "react-hot-toast";
import { getApi, searchData } from "../../api/api";
import { debounce } from 'lodash';
import { useNavigate } from "react-router-dom";
import ObComponents from "./obComponents";
import ExistingStudent from "./ExistingStudent";


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
  const [studentStatus, setStudentStatus] = useState('');
  const [totalMarks, setTotalMarks] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isLoading3, setIsLoading3] = useState(false);
  const [existingData, setExistingData] = useState([]);
  const [marks, setMarks] = useState({});
  const [typeData, setTypeData] = useState([]);
  const [editStudent, setEditstudent] = useState(-1);

  const questions = [
    "Q1",
    "Q2",
    "Q3",
    "Q4",
    "Q5",
    "Q6",
    "Q7",
    "Q8",
    "Q9",
    "Q10",
    "Q11",
    "Q12",
    "Q13",
    "Q14",
    "Q15",
    "Q16",
    "Q17",
    "Q18",
    "Q19",
    "Q20",
    "Q21",
    "Q22",
    "Q23",
    "Q24",
    "Q25",
    "Q26",
    "Q27",
    "Q28",
  ];
  const [value, setValue] = useState("");

  const numRows = Math.ceil(questions.length / 4);
  //#endregion

  //#region max mark:
  const markLimits = {
    Q1: { min: 0, max: 1 },
    Q2: { min: 0, max: 1 },
    Q3: { min: 0, max: 1 },
    Q4: { min: 0, max: 1 },
    Q5: { min: 0, max: 1 },
    Q6: { min: 0, max: 1 },
    Q7: { min: 0, max: 1 },
    Q8: { min: 0, max: 1 },
    Q9: { min: 0, max: 1 },
    Q10: { min: 0, max: 1 },
    Q11: { min: 0, max: 1 },
    Q12: { min: 0, max: 1 },
    Q13: { min: 0, max: 1 },
    Q14: { min: 0, max: 1 },
    Q15: { min: 0, max: 1 },
    Q16: { min: 0, max: 2 },
    Q17: { min: 0, max: 2 },
    Q18: { min: 0, max: 2 },
    Q19: { min: 0, max: 2 },
    Q20: { min: 0, max: 2 },
    Q21: { min: 0, max: 4 },
    Q22: { min: 0, max: 4 },
    Q23: { min: 0, max: 4 },
    Q24: { min: 0, max: 4 },
    Q25: { min: 0, max: 4 },
    Q26: { min: 0, max: 10 },
    Q27: { min: 0, max: 10 },
    Q28: { min: 0, max: 10 },
  };

  //#endregion

  //#region  Create an array of arrays
  const questionRows = [];
  for (let i = 0; i < numRows; i++) {
    questionRows.push(questions.slice(i * 5, (i + 1) * 5));
  }
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
  };
  //#endregion

  //#region  HandleSubmit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (examType === 'C1' || examType === 'C2' || examType === 'ESE') {
      for (const question of questions) {
        if (!marks[question]) {
          toast.error("Please fill marks in all box", { duration: 1500 });
          return;
        }
      }
    }

    if (!deparment || !courseCode || !regNo || !section || !staffIntial) {
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
        section: section,
        status: statusStudent,
        [sStatus]: statusStudent,
        [StaffIn]: staffIntial,
        exam: examType,
        ...marksAsNumbers,
      };

      const newDataforAss = {
        regNo: regNo,
        department: deparment,
        code: courseCode,
        claass: deparment,
        section: section,
        status: statusStudent,
        exam: "ASG",
        [typeDe]: parseInt(Assignment, 10),
      };

      var newData = newDataforMark

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
            console.log(res);
            if (res.status === 200) {
              setIsLoading(false);
              setMarks({});
              setRegNo('')
              toast.success("Mark saved successfully", { duration: 1500 });
              getApi(`staff/getMarkByCode?code=${courseCode}&department=${deparment}`, setExistingData, setIsLoading3)
              const last3Digits = parseInt(regNo, 10);
              const newLast3Digits = (last3Digits + 1).toString().padStart(3, "0");

              // Update the state with the new value
              setRegNo(newLast3Digits);
            } else {
              setIsLoading(false);
            }
          });
      } catch (err) {
        setIsLoading(false);
      }
    };

    addData();
  };
  //#endregion

  //#region  handleSumbitAssignment
  const handleSumbitAssignment = (e) => {
    e.preventDefault();

    const addData = async () => {
      setIsLoading(true);

      // const newData = new FormData();
      // newData.append('reg', regNo);
      // newData.append('exam', 'ASG');
      // newData.append('code', courseCode)
      // newData.append(examType === 'CIA 1' ? 'Q1' : 'Q2', value);

      const AssignType = examType === "ASS1" ? "ASG1" : "ASG2";

      const newData = {
        reg: regNo,
        code: courseCode,
        exam: "ASG",
        [AssignType]: parseInt(value),
      };

      try {
        await axios
          .post("http://localhost:3005/user//cia", newData)
          .then((res) => {
            console.log(res);
            if (res.status === 201) {
              setIsLoading(false);
              alert("success");
            } else {
              setIsLoading(false);
            }
          });
      } catch (err) {
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
    getApi(`staff/searchCode?question=${item.departmentCode}`, setCourseData, setIsLoading2)
  };
  //#endregion

  //#region search
  const handleDepSearch = debounce(async (val) => {
    console.log('searching..')
    searchData('staff/searchDepartment/?question=' + val, setSearchValue, setIsLoading2)
  }, 500);
  //#endregion

  //#region drop
  const handleDropdownToggle2 = () => {
    setIsOpen2(!isOpen2);
  };
  //#endregion

  //#region departmentOnChange
  const departmentOnChange = event => {
    setdepartment(event.target.value);
    handleDepSearch(event.target.value);
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
    getApi(`staff/getMarkByCode?code=${e.target.value}&department=${deparment}`, setExistingData, setIsLoading3)
  }
  //#endregion

  //#region typeStudent
  useEffect(() => {
    setIsLoading3(true)
    if (courseCode && deparment) {
      const sData = existingData?.filter((item) => item.marks[0][examType + 'STAFF'] !== null);
      setTypeData(sData)
    }
    setIsLoading3(false)
  }, [existingData, examType])
  //#endregion

  //#region examType onChange useffect for trigger api
  // useEffect(() => {

  //   if (courseCode && deparment) {
  //     getApi(`staff/getMarkByCode?code=${courseCode}&department=${deparment}`, setExistingData, setIsLoading3)
  //   }
  // }, [examType])
  //#endregion

  //#region handleEditClick
  const handleEditClick = (index) => {
    let temp = {}
    setEditstudent(index)
    setSection(typeData[index].section)
    setStaffIntial(typeData[index].marks[0][examType + 'STAFF'])
    setRegNo(typeData[index].regNo.slice(-3))
    for (let m in questions) {
      temp[questions[m]] = typeData[index].marks[0][examType + questions[m]]
    }
    setMarks(temp)
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

  return (
    <div className=" w-screen h-screen  flex items-center p-6  bg-gradient-to-r from-blue-500 to-green-500">

      <div className="flex flex-row w-full h-full gap-3 justify-between">
        <div className="flex flex-col  space-y-4 bg-white p-2 rounded-lg w-3/4">
          <div onClick={() => Navigate("/home")} className=" cursor-pointer w-fit px-3 py-2 border-2 border-blue-700  :bg-blue-700 hover:text-white hover:scale-110 transition rounded-xl flex items-center space-x-2">
            <ion-icon name="home"></ion-icon>
            <p className=" text-base">Home</p>
          </div>

          <div className="flex flex-col justify-center  items-center border-b ">

            <div className="flex items-end justify-between w-full h-fit px-5">

              <div className=" space-y-2">
                <h1 className="text-base font-normal text-[#676060]">
                  OB components :
                </h1>
                <div className=" flex space-x-4 items-end ">
                  <ObComponents examType={examType} handleSetExamtype={handleSetExamtype} value={'C1'} textlabel={'CIA-1'} />
                  <ObComponents examType={examType} handleSetExamtype={handleSetExamtype} value={'C2'} textlabel={'CIA-2'} />
                  <ObComponents examType={examType} handleSetExamtype={handleSetExamtype} value={'ESE'} textlabel={'ESE'} />
                  <ObComponents examType={examType} handleSetExamtype={handleSetExamtype} value={'ASG1'} textlabel={'ASS-1'} />
                  <ObComponents examType={examType} handleSetExamtype={handleSetExamtype} value={'ASG2'} textlabel={'ASS-2'} />
                </div>
              </div>

              <div className=" space-x-2 items-center flex">
                <h1 className="text-[#676060]">Staff's Initial :</h1>

                <input
                  type="text"
                  placeholder="Name Or Intial"
                  value={staffIntial}
                  onChange={(event) => setStaffIntial(event.target.value)}
                  maxLength={3}
                  required
                  className="bg-[#F8FCFF] shadow-sm border   h-10 w-[10rem] xl:w-[10rem] rounded px-2  placeholder-gray-400 placeholder:text-gray-400   text-black  placeholder-opacity-0 transition duration-200"
                />

              </div>

            </div>

            <div className=" w-full h-fit relative grid gap-3 grid-cols-6 p-4 rounded-md border-1 border-black">

              <div className='w-[9rem] space-y-2 xl:w-[9rem] ' ref={dropdownRef2}>
                <h1 className="text-[#676060]">Department :</h1>
                <input
                  type="text"
                  value={deparment}
                  // onBlur={() => !optionSelected && setdepartment('')} // Modify this line
                  onChange={departmentOnChange}
                  onFocus={handleDropdownToggle2}
                  placeholder="Eg: MCA"
                  className='bg-[#F8FCFF] shadow-sm border h-10 w-[9rem] xl:w-[9rem] rounded px-2 text-black'
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
                  <option value=''>
                    Select Code
                  </option>

                  {CourseData.map((course) => (
                    <option key={course.id} value={course.code}>
                      {course.code}
                    </option>
                  ))}
                </select>
              </div>

              <div className=" space-y-2">
                <h1 className="text-[#676060]">Register No:</h1>
                <div className=" flex relative items-center">
                  <h1 className=" absolute left-1 font-medium">23{deparment !== '' ? deparment : 'MCA'}</h1>
                  <input
                    type="tel"
                    placeholder="XXX"
                    value={regNo}
                    onChange={(event) => setRegNo(event.target.value)}
                    maxLength={3}
                    max={3}

                    required
                    className="bg-[#F8FCFF] shadow-sm border pl-[3.5rem]   h-10 w-[9rem] xl:w-[9rem] rounded px-2  placeholder-gray-400 placeholder:text-gray-400   text-black  placeholder-opacity-0 transition duration-200"
                  />

                </div>

              </div>

              <div className=" space-y-2">
                <h1 className="text-[#676060]">Section :</h1>

                <input
                  type="text"
                  placeholder="Eg: A"
                  value={section}
                  onChange={(event) => setSection(event.target.value)}
                  maxLength={1}
                  required
                  className="bg-[#F8FCFF] shadow-sm border   h-10 w-[9rem] xl:w-[9rem] rounded px-2  placeholder-gray-400 placeholder:text-gray-400   text-black  placeholder-opacity-0 transition duration-200"
                />

              </div>

              <div className=" bg-slate-200 py-2 col-span-2 space-x-2 flex items-center shadow-md border justify-center rounded-md  px-3 w-fit">

                <h1 className="">Status :</h1>

                <button
                  className={`bg-[#F8FCFF] shadow-sm border h-10 w-fit rounded-md px-2 ${studentStatus === 'absent' ? 'bg-blue-500 text-white' : 'text-black'}`}
                  onClick={() => {
                    if (studentStatus === 'absent') {
                      setStudentStatus('');
                    }
                    else {
                      setStudentStatus('absent');
                    }
                  }}
                >
                  Absent
                </button>

                <button
                  className={`bg-[#F8FCFF] shadow-sm border h-10 w-[6.5rem] rounded-md  px-2 ${studentStatus === 'notOnrole' ? 'bg-blue-500 text-white' : 'text-black'}`}
                  onClick={() => {
                    if (studentStatus === 'notOnrole') {
                      setStudentStatus('');
                    }
                    else {
                      setStudentStatus('notOnrole');
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
                <h1 className="text-[#676060]">Assignment :</h1>

                <input
                  type="text"
                  placeholder="0"
                  value={Assignment}
                  onChange={handleAssignment}
                  maxLength={1}
                  required
                  className="bg-[#F8FCFF] shadow-sm border   h-10 w-[10rem] xl:w-[10rem] rounded px-2  placeholder-gray-400 placeholder:text-gray-400   text-black  placeholder-opacity-0 transition duration-200"
                />
              </div>) :
              (
                <table className="border-collapse border">
                  <thead>
                    <tr className="bg-gray-200 text-center">
                      <th className="border p-2">Question</th>
                      <th className="border p-2">Marks</th>
                      <th className="border p-2">Question</th>
                      <th className="border p-2">Marks</th>
                      <th className="border p-2">Question</th>
                      <th className="border p-2">Marks</th>
                      <th className="border p-2">Question</th>
                      <th className="border p-2">Marks</th>
                      <th className="border p-2">Question</th>
                      <th className="border p-2">Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questionRows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((question, columnIndex) => (
                          <React.Fragment key={question}>
                            <td className="border p-2 text-center">{question}</td>
                            <td className="border p-2">
                              <input
                                id={question}
                                type="number"
                                value={marks[question] || ""}
                                onChange={(e) =>
                                  handleMarkChange(question, e.target.value)
                                }
                                className={`w-[4rem] pl-2 text-center border transition duration-300 ease-in-out focus:outline-none ${marks[question] &&
                                  (parseInt(marks[question], 10) >
                                    markLimits[question].max ||
                                    parseInt(marks[question], 10) <
                                    markLimits[question].min)
                                  ? "border-red-500 border-4"
                                  : ""
                                  }`}
                              />
                            </td>
                          </React.Fragment>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            }
            {studentStatus !== '' &&
              <div className=" bg-slate-500 opacity-25 cursor-not-allowed absolute  w-full h-full top-0"></div>
            }
          </div>

          <div className=" flex justify-between items-center ">
            {
              examType === 'ASG1' || examType === 'ASG2' ? <div></div> :
                <div className="flex space-x-2 items-center">
                  <div className=" h-10 px-4 bg-slate-800 flex items-center justify-center rounded-lg text-white" onClick={handleFillmark}> Fill marks</div>
                  <p>Total Marks: {totalMarks}</p>
                </div>
            }

            <div className=" flex space-x-2">
              <button
                onClick={handleClear}
                className=" bg-slate-400 hover:bg-red-700 text-white p-2 rounded w-[5.67rem] flex justify-center items-center mr-4"
              >
                {editStudent === -1 ? 'Clear All' : 'Cancel'}
              </button>
              <button
                disabled={isLoading}
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded w-[5.67rem] flex justify-center items-center"
              >
                {isLoading ? (
                  <img
                    src={loading}
                    alt=""
                    className=" w-6 h-6 animate-spin text-white"
                  />
                ) : (
                  editStudent === -1 ? "Save" : "Edit"
                )}
              </button>
            </div>
          </div>

        </div>

        <ExistingStudent isLoading3={isLoading3} courseCode={courseCode} typeData={typeData} editStudent={editStudent} handleEditClick={handleEditClick} examType={examType} />

      </div>

    </div>
  );
};

export default AddMarks;