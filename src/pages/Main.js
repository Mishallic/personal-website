import CLI from "../widgets/CLI/CLI";
import Reader from "../widgets/Reader/Reader";
import {useSelector} from "react-redux";
import {useEffect} from "react";

const RootPage = () => {
    const {logEntries, reader} = useSelector(state => state.main);

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
    }, [reader.state])
    return (
        <div id="container">
            <div id="left_panel" style={{width: reader.state === 'open' ? '66vw' : '100vw'}}>
                <CLI log={logEntries}/>
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