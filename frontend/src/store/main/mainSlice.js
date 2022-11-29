import {createSlice} from "@reduxjs/toolkit";
import {structure} from "../structure.js";
import {addEntry, fetchBlogs, fetchProjects} from "./apis";

const initialState = {
    logEntries: [],
    logHistoryIndex: -1,
    suggestionIndex: 0,
    reader: {
        name: 'Reader',
        content: 'content',
        state: 'close'
    },
    cmd: '',
    newCmd: false,
    pwd: structure.root,
    pwdPath: 'root',
    dirRoot: structure.root,
    projects: [],
    blog: []
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

            // state.reader = {name: action.payload.name, content: action.payload.content, state: 'open'}
            state.reader = {name: action.payload.name, content: action.payload.content, state: 'open'}
        },
        hideReader: state => {
            state.reader = {...state.reader, state: 'close'}
        },
        updatePWD: (state, action) => {
            state.pwd = action.payload.pwd;
            state.pwdPath = action.payload.path;
        },
        updateCMD: (state, action) => {
            state.newCmd = !state.newCmd;
            state.cmd = action.payload;
        },
        triggerCMD: (state, action) => {
            state.newCmd = false;
        },
        resetPath: state => {
            state.pwdPath = 'root';
            state.pwd = state.dirRoot;
        },
        projectsSuccess: (state, action) => {
            state.projects = action.payload;
            state.pwd.children['projects'].children = action.payload
            state.dirRoot.children['projects'].children = action.payload
        },
        blogsSuccess: (state, action) => {
            state.blog = action.payload;
            state.pwd.children['blog'].children = action.payload
            state.dirRoot.children['blog'].children = action.payload
        },
        resetSuggestionIndex: state => {
            state.suggestionIndex = 0;
        },
        incrementSuggestionIndex: (state, action) => {
            state.suggestionIndex = action.payload;
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
    triggerCMD,
    resetPath,
    incrementHistoryIndex,
    decrementHistoryIndex,
    resetHistoryIndex,
    projectsSuccess,
    blogsSuccess,
    resetSuggestionIndex,
    incrementSuggestionIndex
} = mainSlice.actions
export default mainSlice.reducer;

export const addLog = (logEntry) => async dispatch => {
    try {
        dispatch(addSuccess(logEntry));
        dispatch(createLogEntry(logEntry))
    } catch (e) {
        return console.error(e);
    }
}

export const createLogEntry = (data) => async dispatch => {
    const logObject = {cmd:data.cmd, info:JSON.stringify({...data})}
    addEntry(logObject)
        .then(result => {console.log('😀')})
        .catch(e=>{
            console.log('🙃')})
}
export const getLogs = () => async dispatch => {
    try {
        // const res = await fetchLog()
        return dispatch(fetchSuccess())
    } catch (e) {
        return console.error(e.message);
    }
}

export const incrementLogHistoryIndex = () => dispatch => dispatch(incrementHistoryIndex());
export const decrementLogHistoryIndex = () => dispatch => dispatch(decrementHistoryIndex());
export const resetLogHistoryIndex = () => dispatch => dispatch(resetHistoryIndex());
export const openReader = (name, content) => dispatch => dispatch(showReader({name, content}));
export const closeReader = () => dispatch => dispatch(hideReader());
export const changePath = (newPWD, newPwdPath) => dispatch => dispatch(updatePWD({pwd: newPWD, path: newPwdPath}));


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

export const changeCMD = (cmd) => dispatch => dispatch(updateCMD(cmd));
export const resetPWD = () => dispatch => dispatch(resetPath());
export const cmdTrigger = () => dispatch => dispatch(triggerCMD());

export const getMetadata = () => dispatch => {
    dispatch(getProjects());
    dispatch(getBlogs());
}
const getProjects = () => dispatch => {
    fetchProjects()
        .then(res => {
            const projectsTransform = {};
            for (const rec of res.data) projectsTransform[rec.name] = {...rec, type: 'file'};
            dispatch(projectsSuccess(projectsTransform));
        })
        .catch(e => {
            console.log(e)
        });
}

const getBlogs = () => dispatch => {
    fetchBlogs()
        .then(res => {
            const blogsTransform = {};
            for (const rec of res.data) blogsTransform[rec.title] = {...rec, type: 'file'};
            dispatch(blogsSuccess(blogsTransform));
        })
        .catch(e => {
            console.log(e)
        });
}

export const suggestionIndexReset = () => dispatch => dispatch(resetSuggestionIndex())
export const suggestionIndexIncrement = (i) => dispatch => dispatch(incrementSuggestionIndex(i))