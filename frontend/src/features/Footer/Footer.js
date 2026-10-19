import './FooterStyles.css'
import {useDispatch} from "react-redux";
import {openReader, switchMode} from "../../store/main/mainSlice";
import readme from "../../content/readme";

const Footer = () => {
    const dispatch = useDispatch();
    // About opens the page about this site (also `cat readme`); GUI Version switches to the desktop.
    const showAbout = (e) => {
        e.preventDefault();
        dispatch(openReader('readme', readme));
    };
    const showGui = (e) => {
        e.preventDefault();
        dispatch(switchMode('gui'));
    };
    return (
        <div className='footerRoot'>
            <ul className='footerItems'>
                <li className='footerItem'><a href='#readme' onClick={showAbout}>About</a></li>
                <li className='footerItem'>
                    <a href='#gui' onClick={showGui}>GUI Version</a>
                    <span className='footerHint'>Not a programmer?</span>
                </li>
            </ul>
        </div>
    )
}

export default Footer;
