import { TAREAS_REQUEST, TAREAS_SUCCESS, TAREAS_FAILURE } from "../types";

const initialState = {
  loading: false,
  tareas: [],
  error: "",
};

export const tareasReducer = (state = initialState, action) => {
  switch (action.type) {
    case TAREAS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case TAREAS_SUCCESS:
      return {
        loading: false,
        error: "",
        tareas: action.payload
      };
    case TAREAS_FAILURE:
      return {
        loading: false,
        error: action.payload,
        tareas: []
      };
    default:
      return state;
  }
};
