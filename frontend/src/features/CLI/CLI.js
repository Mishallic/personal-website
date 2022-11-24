import './styles/cliMain.css'
import {useEffect, useRef, useState} from "react";
import Log from "./Log";
import {useDispatch, useSelector} from "react-redux";
import {
    changeCMD, cmdTrigger,
    decrementLogHistoryIndex,
    incrementLogHistoryIndex,
    resetLogHistoryIndex
} from "../../store/main/mainSlice";

const CLI = ({log, logHistoryIndex}) => {
    const dispatch = useDispatch();
    const [activeText, setActiveText] = useState('');
    const textareaRef = useRef();
    const activeTextChangeHandler = ({target}) => setActiveText(target.value);
    let pwdPath = useSelector(state => state.main.pwdPath);
    pwdPath = pwdPath.replace('root', 'mishal-alshomary');
    const keyHandler = (e) => {
        const {key, target} = e;
        let {value} = target;
        if (key === "ArrowUp") {
            try {
                e.preventDefault();
                setActiveText(log[log.length - logHistoryIndex - 1].cmd);
                dispatch(incrementLogHistoryIndex());
                return;
            } catch (e) {
                // console.log(e)
            }
        }
        if (key === "ArrowDown") {
            try {
                e.preventDefault();
                setActiveText(log[log.length - logHistoryIndex + 1].cmd);
                dispatch(decrementLogHistoryIndex());
                return;
            } catch (e) {
                // console.log(e)
            }
        }
        if (key === 'Tab') e.preventDefault();
        if (key !== 'Enter') return;
        if (key === 'Enter' && value === '') value = '\n';
        dispatch(changeCMD(value));
        dispatch(resetLogHistoryIndex());
        setActiveText('');
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
                    ai:~/ {pwdPath}$
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