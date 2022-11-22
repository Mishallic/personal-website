import './App.css';
import RootPage from "./pages/Main";
import Footer from "./features/Footer/Footer";
import CMDProcessor from "./features/CMDProcessor/CMDProcessor";

function App() {
    return (
        <div className="App">
            <CMDProcessor>
                <RootPage/>
                <Footer/>
            </CMDProcessor>
        </div>
    );
}

export default App;
