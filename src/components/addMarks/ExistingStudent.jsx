import React from 'react'
import loading from "../../assets/loading.svg";
import studentMarksImg from "../../assets/studentMark.png";
import { Pagination } from './pagiNation';
import { setActive } from '@material-tailwind/react/components/Tabs/TabsContext';

function ExistingStudent({ isLoading3, courseCode, typeData, editStudent, handleEditClick, examType, setSortby, Sortby, active, setActive, total }) {
    return (
        <div className="bg-white p-2 flex flex-col rounded h-full w-[28%] ">
            <div className=" h-10 border-b  flex justify-between py-5 items-center font-semibold">
                <p>Entered Marks</p>
                <div onClick={() => setSortby(!Sortby)} className=' h-8 w-fit text-[#4f72cc] rounded-md flex justify-center items-center px-3 cursor-pointer'>
                    <p className=' font-medium text-sm '>{Sortby ? 'Asc' : 'Desc'}</p>
                    <ion-icon name={Sortby ? 'arrow-down-outline' : 'arrow-up-outline'}></ion-icon>
                </div>
            </div>

            <div className=" w-full grow flex flex-col justify-center items-center">
                {isLoading3 ? <img src={loading} alt="" className=" w-10 h-10 animate-spin" /> :
                    (
                        courseCode === '' ?
                            (
                                <div className="h-full w-full flex flex-col items-center justify-center text-base font-semibold">
                                    <div className="w-fit h-fit relative">
                                        <img src={studentMarksImg} alt="" className=" w-[20rem] " />
                                        <div className=" absolute bottom-[9rem] text-center">
                                            <p>Enter Department and Course code to get</p>
                                            <p>Existing Students Marks</p>
                                        </div>
                                    </div>
                                </div>
                            )
                            :
                            (
                                typeData?.length !== 0 ?
                                    (
                                        <div className=" w-full h-full flex flex-col">
                                            <div className=' w-full grow'>
                                                <div className=" h-10 m-2  grid grid-cols-2 px-2 items-center text-center font-medium  rounded-md bg-slate-200   shadow-md border">
                                                    <p>Register No</p>
                                                    <p>staff's Name</p>
                                                </div>
                                                <div className=" w-full grow">
                                                    {typeData?.map((item, index) =>
                                                        <div key={index} className={` h-10 mx-2  grid grid-cols-2 px-2 items-center text-center border-b font-medium hover:border-blue-700 hover:text-blue-600 cursor-pointer ${editStudent === index ? 'font-semibold text-[#4f72cc] border-[#4f72cc]' : (item?.marks[0][examType + 'STATUS'] === 'absent' && 'text-red-600')}`} onClick={() => handleEditClick(index)}>
                                                            <p>{item?.regNo}</p>
                                                            <p className='  w-full h-7 truncate flex items-center justify-center'>{item?.marks[0][examType + 'STAFF']}</p>
                                                        </div>
                                                    )
                                                    }
                                                </div>

                                            </div>

                                            <div className=' w-full flex justify-center items-center'>

                                                <Pagination active={active} setActive={setActive} total={total} />
                                            </div>
                                        </div>
                                    )
                                    :
                                    (
                                        <div className="h-full w-full flex flex-col items-center justify-center text-base font-semibold">
                                            <div className="w-fit h-fit relative">
                                                <img src={studentMarksImg} alt="" className=" w-[20rem] " />
                                                <div className=" absolute bottom-[9rem] text-center w-full">
                                                    <p>There are no existing students.</p>
                                                </div>
                                            </div>
                                        </div>
                                    )

                            )
                    )
                }
            </div>

        </div>
    )
}

export default ExistingStudent
