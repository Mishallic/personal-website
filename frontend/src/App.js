import './App.css';
import {useSelector} from "react-redux";
import RootPage from "./pages/Main";
import Footer from "./features/Footer/Footer";
import CMDProcessor from "./features/CMDProcessor/CMDProcessor";
import Desktop from "./features/GUI/Desktop";

function App() {
    const mode = useSelector(state => state.main.mode);
    return (
        <div className="App">
            <CMDProcessor>
                {mode === 'gui' ? <Desktop/> : <><RootPage/><Footer/></>}
            </CMDProcessor>
        </div>
    );
}

export default App;
