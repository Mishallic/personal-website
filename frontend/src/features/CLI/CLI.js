import './styles/cliMain.css'
import {useEffect, useRef, useState} from "react";
import Log from "./Log";
import {useDispatch, useSelector} from "react-redux";
import {
    changeCMD,
    decrementLogHistoryIndex,
    incrementLogHistoryIndex,
    resetLogHistoryIndex, suggestionIndexIncrement, suggestionIndexReset, switchMode
} from "../../store/main/mainSlice";

// Login message, like a terminal's message of the day: what to type, and the way out for non-programmers.
const Motd = ({onDesktop}) => (
    <div className='cliMotd'>
        <div>Welcome to mishal-alshomary's terminal. Type <code>help</code> to see what you can do here.</div>
        <div>Not a programmer? <a href='#gui' onClick={onDesktop}>Switch to the desktop version</a> instead.</div>
    </div>
);

const CLI = ({log}) => {
    const dispatch = useDispatch();
    const [activeText, setActiveText] = useState('');
    const [caretPos, setCaretPos] = useState(0);
    const [focused, setFocused] = useState(true);
    const textareaRef = useRef();
    const draftRef = useRef(''); // what was being typed before browsing the history
    const pwdPath = useSelector(state => state.main.pwdPath);
    const pwd = useSelector(state => state.main.pwd);
    const suggestionIndex = useSelector(state => state.main.suggestionIndex);
    const cmdHistory = useSelector(state => state.main.cmdHistory);
    const logHistoryIndex = useSelector(state => state.main.logHistoryIndex);
    const motd = useSelector(state => state.main.motd);
    const pwdPathUser = pwdPath.replace('root', 'mishal-alshomary');
    const toDesktop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(switchMode('gui'));
    };

    // The custom cursor bar follows the real caret of the (otherwise caret-less) input.
    const syncCaret = () => setCaretPos(textareaRef.current?.selectionStart ?? 0);
    useEffect(() => {
        setCaretPos(textareaRef.current?.selectionStart ?? 0);
    }, [activeText]);

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
            handleArrowKeys(key);
            return;
        }
        if (key === 'Tab') {
            e.preventDefault();
            handleTabKey(value);
            return;
        }
        if (key !== 'Enter') return;
        if (value === '') value = '\n';
        dispatch(changeCMD(value));
        dispatch(resetLogHistoryIndex());
        draftRef.current = '';
        setActiveText('');
    }

    const handleTabKey = (value) => {
        const mainCMD = value.split(' ')[0];
        const cmdTarget = activeText.split(' ')[1];
        if (['cd', 'cat', 'ls'].includes(mainCMD.trim())) {
            let availableChildren = Object.keys(pwd.children);

            // Only suggest what the command can act on: directories for cd, files for cat.
            if (mainCMD.trim() === 'cd') {
                availableChildren = availableChildren.filter(el => pwd.children[el].type === 'dir');
            } else if (mainCMD.trim() === 'cat') {
                availableChildren = availableChildren.filter(el => pwd.children[el].type === 'file');
            }
            if (!availableChildren.length) return;

            if (suggestionIndex === 0 && !availableChildren.includes(cmdTarget)) {
                let targetChildIndex = availableChildren.findIndex(el => el.includes(cmdTarget));
                if (targetChildIndex === -1 && !cmdTarget) targetChildIndex = 0;
                if (targetChildIndex === -1 && cmdTarget) return;

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

    // Browse the command history queue; index 0 is the line being typed, which is kept as a draft.
    const handleArrowKeys = (key) => {
        const length = cmdHistory.length;
        if (key === "ArrowUp") {
            if (logHistoryIndex >= length) return;
            if (logHistoryIndex === 0) draftRef.current = activeText;
            setActiveText(cmdHistory[length - (logHistoryIndex + 1)]);
            dispatch(incrementLogHistoryIndex());
        }
        if (key === "ArrowDown") {
            if (logHistoryIndex === 0) return;
            const next = logHistoryIndex - 1;
            setActiveText(next === 0 ? draftRef.current : cmdHistory[length - next]);
            dispatch(decrementLogHistoryIndex());
        }
    }

    const globalClickHandler = () => {
        // A click that ends a text selection must not steal focus, or the highlight is lost before it can be copied.
        const selection = window.getSelection ? window.getSelection() : null;
        if (selection && selection.toString().length > 0) return;
        textareaRef.current?.focus();
    }

    useEffect(() => {
        textareaRef.current?.scrollIntoView({behavior: 'auto'})
    }, [log])

    return (
        <div className='cliRoot' onClick={globalClickHandler}>
            {motd && <Motd onDesktop={toDesktop}/>}
            <div className='cliLog'>
                <Log entries={log}/>
            </div>
            <div className='cliInteractiveLine'>
                <div className='interactiveLineMainText'>
                    ai:~/ {pwdPathUser}$
                </div>
                <div className='cliInputWrap'>
                    <input
                        className='interactiveLineTextarea'
                        onChange={activeTextChangeHandler}
                        onKeyDown={keyHandler}
                        onKeyUp={syncCaret}
                        onSelect={syncCaret}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        value={activeText}
                        autoFocus
                        ref={textareaRef}
                        spellCheck={false}
                        autoComplete='off'
                        aria-label='command'
                    />
                    <div className='cursorTrack' aria-hidden='true'>
                        <span className='cursorMeasure'>{activeText.slice(0, caretPos)}</span>
                        <span className={focused ? 'cursorBar cursorBlink' : 'cursorBar'}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CLI;
