import {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {timestamp} from "../../helpers/timestamp";
import {availableCmds} from "./availableCMDS";
import {fileContent} from "../../store/main/entries";
import {
    addLog,
    changePath,
    changePathBack,
    closeReader,
    cmdTrigger,
    openReader,
    resetPWD,
    clearCommandLog
} from "../../store/main/mainSlice";

const HELP = "Available commands: cd, ls, cat, close, clear, about, projects, blog, links, help, quit";
const TARGET_CMDS = ["cd", "ls", "cat"];
const splitCmd = (cmd) => cmd.trim().split(/\s+/);

// Directory listing with each entry's type, rendered line by line by the log; nothing for an empty dir.
const listEntries = (children) => {
    const items = Object.entries(children || {}).map(([name, entry]) => ({name, type: entry.type}));
    return items.length ? {kind: 'entries', items} : '';
};

const CMDProcessor = ({children}) => {
    const dispatch = useDispatch();
    const cmd = useSelector(state => state.main.cmd);
    const newCmd = useSelector(state => state.main.newCmd);
    const pwd = useSelector(state => state.main.pwd);
    const pwdPath = useSelector(state => state.main.pwdPath);

    const cmdSwitch = useCallback((cmdKeyword, cmdTarget) => {
        const entries = pwd.children || {};
        switch (cmdKeyword) {
            case "cd":
                if (!cmdTarget) {
                    dispatch(resetPWD());
                    return;
                }
                if (cmdTarget === '..') {
                    if (pwdPath !== 'root') dispatch(changePathBack());
                    return;
                }
                if (!(cmdTarget in entries))
                    return 'Directory ' + cmdTarget + " does not exist";
                if (entries[cmdTarget].type !== 'dir')
                    return cmdTarget + ' is not a directory';
                dispatch(changePath(pwdPath + '/' + cmdTarget));
                return;
            case "ls":
                if (!cmdTarget) return listEntries(entries);
                if (!(cmdTarget in entries)) return 'Directory is not available!';
                if (entries[cmdTarget].type !== 'dir') return "Cannot perform action on file";
                return listEntries(entries[cmdTarget].children);
            case "cat":
                if (!cmdTarget) return '';
                if (!(cmdTarget in entries) || entries[cmdTarget].type !== 'file')
                    return 'File ' + cmdTarget + " does not exist";
                // db rows carry the body in different columns (projects: about, blogs: content)
                dispatch(openReader(cmdTarget, fileContent(entries[cmdTarget])));
                return;
            case "close":
                dispatch(closeReader());
                return;
            case "help":
            case "!":
                return HELP;
            case "clear":
            case "clr":
                dispatch(clearCommandLog());
                return '';
            case "gui":      // switch to gui
            case "about":    // reader -> about
            case "projects": // cd projects
            case "blog":     // cd blog
            case "links":
            case "quit":
                return;      // reserved, not implemented yet
            default:
                return 'unrecognized';
        }
    }, [dispatch, pwd, pwdPath])

    const checkCmd = (cmd) => availableCmds.includes(splitCmd(cmd)[0]);

    const createResponse = useCallback((cmd) => {
        const [cmdKeyword, cmdArg] = splitCmd(cmd);
        const cmdTarget = TARGET_CMDS.includes(cmdKeyword) ? cmdArg : null;
        return cmdSwitch(cmdKeyword, cmdTarget)
    }, [cmdSwitch])

    const constructCmdObj = useCallback((command, good) => {
        let response = '';
        if (!good)
            response = 'is not a recognized command. Type help or ! for help';
        if (command !== '\n' && good)
            response = createResponse(command);

        const cmdObject = {
            cmd: command,
            time: timestamp(),
            response: response,
            user: pwdPath.replace('root', 'mishal-alshomary'),
        }
        dispatch(addLog(cmdObject));
    }, [createResponse, dispatch, pwdPath])

    const handleNewCMD = useCallback((cmd) => {
        constructCmdObj(cmd, checkCmd(cmd));
    }, [constructCmdObj])

    useEffect(() => {
        if (!cmd || !newCmd) return;
        handleNewCMD(cmd);
        dispatch(cmdTrigger());
    }, [newCmd, cmd, handleNewCMD, dispatch]);

    return children;
}

export default CMDProcessor;
