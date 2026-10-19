import './ReaderStyles.css'
import Markdown from "./Markdown";

const Reader = ({name, content}) => {
    return (
        <div className='readerRoot'>
            <div className="readerHeader">{name}.<em>exe</em></div>
            <Markdown>{content}</Markdown>
        </div>
    )
}

export default Reader;
