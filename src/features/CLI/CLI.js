import './styles/cliMain.css'
import {useEffect, useRef, useState} from "react";
import Log from "./Log";
import {useDispatch} from "react-redux";
import {changeCMD} from "../../store/main/mainSlice";

const CLI = ({log}) => {
    const dispatch = useDispatch();
    const [activeText, setActiveText] = useState('');
    const textareaRef = useRef();
    const activeTextChangeHandler = ({target}) => setActiveText(target.value);


    const keyHandler = (e) => {
        const {key, target} = e;
        let {value} = target;
        if (key === 'Tab') e.preventDefault();
        if (key !== 'Enter') return;
        if (key === 'Enter' && value === '') value = '\n';
        dispatch(changeCMD(value));
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