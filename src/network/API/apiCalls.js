import { axiosInstance } from "."

export const axiosGetCall = async (endpoint, setLoaderState) => {
    let responseData = null;
    const isLoaderAvailable = setLoaderState && typeof setLoaderState === "function"
    isLoaderAvailable && setLoaderState(true)
    try {
        const response = await axiosInstance.get(endpoint)
        responseData = response.data;
    } catch (error) {
        console.log(error);
        if (error) throw error;
    } finally {
        isLoaderAvailable && setLoaderState(false)
    }
    return responseData
}



export const axiosPostsCall = async (endpoint, payload, setLoaderState) => {
    let responseData = null;
    const isLoaderAvailable = setLoaderState && typeof setLoaderState === "function"
    isLoaderAvailable && setLoaderState(true)
    try {
        const response = await axiosInstance.post(endpoint, payload)
        responseData = response.data;
    } catch (error) {
        console.log(error);
        if (error) throw error;
    } finally {
        isLoaderAvailable && setLoaderState(false)
    }
    return responseData
}


