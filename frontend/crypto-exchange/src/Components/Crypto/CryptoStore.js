import { createStore } from "redux";

export const SET_CRYPTOS = "SET_CRYPTOS";

export const initCryptoState = {
    type: SET_CRYPTOS,
    cryptos: []
};

