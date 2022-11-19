import './ReaderStyles.css'

const Reader = ({name, content}) => {
    return(
        <div className='readerRoot'>
            <div className="header">{name}</div>
            <div className="content">{content}</div>
        </div>
    )
}

export default Reader;