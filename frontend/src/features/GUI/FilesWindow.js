import {useDispatch, useSelector} from "react-redux";
import {changePath} from "../../store/main/mainSlice";
import Window from "./Window";
import {Icon} from "./icons";

// The Files window browses the same directory tree as the terminal: `cd` and `ls` as clicks.
const FilesWindow = ({front, onFocus, onClose, onOpenFile}) => {
    const dispatch = useDispatch();
    const pwd = useSelector(state => state.main.pwd);
    const pwdPath = useSelector(state => state.main.pwdPath);
    const dirRoot = useSelector(state => state.main.dirRoot);

    const segments = pwdPath.split('/');
    const label = (segment) => segment === 'root' ? 'Home' : segment;
    const goTo = (path) => dispatch(changePath(path));
    const open = (name, entry) => entry.type === 'dir' ? goTo(pwdPath + '/' + name) : onOpenFile(name, entry);
    const entries = Object.entries(pwd.children || {});
    const places = [
        ['Home', 'root'],
        ...Object.entries(dirRoot.children).filter(([, entry]) => entry.type === 'dir').map(([name]) => [name, 'root/' + name]),
    ];

    return (
        <Window title={label(segments[segments.length - 1])} className='filesWindow' front={front} onFocus={onFocus} onClose={onClose}>
            <div className='pathBar'>
                {segments.map((segment, i) => (
                    <button key={i} className='pathSegment' onClick={() => goTo(segments.slice(0, i + 1).join('/'))}>
                        {label(segment)}
                    </button>
                ))}
            </div>
            <div className='filesBody'>
                <aside className='filesSidebar'>
                    {places.map(([name, path]) => (
                        <button key={path} className={'place' + (pwdPath === path ? ' active' : '')} onClick={() => goTo(path)}>
                            <Icon name={path === 'root' ? 'home' : 'folder'} size={18}/>
                            <span>{name}</span>
                        </button>
                    ))}
                </aside>
                <section className='filesGrid'>
                    {entries.length === 0 && <p className='emptyFolder'>Folder is empty 🍃</p>}
                    {entries.map(([name, entry]) => (
                        <button key={name} className={`fileItem ${entry.type}`} onClick={() => open(name, entry)}>
                            <Icon name={entry.type === 'dir' ? 'folder' : 'file'} size={44}/>
                            <span className='fileName'>{name}</span>
                        </button>
                    ))}
                </section>
            </div>
        </Window>
    );
};

export default FilesWindow;
