import CLI from "../features/CLI/CLI";
import Reader from "../features/Reader/Reader";
import {useSelector, useDispatch} from "react-redux";
import {useEffect} from "react";
import {getProjects} from "../store/main/mainSlice";

const RootPage = () => {
    const {logEntries, logHistoryIndex, reader, projects} = useSelector(state => state.main);
    const dispatch = useDispatch()
    useEffect(() => {
        let isResizing = false;
        (function () {
            let container = document.getElementById("container"),
                left = document.getElementById("left_panel"),
                right = document.getElementById("right_panel"),
                handle = document.getElementById("drag");
            if (handle)
                handle.onmousedown = function (e) {
                    isResizing = true;
                };
            document.onmousemove = function (e) {
                if (!isResizing) return;
                let offsetRight = container.clientWidth - (e.clientX - container.offsetLeft);
                left.style.width = e.clientX + "px";
                right.style.width = offsetRight + "px";
            }
            document.onmouseup = function (e) {
                isResizing = false;
            }
        })();
    }, [reader.state]);
    useEffect(()=>{
        dispatch(getProjects())
    },[])
    return (
        <div id="container">
            <div id="left_panel" style={{width: reader.state === 'open' ? '66vw' : '100vw'}}>
                <CLI log={logEntries} logHistoryIndex={logHistoryIndex}/>
            </div>
            {
                reader.state === 'open' &&
                <div id="right_panel">
                    <div id="drag"></div>
                    <Reader name={reader.name} content={reader.content}/>
                </div>
            }
        </div>
    )
}

export default RootPage;