import {createSlice} from "@reduxjs/toolkit";
// import {addEntry} from "./apis";
import structure from "../structure.json";

const initialState = {
    logEntries: [],
    reader: {
        name: 'Reader',
        content: 'content',
        state: 'close'
    },
    cmd: '',
    newCmd: true,
    pwd: structure.root,
    pwdPath: 'root/projects/project1',
    dirRoot: structure.root
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
        },
        updatePWD: (state, action) => {
            state.pwd = action.payload;
        },
        updateCMD: (state, action) => {
            state.newCmd = !state.newCmd;
            state.cmd = action.payload;
        }
    }
})
const {addSuccess, fetchSuccess, showReader, hideReader, updatePWD, updateCMD} = mainSlice.actions
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

export const changePath = (dirName) => dispatch => {
    return dispatch(updatePWD(dirName));
}

export const changePathBack = () => (dispatch, getState) => {
    const {main: {pwdPath, dirRoot}} = getState();
    // console.log(pwdPath.split('/'))
    const pathArr = pwdPath.split('/');
    let newPWD;
    for (let i = 1; i < pathArr.length - 1; i++)
        newPWD = dirRoot.children[pathArr[i]];
    return dispatch(updatePWD(newPWD))
}

export const changeCMD = (cmd) => dispatch => {
    return dispatch(updateCMD(cmd));
}
