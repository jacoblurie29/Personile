import axios, { AxiosRequestHeaders, AxiosResponse } from "axios";
import { request } from "http";

axios.defaults.baseURL = 'http://localhost:5000/api/'

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
}

// Futute: edit the tasks to have a sprint id
const Sprint = {
    getSprint: (id: string) => requests.get(`sprint/${id}`),
    titles: () => requests.get('sprint/titles')
}

const agent = {
    Sprint
}

export default agent;