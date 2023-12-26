import axios from "axios";
import { toast } from "react-hot-toast";

const api = process.env.REACT_APP_API_URL;

export const searchData = async (path, setData, setisLoading) => {
  console.log(api)
  setisLoading(true);
  try {
    const res = await axios.get(api + path);
    setData(res.data.data);
    setisLoading(false);
  } catch (err) {
    setData([]);
    setisLoading(false);
  }
};

export const getApi = async (path, setData, setisLoading) => {
  console.log(api)
  setisLoading(true);
  try {
    const res = await axios.get(api + path);
    setData(res.data.data);
    setisLoading(false);
  } catch (err) {
    setData([]);
    setisLoading(false);
  }
};

export const getCourseApi = async (path, setData, setTotal, setisLoading) => {
  console.log(api)
  setisLoading(true);
  try {
    const res = await axios.get(api + path);
    setData(res.data.data);
    setTotal(res.data.totalPages)
    setisLoading(false);
  } catch (err) {
    setData([]);
    setisLoading(false);
  }
};

export const getStaffCourse = async (path, setData, setisLoading) => {
  console.log(api)
  setisLoading(true);
  try {
    const res = await axios.get(api + path);
    setData(res.data.codeInfo);
    setisLoading(false);
  } catch (err) {
    setData([]);
    setisLoading(false);
  }
};

export const putApi = async (path, setData, data, setisLoading) => {
 
  setisLoading(true);
  try {
    const res = await axios.put(api + path, data);
    setData(res.data);
    setisLoading(false);
    return res
  } catch (err) {
    console.log(err)
    console.log(err.response.data.error)
    toast.error(err.response.data.error)
    setData([]);
    setisLoading(false);
  }
};

export const putApi2 = async (path, setData, data, setisLoading) => {
  setisLoading(true);
  try {
    const res = await axios.put(api + path, data);
    setData(res.data.student);
    console.log(res.data.student)
    setisLoading(false);
    return res
  } catch (err) {
    console.log(err)
    console.log(err.response.data.error)
    toast.error(err.response.data.error)
    setData([]);
    setisLoading(false);
  }
};


export const getDepOut = async (path, setData, data, setisLoading) => {
  console.log(api)
  setisLoading(true);
  try {
    const res = await axios.put(api + path, data);
    setData(res.data.returnData);
    setisLoading(false);
    return res
  } catch (err) {
    setData([]);
    setisLoading(false);
  }
};

export const getCatagoryOut = async (path, setData, data, setisLoading) => {
  console.log(api)
  setisLoading(true);
  try {
    const res = await axios.put(api + path, data);
    setData(res.data.returnDepData);
    setisLoading(false);
    return res
  } catch (err) {
    setData([]);
    setisLoading(false);
  }
};

export const getRegMarksApi = async (path, setData, data, setisLoading) => {
  console.log(api)
  setisLoading(true);
  try {
    const res = await axios.put(api + path, data);
    if (res.data.msg) {
      setData({});
    }
    else {

      setData(res.data.marks[0]);
    }

    setisLoading(false);
    return res
  } catch (err) {
    setData({});
    setisLoading(false);
  }
};

export const loginApi = async (path, data, setisLoading) => {
  setisLoading(true);
  try {
    const res = await axios.post(api + path, data);
    setisLoading(false);
    return res
  } catch (err) {
    console.log(err)
    toast.error(err.response.data.warning.message)
    setisLoading(false);
  }
};

export const passChangeApi = async (path, setisLoading) => {
  setisLoading(true);
  try {
    const res = await axios.get(api + path);
    setisLoading(false);
    return res
  } catch (err) {
    console.log(err)
    toast.error(err.response.data.warning.message)
    setisLoading(false);
  }
};

export const DeleteApi = async (path, data, setisLoading) => {
  setisLoading(true);
  console.log(data)
  try {
    const res = await axios.put(api + path, data);
    setisLoading(false);
    return res
  } catch (err) {
    console.log(err)
    toast.error(err.message)
    setisLoading(false);
  }
};


export const AddNewCourse = async (data, setisLoading) => {
  setisLoading(true);
  try {
    const res = await axios.post(api + 'staff/AddNewCourse', data);
    setisLoading(false);
    return res
  } catch (err) {
    console.log(err)
    toast.error(err.message)
    setisLoading(false);
  }
}

export const deleteCourse = async (id, setisLoading) => {
  setisLoading(true);
  try {
    const res = await axios.delete(api + 'staff/deleteCourse?id=' + id);
    setisLoading(false);
    return res
  } catch (err) {
    console.log(err)
    toast.error(err.message)
    setisLoading(false);
  }
}
