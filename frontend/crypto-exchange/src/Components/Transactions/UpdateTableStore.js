import { createStore } from "redux";

export const UPDATE_TABLE = "UPDATE_TABLE";

export const initUpdateTableState ={
    type: UPDATE_TABLE
};

export function updateTableReducer(state=initUpdateTableState){
    return state;
}

export const updateTableStore = createStore(updateTableReducer);