import './ReaderStyles.css'

const Reader = ({name, content}) => {
    return(
        <div className='readerRoot'>
            <div className="content">{name}</div>
            {content}
        </div>
    )
}

export default Reader;