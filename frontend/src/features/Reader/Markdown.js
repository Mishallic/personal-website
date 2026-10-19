import ReactMarkdown from "react-markdown";
import gfm from 'remark-gfm'

// Links leave the site, so they open in a new tab and the session stays put.
const components = {
    a: ({node, children, ...props}) => <a {...props} target="_blank" rel="noreferrer">{children}</a>,
};

// Markdown rendering shared by the terminal's reader and the desktop's text editor.
const Markdown = ({children}) => (
    <ReactMarkdown remarkPlugins={[gfm]} components={components} children={children}/>
);

export default Markdown;
