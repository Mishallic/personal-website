import './ReaderStyles.css'
import ReactMarkdown from "react-markdown";
import gfm from 'remark-gfm'

// Links leave the site, so they open in a new tab and the terminal session stays put.
const components = {
    a: ({node, children, ...props}) => <a {...props} target="_blank" rel="noreferrer">{children}</a>,
};

const Reader = ({name, content}) => {
    return (
        <div className='readerRoot'>
            <div className="readerHeader">{name}.<em>exe</em></div>
            <ReactMarkdown remarkPlugins={[gfm]} components={components} children={content}/>
        </div>
    )
}

export default Reader;
