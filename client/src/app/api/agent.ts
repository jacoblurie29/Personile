import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";
import { Task } from "../models/task";

const sleep = () => new Promise(resolve => setTimeout(resolve, 500));

axios.defaults.baseURL = 'http://localhost:5000/api/'

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.response.use(async response => {
    await sleep();
    return response
}, (error: AxiosError) => {
    const {data, status} = error.response as any;
    switch (status) {
        case 400:
            if (data.errors) {
                const modelStateErrors: string[] = [];
                for(const key in data.errors) {
                    if(data.errors[key]) {
                        modelStateErrors.push(data.errors[key]);
                    }
                }
                throw modelStateErrors.flat();
            }
            toast.error(data.title);
            break;
        case 401:
            toast.error(data.title);
            break;
        case 500:
            history.push({
                pathname: '/server-error',
                state: {error: data}
            });
            break;     
        default:
            break;
    }
    return Promise.reject(error.response)
})

const TestErrors = {
    get400Error: () => requests.get('error/bad-request'),
    get401Error: () => requests.get('error/unauthorized'),
    get404Error: () => requests.get('error/not-found'),
    get500Error: () => requests.get('error/server-error'),
    getValidationError: () => requests.get('error/validation-error'),
}

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
}

// Futute: edit the tasks to have a sprint id
const UserData = {
    getSprints: (userId: string) => requests.get(`userdata/${userId}/sprints`),
    getSprint: (userId: string, sprintId: string) => requests.get(`userdata/${userId}/sprints/${sprintId}`),
    getUser: (userId: string) => requests.get(`userdata/${userId}`),
    titles: (userId: string) => requests.get(`userdata/${userId}/sprints/titles`),
    addTask: (userId: string, sprintId: string, body: {}) => requests.post(`userdata/${userId}/sprints/${sprintId}/addTask`, body),
    removeTask: (userId: string, sprintId: string, taskId: string) => requests.delete(`userdata/${userId}/sprints/${sprintId}/tasks/${taskId}/deleteTask`),
    updateTaskState: (userId: string, sprintId: string, taskId: string, body: {}) => requests.put(`userdata/${userId}/sprints/${sprintId}/tasks/${taskId}/updateTask`, body)
}

const agent = {
    UserData,
    TestErrors
}

export default agent;