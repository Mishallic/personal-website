import Window from "./Window";
import Markdown from "../Reader/Markdown";

// The desktop counterpart of the reader: `cat <file>` as a Text Editor window.
const EditorWindow = ({front, onFocus, onClose, name, content}) => (
    <Window title={`${name} - Text Editor`} className='editorWindow' front={front} onFocus={onFocus} onClose={onClose}>
        <div className='editorBody'>
            <Markdown>{content}</Markdown>
        </div>
    </Window>
);

export default EditorWindow;
