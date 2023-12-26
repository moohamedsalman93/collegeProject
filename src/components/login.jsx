import React, { useState } from 'react'
import illustrate from '../assets/illustrate.svg'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { loginApi } from '../api/api';
import loading from "../assets/loading.svg";
import logo from "../assets/Logo.png";

function LoginPage() {
    const Navigate = useNavigate();
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [emailerr, setEmailerr] = useState(false);
    const [passworderr, setPassworderr] = useState(false);
    const [isLoading, setIsloading] = useState(false);
    const [isShow, setIsShow] = useState(false)


    const handleSumbit = () => {
        setEmailerr(false)
        setPassworderr(false)

        if (!email) {
            setEmailerr(true)
            return
        }
        if (!password) {
            setPassworderr(true)
            return
        }

        loginApi('staff/login', { email: email, password: password }, setIsloading).then((res) => {
            if (res) {
                console.log(res)

                if (res.status === 200) {
                    toast.success('login success')
                    localStorage.setItem('token', res.data.success.data.token)
                    Navigate('/')
                } else {
                    toast.error('Wrong credentials please check')
                }
            }
        })


    }


    return (
        <div className=" w-screen h-screen flex flex-col space-x-4  overflow-hidden justify-center items-center p-10 bg-gradient-to-br from-[#4f72cc] to-[#58caea]">
            <div className=" w-full grow bg-white rounded-lg flex">
                <div className=' w-2/5 h-full flex flex-col justify-center items-start mx-10'>
                    <div className='  space-y-4'>
                        <img src={logo} alt="" className=' h-[80px]' />
                        <div>
                            <p className=' text-3xl font-semibold'>Jamal Mohamed College's</p>
                            <p className=' text-xl text-neutral-500 font-medium'>OBE Calculation Software</p>

                        </div>

                    </div>

                    {/* <p className=' text-3xl text-neutral-500 font-medium'>Hello! Welcome</p> */}

                    <div className='w-[25rem] ml-6 space-y-5 mt-10 h-fit flex flex-col items-center border-2 py-6 rounded-lg'>
                        <input
                            className={`bg-[#e8f0fe] text-black h-11 w-[20rem] rounded px-3  placeholder-neutral-500 placeholder:font-medium border-b-2 border-white focus:border-[#4f72cc] outline-none ${emailerr && ' border-red-600 placeholder:text-red-600'}`}
                            type='text'
                            name={'username'}
                            placeholder={"Enter your ID"}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            maxLength={30}
                        />


                        <div className=' relative h-fit w-fit flex items-center'>
                            <input
                                className={`bg-[#e8f0fe] text-black h-11 w-[20rem] rounded px-3  placeholder-neutral-500 placeholder:font-medium border-b-2 border-white focus:border-[#4f72cc] outline-none ${passworderr && ' border-red-600 placeholder:text-red-600'}`}
                                type={isShow ? 'text' : 'password'}
                                name={'password'}
                                placeholder={"Enter your password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                maxLength={30}
                            />
                            <div onClick={() => setIsShow(!isShow)} className=' cursor-pointer absolute items-center text-xl right-5'>
                                <ion-icon name={isShow?"eye":"eye-off"}></ion-icon>
                            </div>
                        </div>

                        <button disabled={isLoading} onClick={handleSumbit} className=' h-11 w-[20rem] flex justify-center items-center bg-[#4f72cc] rounded-lg text-lg font-medium text-white hover:scale-[0.95] transition'>{isLoading ? <img src={loading} alt="" className=' w-8 text-zinc-50' /> : 'Log In'}</button>

                    </div>
                </div>
                <div className=' w-3/5 h-full flex items-center justify-center '>
                    <img src={illustrate} alt=""  className=' scale-[1.5]'/>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
