import './ReaderStyles.css'

const Reader = (props) => {
    return(
        <div className='readerRoot'>
            {props.children}
            <div className="content">Reader</div>
        </div>
    )
}

export default Reader;