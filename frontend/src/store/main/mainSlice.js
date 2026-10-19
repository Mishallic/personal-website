import {createSlice} from "@reduxjs/toolkit";
import {structure} from "../structure.js";
import {addEntry, fetchBlogs, fetchProjects} from "./apis";
import {resolvePath, toEntries} from "./entries";

/** How many submitted commands the history queue keeps. */
export const HISTORY_LIMIT = 50;

/** The page starts in desktop mode when opened with #gui (the footer's GUI Version link). */
const initialMode = () => (typeof window !== 'undefined' && window.location.hash === '#gui') ? 'gui' : 'cli';

const initialState = {
    mode: initialMode(), // 'cli' (terminal) or 'gui' (desktop)
    logEntries: [],
    cmdHistory: [],      // bounded FIFO queue of submitted commands, oldest first
    logHistoryIndex: 0,  // steps back from the newest command; 0 = the line being typed
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

// Merge db-backed entries over the ones bundled with the app (same name: the db row wins), then
// re-resolve pwd from its path so the working directory reflects the new tree no matter which
// directory the user is in when data arrives.
const setDirChildren = (state, dirName, entries) => {
    Object.assign(state.dirRoot.children[dirName].children, entries);
    state.pwd = resolvePath(state.dirRoot, state.pwdPath);
};

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
        pushHistory: (state, action) => {
            const cmd = action.payload;
            if (typeof cmd !== 'string' || cmd === '\n' || !cmd.trim()) return;
            if (state.cmdHistory[state.cmdHistory.length - 1] === cmd) return; // skip consecutive repeats
            state.cmdHistory.push(cmd);
            if (state.cmdHistory.length > HISTORY_LIMIT) state.cmdHistory.shift(); // drop the oldest
        },
        incrementHistoryIndex: state => {
            if (state.logHistoryIndex < state.cmdHistory.length) state.logHistoryIndex++;
        },
        decrementHistoryIndex: state => {
            if (state.logHistoryIndex > 0) state.logHistoryIndex--;
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
            state.pwdPath = action.payload.path;
            state.pwd = resolvePath(state.dirRoot, action.payload.path);
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
            setDirChildren(state, 'projects', action.payload);
        },
        blogsSuccess: (state, action) => {
            state.blog = action.payload;
            setDirChildren(state, 'blog', action.payload);
        },
        resetSuggestionIndex: state => {
            state.suggestionIndex = 0;
        },
        incrementSuggestionIndex: (state, action) => {
            state.suggestionIndex = action.payload;
        },
        clearLog: (state) => {
            state.logEntries = []; // the command history queue is kept on purpose
        },
        setMode: (state, action) => {
            state.mode = action.payload;
        }
    }
})
const {
    addSuccess,
    fetchSuccess,
    pushHistory,
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
    incrementSuggestionIndex,
    clearLog,
    setMode
} = mainSlice.actions
export default mainSlice.reducer;

export const addLog = (logEntry) => async dispatch => {
    try {
        dispatch(addSuccess(logEntry));
        dispatch(pushHistory(logEntry.cmd));
        dispatch(createLogEntry(logEntry))
    } catch (e) {
        return console.error(e);
    }
}

export const createLogEntry = (data) => async dispatch => {
    const logObject = {cmd: data.cmd, info: JSON.stringify({...data})}
    addEntry(logObject)
        .then(result => {console.log('😀')})
        .catch(e => {
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
export const clearCommandLog = () => dispatch => dispatch(clearLog());
// Switch between the terminal and the desktop; the url hash mirrors it so #gui can be shared.
export const switchMode = (mode) => dispatch => {
    dispatch(setMode(mode));
    if (typeof window === 'undefined') return;
    const hash = mode === 'gui' ? '#gui' : '';
    if (window.location.hash !== hash)
        window.history.replaceState(null, '', window.location.pathname + window.location.search + hash);
};
export const changePath = (newPwdPath) => dispatch => {
    dispatch(updatePWD({path: newPwdPath}));
    if (newPwdPath === 'root/projects')
        dispatch(getProjects())
    if (newPwdPath === 'root/blog')
        dispatch(getBlogs())
}

export const changePathBack = () => (dispatch, getState) => {
    const {main: {pwdPath}} = getState();
    const newPwdPath = pwdPath.split('/').slice(0, -1).join('/') || 'root';
    return dispatch(updatePWD({path: newPwdPath}))
}

export const changeCMD = (cmd) => dispatch => dispatch(updateCMD(cmd));
export const resetPWD = () => dispatch => dispatch(resetPath());
export const cmdTrigger = () => dispatch => dispatch(triggerCMD());

export const getMetadata = () => dispatch => {
    dispatch(getProjects());
    dispatch(getBlogs());
}
const getProjects = () => (dispatch, getState) => {
    fetchProjects()
        .then(res => {
            const parentDir = getState().main.dirRoot.children['projects'];
            dispatch(projectsSuccess(toEntries(res.data, parentDir)));
        })
        .catch(e => {
            console.log(e)
        });
}

const getBlogs = () => (dispatch, getState) => {
    fetchBlogs()
        .then(res => {
            const parentDir = getState().main.dirRoot.children['blog'];
            dispatch(blogsSuccess(toEntries(res.data, parentDir)));
        })
        .catch(e => {
            console.log(e)
        });
}

export const suggestionIndexReset = () => dispatch => dispatch(resetSuggestionIndex())
export const suggestionIndexIncrement = (i) => dispatch => dispatch(incrementSuggestionIndex(i))
