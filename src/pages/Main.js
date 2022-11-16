import CLI from "../widgets/CLI/CLI";
import Reader from "../widgets/Reader/Reader";
import {useEffect} from "react";

const RootPage = () => {
    useEffect(() => {
        let isResizing = false;
        (function () {
            let container = document.getElementById("container"),
                left = document.getElementById("left_panel"),
                right = document.getElementById("right_panel"),
                handle = document.getElementById("drag");

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
    }, [])
    return (
        <div id="container">
            <div id="left_panel">
                <CLI/>
            </div>
            <div id="right_panel">
                <div id="drag"></div>
                <Reader/>
            </div>
        </div>
    )
}

export default RootPage;