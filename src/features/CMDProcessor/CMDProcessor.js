import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {timestamp} from "../../helpers/timestamp";
import {availableCmds} from "./availableCMDS";
import {addLog, changePath, changePathBack, closeReader, openReader} from "../../store/main/mainSlice";


const CMDProcessor = ({children}) => {
    const dispatch = useDispatch();
    const {cmd, newCmd, pwd} = useSelector(state => state.main)
    console.log(pwd)
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
                if (cmdTarget === '..') {
                    if (pwd === 'root')
                        dispatch(changePathBack())

                    else {
                        dispatch(changePathBack())
                    }
                }

                break;
            // access
            case "ls":
                if (!cmdTarget)
                    return Object.keys(pwd.children)
                if (!Object.keys(pwd.children).includes(cmdTarget))
                    return 'Directory is not available!';
                if (pwd.children[cmdTarget].type !== 'dir')
                    return "Can't perform action on file";
                if (Object.keys(pwd.children).includes(cmdTarget))
                    return Object.keys(pwd.children[cmdTarget].children);
                break;
            // case "quit":
            case "cat":
                dispatch(openReader())
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