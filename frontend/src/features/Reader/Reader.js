import './ReaderStyles.css'
import ReactMarkdown from "react-markdown";
import gfm from 'remark-gfm'

const Reader = ({name, content}) => {
    // content = content.replace('\\n', '\n');
    return (
        <div className='readerRoot'>
            <div className="header">{name}.<em>exe</em></div>
            <ReactMarkdown remarkPlugins={[gfm]} children={content}/>
        </div>
    )
}

export default Reader;