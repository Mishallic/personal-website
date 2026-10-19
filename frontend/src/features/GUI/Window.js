import {useState} from "react";

// A fixed window frame in the style of Yaru: a light header with the title and controls on the right.
const Window = ({title, className = '', front, onFocus, onClose, children}) => {
    const [maximised, setMaximised] = useState(false);
    return (
        <section
            className={`window ${className}${front ? ' front' : ''}${maximised ? ' maximised' : ''}`}
            role="dialog" aria-label={title} onMouseDown={onFocus}
        >
            <header className='windowHeader'>
                <span className='windowTitle'>{title}</span>
                <span className='windowControls'>
                    <button className='windowControl' aria-label={`${maximised ? 'restore' : 'maximise'} ${title}`}
                            title={maximised ? 'Restore' : 'Maximise'} onClick={() => setMaximised(m => !m)}>
                        {maximised ? '❐' : '☐'}
                    </button>
                    <button className='windowControl close' aria-label={`close ${title}`} title='Close' onClick={onClose}>
                        ✕
                    </button>
                </span>
            </header>
            <div className='windowContent'>{children}</div>
        </section>
    );
};

export default Window;
