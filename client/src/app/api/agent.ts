import { store } from "app/store/configureStore";
import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";

const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use((config) => {
  config.headers = config.headers ?? {};
  const token = store.getState().user.userData?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  async (response) => {
    if (process.env.NODE_ENV === "development") await sleep();

    return response;
  },
  (error: AxiosError) => {
    const { data, status } = error.response as any;
    switch (status) {
      case 400:
        if (data.errors) {
          const modelStateErrors: string[] = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
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
          pathname: "/server-error",
          state: { error: data },
        });
        break;
      default:
        break;
    }
    return Promise.reject(error.response);
  }
);

const TestErrors = {
  get400Error: () => requests.get("error/bad-request"),
  get401Error: () => requests.get("error/unauthorized"),
  get404Error: () => requests.get("error/not-found"),
  get500Error: () => requests.get("error/server-error"),
  getValidationError: () => requests.get("error/validation-error"),
};

const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  patch: (url: string) => axios.patch(url).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
};

const UserData = {
  getSprints: (userId: string, boardId: string) =>
    requests.get(`userdata/${userId}/boards/${boardId}/sprints`),
  getSprint: (userId: string, boardId: string, sprintId: string) =>
    requests.get(`userdata/${userId}/boards/${boardId}/sprints/${sprintId}`),
  getUser: (userId: string, boardId: string) =>
    requests.get(`userdata/${userId}/boards/${boardId}`),
  titles: (userId: string, boardId: string) =>
    requests.get(`userdata/${userId}/boards/${boardId}/sprints/titles`),
  addTask: (userId: string, boardId: string, sprintId: string, body: {}) =>
    requests.post(
      `userdata/${userId}/boards/${boardId}/sprints/${sprintId}/addTask`,
      body
    ),
  removeTask: (
    userId: string,
    boardId: string,
    sprintId: string,
    taskId: string
  ) =>
    requests.delete(
      `userdata/${userId}/boards/${boardId}/sprints/${sprintId}/tasks/${taskId}/deleteTask`
    ),
  updateTask: (
    userId: string,
    boardId: string,
    sprintId: string,
    taskId: string,
    body: {}
  ) =>
    requests.put(
      `userdata/${userId}/boards/${boardId}/sprints/${sprintId}/tasks/${taskId}/updateTask`,
      body
    ),
  addSubtask: (
    userId: string,
    boardId: string,
    sprintId: string,
    taskId: string,
    body: {}
  ) =>
    requests.post(
      `userdata/${userId}/boards/${boardId}/sprints/${sprintId}/tasks/${taskId}/addSubtask`,
      body
    ),
  updateSubtask: (
    userId: string,
    boardId: string,
    sprintId: string,
    taskId: string,
    subtaskId: string,
    body: {}
  ) =>
    requests.put(
      `userdata/${userId}/boards/${boardId}/sprints/${sprintId}/tasks/${taskId}/subtasks/${subtaskId}/updateSubtask`,
      body
    ),
  removeSubtask: (
    userId: string,
    boardId: string,
    sprintId: string,
    taskId: string,
    subtaskId: string
  ) =>
    requests.delete(
      `userdata/${userId}/boards/${boardId}/sprints/${sprintId}/tasks/${taskId}/subtasks/${subtaskId}/deleteSubtask`
    ),
  addBoard: (userId: string, body: {}) =>
    requests.post(`userdata/${userId}/addBoard`, body),
  updateBoard: (userId: string, boardId: string, body: {}) =>
    requests.put(`userdata/${userId}/boards/${boardId}/updateBoard`, body),
  deleteBoard: (userId: string, boardId: string) =>
    requests.delete(`userdata/${userId}/boards/${boardId}/deleteBoard`),
  addTaskToMilestone: (
    userId: string,
    boardId: string,
    milestoneId: string,
    sprintId: string,
    taskId: string
  ) =>
    requests.patch(
      `userdata/${userId}/boards/${boardId}/milestones/${milestoneId}/sprints/${sprintId}/tasks/${taskId}/addTaskToMilestone`
    ),
  removeTaskFromMilestone: (
    userId: string,
    boardId: string,
    milestoneId: string,
    sprintId: string,
    taskId: string
  ) =>
    requests.delete(
      `userdata/${userId}/boards/${boardId}/milestones/${milestoneId}/sprints/${sprintId}/tasks/${taskId}/deleteTaskFromMilestone`
    ),
  changeTaskOrder: (
    userId: string,
    boardId: string,
    sprintId: string,
    taskId: string,
    newOrder: string
  ) =>
    requests.patch(
      `userdata/${userId}/boards/${boardId}/sprints/${sprintId}/tasks/${taskId}/changeTaskOrder/${newOrder}`
    ),
  changeTaskState: (
    userId: string,
    boardId: string,
    sprintId: string,
    taskId: string,
    newState: string,
    newOrder: string
  ) =>
    requests.patch(
      `userdata/${userId}/boards/${boardId}/sprints/${sprintId}/tasks/${taskId}/changeTaskState/${newState}/newOrder/${newOrder}`
    ),
  changeTaskSprint: (
    userId: string,
    boardId: string,
    sprintId: string,
    taskId: string,
    newSprintId: string
  ) =>
    requests.patch(
      `userdata/${userId}/boards/${boardId}/sprints/${sprintId}/tasks/${taskId}/changeTaskSprint/${newSprintId}`
    ),
  changeTaskFocused: (
    userId: string,
    boardId: string,
    sprintId: string,
    taskId: string
  ) =>
    requests.patch(
      `userdata/${userId}/boards/${boardId}/sprints/${sprintId}/tasks/${taskId}/changeTaskFocused`
    ),
  getRecentActivity: (userId: string) =>
    requests.get(`userdata/${userId}/getRecentActivity`),
};

const Account = {
  login: (values: any) => requests.post("account/login", values),
  register: (values: any) => requests.post("account/register", values),
  currentUser: () => requests.get("account/currentUser"),
  updateUser: (body: {}) => requests.put(`account/updateUser`, body),
};

const agent = {
  UserData,
  TestErrors,
  Account,
};

export default agent;
