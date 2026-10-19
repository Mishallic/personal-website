import {memo} from "react";

const TYPE_LABEL = {dir: 'folder', file: 'file'};

// A response is plain text, a list of words, or a directory listing ({kind: 'entries', items}).
const Response = ({response}) => {
    if (!response) return null;
    if (Array.isArray(response)) return <div className='logResponse'> {response.join(' ')}</div>;
    if (response.kind === 'entries')
        return (
            <div className='logResponse lsList'>
                {response.items.map(({name, type}) => (
                    <div key={name} className='lsItem'>
                        <span className='lsType'>{TYPE_LABEL[type] || type}</span>
                        <span className={`lsName ${type}`}>{name}</span>
                    </div>
                ))}
            </div>
        );
    return <div className='logResponse'> {response}</div>;
};

const Log = ({entries}) => (
    <>
        {entries.map(({user, cmd, response, time}, i) => (
            <div key={`${time}-${i}`}>
                <div className='cliInteractiveLine'>
                    <div className='logLineMainText'>
                        ai:~/ {user}$
                    </div>
                    <div className='logLineTextarea'>{cmd}</div>
                </div>
                <Response response={response}/>
            </div>
        ))}
    </>
);

// Memoised: the CLI re-renders on every keystroke, the log only changes when a command is submitted.
export default memo(Log);
