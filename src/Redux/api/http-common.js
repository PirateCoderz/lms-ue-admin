import axios from "axios";

// const API_URL = "http://192.168.1.9:8080";
const API_URL = "http://localhost:5000";

export const callAPi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-type": "application/json"
  }
})

const token = localStorage.getItem("access_token")

// eslint-disable-next-line consistent-return
const getHeaders = () => {
  if (token !== undefined) {
    return {
      "Content-type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
    };
  } 
};
export const callPrivateAPi = axios.create({
  baseURL: API_URL,
  headers: getHeaders()
})




