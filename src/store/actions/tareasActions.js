import { TAREAS_REQUEST, TAREAS_SUCCESS, TAREAS_FAILURE } from "../types";

export const tareasRequest = () => ({
  type: TAREAS_REQUEST,
});
export const tareasSuccess = (data) => ({
  type: TAREAS_SUCCESS,
  payload: data,
});
export const tareasFailure = (error) => ({
  type: TAREAS_FAILURE,
  payload: error,
});

export const getTareas = (path) => (dispatch) => {
  dispatch(tareasRequest());
  fetch(`${process.env.REACT_APP_SERVER_IP}/${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      dispatch(tareasSuccess(data.result));
    })
    .catch((error) => {
      dispatch(tareasFailure(error));
    });
};
export const borrarTarea = (id) => (dispatch) => {
  dispatch(tareasRequest());
  fetch(`${process.env.REACT_APP_SERVER_IP}/task/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status_code === 200) {
        dispatch(getTareas("task"));
      }
    })
    .catch((error) => {
      dispatch(tareasFailure(error));
    });
};

export const editarTarea = (id, task) => (dispatch) => {
  dispatch(tareasRequest());
  fetch(`${process.env.REACT_APP_SERVER_IP}/task/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ task }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status_code === 200) {
        dispatch(getTareas("task"));
      }
    })
    .catch((error) => {
      dispatch(tareasFailure(error));
    });
};
export const crearTarea = (path, task) => (dispatch) => {
  dispatch(tareasRequest());
  fetch(`${process.env.REACT_APP_SERVER_IP}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ task }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status_code === 200) {
        dispatch(getTareas("task"));
      }
    })
    .catch((error) => {
      dispatch(tareasFailure(error));
    });
};
