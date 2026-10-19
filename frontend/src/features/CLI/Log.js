import {memo} from "react";

const Log = ({entries}) => (
    <>
        {entries.map(({user, cmd, response, time}, i) => {
            const text = Array.isArray(response) ? response.join(' ') : response;
            return (
                <div key={`${time}-${i}`}>
                    <div className='cliInteractiveLine'>
                        <div className='logLineMainText'>
                            ai:~/ {user}$
                        </div>
                        <div className='logLineTextarea'>{cmd}</div>
                    </div>
                    {text && <div className='logResponse'> {text}</div>}
                </div>
            );
        })}
    </>
);

// Memoised: the CLI re-renders on every keystroke, the log only changes when a command is submitted.
export default memo(Log);
