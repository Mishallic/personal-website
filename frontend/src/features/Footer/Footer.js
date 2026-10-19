import './FooterStyles.css'

// Placeholder links: they must not navigate, or the terminal session is reloaded away.
const stay = (e) => e.preventDefault();

const Footer = () => {
    return (
        <div className='footerRoot'>
            <ul className='footerItems'>
                <li className='footerItem'><a href='#about' onClick={stay}>About</a></li>
                <li className='footerItem'><a href='#gui' onClick={stay}>GUI Version</a></li>
            </ul>
        </div>
    )
}

export default Footer;
