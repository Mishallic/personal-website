const Log = ({entries}) => {
    const renderEntries = () => entries.map(({user, cmd, response, time}) => {
        if (Array.isArray(response))
            response = response.join(' ');
        return (
            <div key={time}>
                <div className='cliInteractiveLine'>
                    <div className='logLineMainText'>
                        ai:~/ {user}$
                    </div>
                    <div className='logLineTextarea'>{cmd}</div>
                </div>
                {response && <div className='logResponse'> {response}</div>}
            </div>
        )
    });

    return (
        <> {renderEntries()}</>
    )
}

export default Log;