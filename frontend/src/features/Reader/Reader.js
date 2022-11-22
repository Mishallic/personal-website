import './ReaderStyles.css'
import ReactMarkdown from "react-markdown";
import {useEffect, useState} from "react";
import file from '../../store/main/test.md';

const Reader = ({name, content}) => {
    const [md, setMD] = useState('');
    useEffect(() => {
        fetch(file)
            .then(res => res.text())
            .then(txt => setMD(txt))
    }, [content])
    return (
        <div className='readerRoot'>
            <div className="header">{name}</div>
            <ReactMarkdown children={md}/>
        </div>
    )
}

export default Reader;