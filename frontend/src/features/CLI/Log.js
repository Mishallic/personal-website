import {memo} from "react";

// A response is plain text, a list of words, a directory listing or the help table.
const Response = ({response}) => {
    if (!response) return null;
    if (Array.isArray(response)) return <div className='logResponse'> {response.join(' ')}</div>;
    if (response.kind === 'entries')
        return (
            <div className='logResponse lsList'>
                {response.items.map(({name, type}) => (
                    <span key={name} className={`lsName ${type}`}>{name}</span>
                ))}
            </div>
        );
    if (response.kind === 'help')
        return (
            <div className='logResponse helpList'>
                {response.items.map(({usage, description}) => (
                    <div key={usage} className='helpItem'>
                        <span className='helpUsage'>{usage}</span>
                        <span className='helpDescription'>{description}</span>
                    </div>
                ))}
                {response.note && <div className='helpNote'>{response.note}</div>}
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
