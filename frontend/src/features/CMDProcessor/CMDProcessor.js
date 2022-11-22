import {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {timestamp} from "../../helpers/timestamp";
import {availableCmds} from "./availableCMDS";
import {addLog, changePath, changePathBack, closeReader, openReader, resetPWD} from "../../store/main/mainSlice";


const CMDProcessor = ({children}) => {
    const dispatch = useDispatch();
    const {cmd, newCmd, pwd, pwdPath} = useSelector(state => state.main);
    const cmdSwitch = useCallback((cmdKeyword, cmdTarget) => {
        switch (cmdKeyword) {
            case "cd":
                if (!cmdTarget) {
                    dispatch(resetPWD());
                    return;
                }
                if (cmdTarget === '..') {
                    if (pwdPath !== 'root') {
                        dispatch(changePathBack());
                        return
                    } else return;
                } else {
                    if (!('children' in pwd) || !Object.keys(pwd.children) || !Object.keys(pwd.children).includes(cmdTarget))
                        return 'Directory ' + cmdTarget + " doesn't exist";
                    else if (pwd.children[cmdTarget].type !== 'dir')
                        return cmdTarget + ' is not a directory'
                    else {
                        const newPwd = pwd.children[cmdTarget];
                        const newPwdPath = pwdPath + '/' + cmdTarget;
                        dispatch(changePath(newPwd, newPwdPath));
                        return;
                    }
                }
            case "ls":
                if (!cmdTarget) {
                    if (!('children' in pwd)) return '';
                    return Object.keys(pwd.children)
                }
                if (('children' in pwd) && Object.keys(pwd.children) && !Object.keys(pwd.children).includes(cmdTarget))
                    return 'Directory is not available!';
                if (('children' in pwd) && (cmdTarget in pwd.children) && pwd.children[cmdTarget].type !== 'dir')
                    return "Can't perform action on file"
                if (('children' in pwd) && Object.keys(pwd.children).includes(cmdTarget))
                    return Object.keys(pwd.children[cmdTarget].children);
                break;
            case "cat":
                if (!cmdTarget)
                    return ''
                else {
                    const availableFiles = Object.keys(pwd.children).filter(el => pwd.children[el].type === 'file');
                    if (availableFiles.includes(cmdTarget))
                        dispatch(openReader(cmdTarget, pwd.children[cmdTarget].content))
                    else return 'File ' + cmdTarget + " doesn't exist";
                }
                break
            case "catnt":
                dispatch(closeReader())
                break;
            case "help":
                break;
            // return help
            case "gui":
                break;
            // switch to gui
            case "about":
                break;
            // reader -> about
            case "projects":
                break;
            // cd projects.js
            case "blog":
                break;
            // cd blog
            default:
                return 'unrecognized';
        }
    }, [dispatch, pwd, pwdPath])
    const checkCmd = (cmd) => {
        const cmdArr = cmd.split(' ')
        const cmdKeyword = cmdArr[0];
        return availableCmds.includes(cmdKeyword);
    };
    const createResponse = useCallback((cmd) => {
        const cmdArr = cmd.split(' ');
        const cmdKeyword = cmdArr[0];
        let cmdTarget = null;
        if (cmdArr.length > 0 && ["cd", "ls", "cat"].includes(cmdKeyword))
            cmdTarget = cmdArr[1];
        return cmdSwitch(cmdKeyword, cmdTarget)
    }, [cmdSwitch])

    const constructCmdObj = useCallback((command, good) => {
        let response = '';
        if (!good)
            response = 'is not a recognized command. Type /h or ! for help';
        if (command !== '\n' && good)
            response = createResponse(command);

        const cmdObject = {
            cmd: command,
            time: timestamp(),
            response: response,
            user: pwdPath.replace('root', 'mishal-alshomary'),
        }

        dispatch(addLog(cmdObject))
    }, [createResponse, dispatch, pwdPath])

    const handleNewCMD = useCallback((cmd) => {
        constructCmdObj(cmd, checkCmd(cmd));
    }, [constructCmdObj])

    useEffect(() => {
        if (!cmd) return;
        handleNewCMD(cmd);
    }, [newCmd, cmd, handleNewCMD]);

    return children;
}

export default CMDProcessor;