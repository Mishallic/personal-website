import './FooterStyles.css'
import {useDispatch} from "react-redux";
import {openReader} from "../../store/main/mainSlice";
import readme from "../../content/readme";

const Footer = () => {
    const dispatch = useDispatch();
    // About opens the page about this site (also `cat readme`); the links must not navigate away.
    const showAbout = (e) => {
        e.preventDefault();
        dispatch(openReader('readme', readme));
    };
    const stay = (e) => e.preventDefault();
    return (
        <div className='footerRoot'>
            <ul className='footerItems'>
                <li className='footerItem'><a href='#readme' onClick={showAbout}>About</a></li>
                <li className='footerItem'><a href='#gui' onClick={stay}>GUI Version</a></li>
            </ul>
        </div>
    )
}

export default Footer;
