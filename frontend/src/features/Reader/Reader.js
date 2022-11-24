import './ReaderStyles.css'
import ReactMarkdown from "react-markdown";

const Reader = ({name, content}) => {
    content = content.replace('\\n', '\n');
    return (
        <div className='readerRoot'>
            <div className="header">{name}</div>
            <ReactMarkdown children={content}/>
        </div>
    )
}

export default Reader;