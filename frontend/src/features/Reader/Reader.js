import './ReaderStyles.css'
import {useDispatch} from "react-redux";
import {closeReader} from "../../store/main/mainSlice";
import Markdown from "./Markdown";

const Reader = ({name, content}) => {
    const dispatch = useDispatch();
    return (
        <div className='readerRoot'>
            <div className="readerHeader">
                <span className='readerFile'>{name}<em>.exe</em></span>
                <button className='readerClose' aria-label='close reader' title='Close (or type: close)'
                        onClick={() => dispatch(closeReader())}>✕</button>
            </div>
            <div className='readerBody'>
                <Markdown>{content}</Markdown>
            </div>
        </div>
    )
}

export default Reader;
