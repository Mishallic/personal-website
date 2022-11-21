import {createSlice} from "@reduxjs/toolkit";
// import {addEntry} from "./apis";
import structure from "../structure.json";

const initialState = {
    logEntries: [],
    logHistoryIndex: -1,
    reader: {
        name: 'Reader',
        content: 'content',
        state: 'close'
    },
    cmd: '',
    newCmd: true,
    pwd: structure.root,
    pwdPath: 'root',
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
        incrementHistoryIndex: state => {
            state.logHistoryIndex++;
        },
        decrementHistoryIndex: state => {
            state.logHistoryIndex--;
        },
        resetHistoryIndex: state => {
            state.logHistoryIndex = 0;
        },
        showReader: (state, action) => {
            state.reader = {name: action.payload.name, content: action.payload.content, state: 'open'}
        },
        hideReader: state => {
            state.reader = {...state.reader, state: 'close'}
        },
        updatePWD: (state, action) => {
            state.pwd = action.payload.pwd;
            state.pwdPath = action.payload.path
        },
        updateCMD: (state, action) => {
            state.newCmd = !state.newCmd;
            state.cmd = action.payload;
        },
        resetPath: state => {
            state.pwdPath = 'root';
            state.pwd = structure.root
        }
    }
})
const {
    addSuccess,
    fetchSuccess,
    showReader,
    hideReader,
    updatePWD,
    updateCMD,
    resetPath,
    incrementHistoryIndex,
    decrementHistoryIndex,
    resetHistoryIndex
} = mainSlice.actions
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

export const incrementLogHistoryIndex = () => dispatch => {
    return dispatch(incrementHistoryIndex())
}
export const decrementLogHistoryIndex = () => dispatch => {
    return dispatch(decrementHistoryIndex())
}
export const resetLogHistoryIndex = () => dispatch => {
    return dispatch(resetHistoryIndex())
}

export const openReader = (name, content) => dispatch => {
    return dispatch(showReader({name, content}))
}

export const closeReader = () => dispatch => {
    return dispatch(hideReader())
}

export const changePath = (newPWD, newPwdPath) => dispatch => {
    return dispatch(updatePWD({pwd: newPWD, path: newPwdPath}));
}

export const changePathBack = () => (dispatch, getState) => {
    const {main: {pwdPath, dirRoot}} = getState();
    const pathArr = pwdPath.split('/');
    let newPWD;
    for (let i = 1; i < pathArr.length - 1; i++)
        newPWD = dirRoot.children[pathArr[i]];
    const newPwdPath = pathArr.slice(0, -1).join('/')
    if (newPwdPath === 'root')
        newPWD = dirRoot;
    return dispatch(updatePWD({pwd: newPWD, path: newPwdPath}))
}
export const resetPWD = () => dispatch => {
    return dispatch(resetPath())
}

export const changeCMD = (cmd) => dispatch => {
    return dispatch(updateCMD(cmd));
}
