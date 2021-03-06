import { createStore } from "redux";

export const SHOW_NONE = "SHOW_NONE";
export const SHOW_LOGIN = "SHOW_LOGIN";
export const SHOW_REGISTER = "SHOW_REGISTER";

export const initLoginShowState = {
    type: SHOW_NONE,
    showLogin: false,
    showRegister: false
};

export function loginShowReducer(state=initLoginShowState, action){
    if(action.type === SHOW_LOGIN){
        return {
            type: action.type,
            showLogin: true,
            showRegister: false
        };
    }
    else if(action.type === SHOW_REGISTER){
        return {
            type: action.type,
            showLogin: false,
            showRegister: true
        };
    }
    else{
        return{
            type: action.type,
            showLogin: false,
            showRegister: false    
        };
    }
}

export const loginShowStore = createStore(loginShowReducer);