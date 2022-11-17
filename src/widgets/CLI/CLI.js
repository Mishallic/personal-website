import './styles/cliMain.css'
import {useEffect, useRef, useState} from "react";
import Log from "./Log";
import {useDispatch} from "react-redux";
import {addLog, closeReader, openReader} from "../../store/main/mainSlice";

const CLI = ({log}) => {
    const dispatch = useDispatch();
    const [activeText, setActiveText] = useState('');
    const textareaRef = useRef();

    const activeTextChangeHandler = ({target}) => setActiveText(target.value);
    const constructCommand = (command) => {
        let response = '';
        if (command !== '\n' && command !== '')
            response = 'is not a recognized command. Type /h or ! for help';
        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds() + ':' + today.getMilliseconds();
        return {
            cmd: command,
            time: date + ' ' + time,
            response: response,
            user: 'mishal-alshomary',
        }
    }

    const lineBreakHandler = ({key, target}) => {
        if (key !== 'Enter') return;
        const command = constructCommand(target.value);
        dispatch(addLog(command))
        if(target.value === 'cat')
            dispatch(openReader())
        if(target.value === 'catnt')
            dispatch(closeReader())
        // setLog(prevState => ([...prevState, command]));
        setActiveText('');
    }

    const globalClickHandler = (e) => {
        console.log(e)
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
                    ai:~/ mishal-alshomary$
                </div>
                <div>
                    <input
                        className='interactiveLineTextarea'
                        onChange={activeTextChangeHandler}
                        onKeyDown={lineBreakHandler}
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