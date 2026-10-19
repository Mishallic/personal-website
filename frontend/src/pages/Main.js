import CLI from "../features/CLI/CLI";
import Reader from "../features/Reader/Reader";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {getMetadata} from "../store/main/mainSlice";

const RootPage = () => {
    const logEntries = useSelector(state => state.main.logEntries);
    const reader = useSelector(state => state.main.reader);
    const dispatch = useDispatch();
    const readerOpen = reader.state === 'open';

    // Drag handle between the terminal and the reader.
    useEffect(() => {
        const container = document.getElementById("container"),
            left = document.getElementById("left_panel"),
            right = document.getElementById("right_panel"),
            handle = document.getElementById("drag");
        if (!readerOpen) {
            if (left) left.style.width = ''; // drop any width left behind by dragging
            return;
        }
        let isResizing = false;
        const onDown = () => { isResizing = true; };
        const onMove = (e) => {
            if (!isResizing) return;
            const offsetRight = container.clientWidth - (e.clientX - container.offsetLeft);
            left.style.width = e.clientX + "px";
            right.style.width = offsetRight + "px";
        };
        const onUp = () => { isResizing = false; };
        handle?.addEventListener('mousedown', onDown);
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
        return () => {
            handle?.removeEventListener('mousedown', onDown);
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        };
    }, [readerOpen]);

    useEffect(() => {
        dispatch(getMetadata());
    }, [dispatch]);

    return (
        <div id="container">
            <div id="left_panel" className={readerOpen ? 'withReader' : ''}>
                <CLI log={logEntries}/>
            </div>
            {
                readerOpen &&
                <div id="right_panel">
                    <div id="drag"></div>
                    <Reader name={reader.name} content={reader.content}/>
                </div>
            }
        </div>
    )
}

export default RootPage;
