import {createSlice} from "@reduxjs/toolkit";
// import {addEntry} from "./apis";

const initialState = {
    logEntries: [],
    reader: {
        name: 'Reader',
        content: 'content',
        state: 'close'
    }
}

export const mainSlice = createSlice({
    name: 'log',
    initialState,
    reducers: {
        addSuccess: (state, action) => {
            state.logEntries = [...state.logEntries, action.payload];
        },
        fetchSuccess: state => {
            state.logEntries = [...state.logEntries]
        },
        showReader: state => {
            state.reader = {...state.reader, state: 'open'}
        },
        hideReader: state => {
            state.reader = {...state.reader, state: 'close'}
        }
    }
})
const {addSuccess, fetchSuccess, showReader, hideReader} = mainSlice.actions
export default mainSlice.reducer;

export const addLog = (logEntry) => async dispatch => {
    try {
        // const {data} = await addEntry(logEntry);
        dispatch(addSuccess(logEntry));
    } catch (e) {
        return console.error(e);
    }
}
export const getLogs = () => async dispatch => {
    try {
        // const res = await fetchLog()
        return dispatch(fetchSuccess())
    } catch (e) {
        return console.error(e.message);
    }
}

export const openReader = () => dispatch => {
    return dispatch(showReader())
}

export const closeReader = () => dispatch => {
    return dispatch(hideReader())
}
