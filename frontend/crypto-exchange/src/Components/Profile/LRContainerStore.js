import { createStore } from "redux";

export const SHOW = "SHOW";
export const HIDE = "HIDE";

export const initLRContainerState = {
    type: SHOW,
    show: true
};

export function lrContainerReducer(state=initLRContainerState, action){
    if(action.type == SHOW){
        return {
            type: action.type,
            show: true
        };
    }
    else {
        return {
            type: action.type,
            show: false
        };
    }
}

export const lrContainerShowStore = createStore(lrContainerReducer)