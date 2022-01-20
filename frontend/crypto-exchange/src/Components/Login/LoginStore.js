import { createStore } from 'redux';

export const NO_USER_LOGGED = "NO_USER_LOGGED";
export const USER_LOGGED = "USER_LOGGED";

export const initLoginState = {
    type: NO_USER_LOGGED,
    userJson: null
};

export function loginReducer(state=initLoginState, action){
    if(action.type === USER_LOGGED){
        return {
            userJson: action.userJson
        };
    }
    else {
        return state;
    }
}

export const loginStore = createStore(loginReducer);
