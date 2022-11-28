import './styles/cliMain.css'
import {useEffect, useRef, useState} from "react";
import Log from "./Log";
import {useDispatch, useSelector} from "react-redux";
import {
    changeCMD,
    decrementLogHistoryIndex,
    incrementLogHistoryIndex,
    resetLogHistoryIndex, suggestionIndexIncrement, suggestionIndexReset
} from "../../store/main/mainSlice";

const CLI = ({log, logHistoryIndex}) => {
    const dispatch = useDispatch();
    const [activeText, setActiveText] = useState('');
    const textareaRef = useRef();
    const {pwdPath, pwd, suggestionIndex} = useSelector(state => state.main);
    let pwdPathUser = pwdPath.replace('root', 'mishal-alshomary');
    const activeTextChangeHandler = ({target}) => {
        const valueArr = target.value.split(' ');
        const mainCmdChanged = !['cd', 'ls', 'cat'].includes(valueArr[0]);
        if (suggestionIndex > 0 && (mainCmdChanged || !valueArr[1]))
            dispatch(suggestionIndexReset())
        setActiveText(target.value)
    };
    const keyHandler = (e) => {
        const {key, target} = e;
        let {value} = target;
        if (['ArrowUp', 'ArrowDown'].includes(key)) {
            e.preventDefault();
            handleArrowKeys(key)
        }
        if (key === 'Tab') {
            e.preventDefault();
            handleTabKey(value);
        }
        if (key !== 'Enter') return;
        if (key === 'Enter' && value === '') value = '\n';
        dispatch(changeCMD(value));
        dispatch(resetLogHistoryIndex());
        setActiveText('');
    }

    const handleTabKey = (value) => {
        const mainCMD = value.split(' ')[0];
        const cmdTarget = activeText.split(' ')[1];
        if (['cd', 'cat', 'ls'].includes(mainCMD.trim())) {
            let availableChildren = Object.keys(pwd.children);
            if (suggestionIndex === 0 && !availableChildren.includes(cmdTarget)) {
                let targetChildIndex = availableChildren.findIndex(el => el.includes(cmdTarget));
                if (targetChildIndex === -1) targetChildIndex = 0;

                let newIndex = targetChildIndex + 1;
                if (targetChildIndex + 1 === availableChildren.length)
                    newIndex = 0
                dispatch(suggestionIndexIncrement(newIndex))
                setActiveText(mainCMD + ' ' + availableChildren[targetChildIndex]);
                return;
            }
            if ((availableChildren.length - 1) === suggestionIndex)
                dispatch(suggestionIndexReset())
            else
                dispatch(suggestionIndexIncrement(suggestionIndex + 1));
            setActiveText(mainCMD + ' ' + availableChildren[suggestionIndex]);
        } else
            dispatch(suggestionIndexReset())
    }

    const handleArrowKeys = (key) => {
        if (key === "ArrowUp") {
            try {
                setActiveText(log[log.length - logHistoryIndex - 1].cmd);
                dispatch(incrementLogHistoryIndex());
            } catch (e) {
                // console.log(e)
            }
        }
        if (key === "ArrowDown") {
            try {
                setActiveText(log[log.length - logHistoryIndex + 1].cmd);
                dispatch(decrementLogHistoryIndex());
            } catch (e) {
                // console.log(e)
            }
        }
    }

    const globalClickHandler = (e) => {
        textareaRef.current.focus();
    }

    useEffect(() => {
        textareaRef.current?.scrollIntoView({behavior: 'auto'})
    }, [log])


    const cliRef = useRef();
    return (
        <div ref={cliRef} className='cliRoot' onClick={globalClickHandler}>
            <div className='cliLog'>
                <Log entries={log}/>
            </div>
            <div className='cliInteractiveLine'>
                <div className='interactiveLineMainText'>
                    ai:~/ {pwdPathUser}$
                </div>
                <div>
                    <input
                        className='interactiveLineTextarea'
                        onChange={activeTextChangeHandler}
                        onKeyDown={keyHandler}
                        value={activeText}
                        autoFocus
                        ref={textareaRef}
                    />
                </div>
            </div>
        </div>
    )
}

export default CLI;