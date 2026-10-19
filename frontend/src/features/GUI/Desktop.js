import './gui.css';
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {changePath, closeReader, getMetadata, openReader, switchMode} from "../../store/main/mainSlice";
import {fileContent} from "../../store/main/entries";
import FilesWindow from "./FilesWindow";
import EditorWindow from "./EditorWindow";
import Wallpaper from "./Wallpaper";
import {Icon} from "./icons";

const TopBar = ({app}) => {
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 30000);
        return () => clearInterval(timer);
    }, []);
    const clock = now.toLocaleDateString('en-GB', {weekday: 'short', day: 'numeric', month: 'short'})
        + '  ' + now.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'});
    return (
        <header className='topBar'>
            <span className='topBarLeft'><span className='topBarActivities'>Activities</span><span className='topBarApp'>{app}</span></span>
            <span className='topBarClock'>{clock}</span>
            <span className='topBarStatus'><Icon name='wifi' size={16}/><Icon name='sound' size={16}/><Icon name='battery' size={16}/></span>
        </header>
    );
};

// Desktop mode: the same store as the terminal, presented as a very small Ubuntu-like desktop.
const Desktop = () => {
    const dispatch = useDispatch();
    const dirRoot = useSelector(state => state.main.dirRoot);
    const reader = useSelector(state => state.main.reader);
    const [filesOpen, setFilesOpen] = useState(true);
    const [front, setFront] = useState('files');

    useEffect(() => {
        dispatch(getMetadata());
    }, [dispatch]);

    const openFolder = (path) => {
        dispatch(changePath(path));
        setFilesOpen(true);
        setFront('files');
    };
    const openFile = (name, entry) => {
        dispatch(openReader(name, fileContent(entry)));
        setFront('editor');
    };
    const dock = [
        {id: 'files', label: 'Files', icon: 'home', action: () => openFolder('root')},
        {id: 'projects', label: 'Projects', icon: 'folder', action: () => openFolder('root/projects')},
        {id: 'blog', label: 'Blog', icon: 'folder', action: () => openFolder('root/blog')},
        {id: 'about', label: 'About', icon: 'user', action: () => openFile('about', dirRoot.children.about)},
        {id: 'links', label: 'Links', icon: 'link', action: () => openFile('links', dirRoot.children.links)},
        {id: 'readme', label: 'Readme', icon: 'info', action: () => openFile('readme', dirRoot.children.readme)},
        {id: 'terminal', label: 'Terminal', icon: 'terminal', action: () => dispatch(switchMode('cli'))},
    ];
    const editorOpen = reader.state === 'open';
    const app = front === 'editor' && editorOpen ? 'Text Editor' : filesOpen ? 'Files' : 'Desktop';

    return (
        <div className='desktop'>
            <Wallpaper/>
            <TopBar app={app}/>
            <nav className='dock' aria-label='dock'>
                {dock.map(item => (
                    <button key={item.id} className={`dockItem ${item.id}`} title={item.label} aria-label={item.label} onClick={item.action}>
                        <Icon name={item.icon} size={26}/>
                    </button>
                ))}
            </nav>
            <main className='desktopArea'>
                <div className='desktopIcons' data-testid='desktop-icons'>
                    <button className='desktopIcon' onClick={() => openFolder('root')}>
                        <Icon name='home' size={40}/>
                        <span>Home</span>
                    </button>
                    <button className='desktopIcon' onClick={() => openFile('about', dirRoot.children.about)}>
                        <Icon name='user' size={40}/>
                        <span>About</span>
                    </button>
                </div>
                {filesOpen && (
                    <FilesWindow front={front === 'files'} onFocus={() => setFront('files')}
                                 onClose={() => setFilesOpen(false)} onOpenFile={openFile}/>
                )}
                {editorOpen && (
                    <EditorWindow front={front === 'editor'} onFocus={() => setFront('editor')}
                                  name={reader.name} content={reader.content} onClose={() => dispatch(closeReader())}/>
                )}
            </main>
        </div>
    );
};

export default Desktop;
