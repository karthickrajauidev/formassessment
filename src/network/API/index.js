import axios from "axios";
import { baseURL } from "./apiPath";

export const axiosInstance = axios.create({
    baseURL:baseURL
});

