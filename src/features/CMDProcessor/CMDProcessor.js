import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {timestamp} from "../../helpers/timestamp";
import {availableCmds} from "./availableCMDS";
import {addLog, changePath, changePathBack, closeReader, openReader, resetPWD} from "../../store/main/mainSlice";


const CMDProcessor = ({children}) => {
    const dispatch = useDispatch();
    const {cmd, newCmd, pwd, pwdPath} = useSelector(state => state.main)
    console.log(pwd)
    console.log(pwdPath)
    const checkCmd = (cmd) => {
        const cmdArr = cmd.split(' ')
        const cmdKeyword = cmdArr[0];
        return availableCmds.includes(cmdKeyword);
    };
    const createResponse = (cmd) => {
        const cmdArr = cmd.split(' ');
        const cmdKeyword = cmdArr[0];
        let cmdTarget = null;
        if (cmdArr.length > 0 && ["cd", "ls", "cat"].includes(cmdKeyword))
            cmdTarget = cmdArr[1];
        return cmdSwitch(cmdKeyword, cmdTarget)
    }
    const cmdSwitch = (cmdKeyword, cmdTarget) => {
        switch (cmdKeyword) {
            case "cd":
                if (!cmdTarget) dispatch(resetPWD())
                if (cmdTarget === '..') {
                    if (pwdPath !== 'root') dispatch(changePathBack())
                    else return;
                } else {
                    if (!(children in pwd) || !Object.keys(pwd.children) || !Object.keys(pwd.children).includes(cmdTarget))
                        return 'Directory ' + cmdTarget + " doesn't exist";
                    else {
                        const newPwd = pwd.children[cmdTarget];
                        const newPwdPath = pwdPath + '/' + cmdTarget;
                        dispatch(changePath(newPwd, newPwdPath));
                    }
                }
                break;
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
            // case "quit":
            case "cat":
                if (!cmdTarget)
                    return ''
                else {
                    const availableFiles = Object.keys(pwd.children).filter(el => pwd.children[el].type === 'file');
                    if (availableFiles.includes(cmdTarget))
                        console.log('read target')
                    else return 'File ' + cmdTarget + " doesn't exist";
                }
                // dispatch(openReader())
                break
            case "catnt":
                dispatch(closeReader())
                break;
            case "help":
            // return help
            case "gui":
            // switch to gui
            case "about":
            // reader -> about
            case "projects":
            // cd projects
            case "blog":
            // cd blog
            default:
                return 'unrecognized';
        }
    }

    const constructCmdObj = (command, good) => {
        let response = '';
        if (!good)
            response = 'is not a recognized command. Type /h or ! for help';
        if (command !== '\n' && good)
            response = createResponse(command);

        const cmdObject = {
            cmd: command,
            time: timestamp(),
            response: response,
            user: 'mishal-alshomary',
        }

        dispatch(addLog(cmdObject))
    };

    // return response
    useEffect(() => {
        if (!cmd) return;
        constructCmdObj(cmd, checkCmd(cmd));
    }, [newCmd]);

    return children;
}

export default CMDProcessor;