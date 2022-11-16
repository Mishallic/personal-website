const Log = ({entries}) => {
    const renderEntries = () => entries.map(({user, cmd, response, time}) => (
        <div key={time}>
            <div className='cliInteractiveLine'>
                <div className='logLineMainText'>
                    ai:~/ {user}$
                </div>
                <div className='logLineTextarea'>{cmd}</div>
            </div>
            {response && <div className='logResponse'>&emsp;{cmd.split(' ')[0]} {response}</div>}
        </div>
    ));

    return (
        <div>
            {renderEntries()}
        </div>
    )
}

export default Log;