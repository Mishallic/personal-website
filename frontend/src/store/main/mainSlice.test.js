import reducer, {mainSlice, HISTORY_LIMIT} from './mainSlice';
import {fileContent, resolvePath, toEntries} from './entries';
import {CHILD_TYPE} from '../structure';

const {pushHistory, clearLog, addSuccess, updatePWD, projectsSuccess} = mainSlice.actions;
const run = (actions) => actions.reduce(reducer, undefined);

describe('command history queue', () => {
    test('keeps at most HISTORY_LIMIT commands, dropping the oldest first', () => {
        const cmds = Array.from({length: HISTORY_LIMIT + 5}, (_, i) => `cmd${i}`);
        const state = run(cmds.map(pushHistory));
        expect(state.cmdHistory).toHaveLength(HISTORY_LIMIT);
        expect(state.cmdHistory[0]).toBe('cmd5');
        expect(state.cmdHistory[HISTORY_LIMIT - 1]).toBe(`cmd${HISTORY_LIMIT + 4}`);
    });

    test('ignores empty submissions and consecutive repeats', () => {
        const state = run(['\n', 'ls', 'ls', '   ', 'cd blog'].map(pushHistory));
        expect(state.cmdHistory).toEqual(['ls', 'cd blog']);
    });

    test('survives clearing the screen log', () => {
        const entry = {cmd: 'ls', time: 't', response: '', user: 'u'};
        const state = run([pushHistory('ls'), addSuccess(entry), clearLog()]);
        expect(state.logEntries).toEqual([]);
        expect(state.cmdHistory).toEqual(['ls']);
    });
});

describe('directory tree from db records', () => {
    const projects = [{name: 'site', about: '# site'}, {name: 'bot', content: 'bot body'}, {name: '', about: 'x'}];

    test('toEntries derives the type from the parent dir and normalises content', () => {
        const entries = toEntries(projects, {child_type: CHILD_TYPE.FILE});
        expect(Object.keys(entries)).toEqual(['site', 'bot']);
        expect(entries.site).toMatchObject({type: 'file', content: '# site'});
        expect(entries.bot).toMatchObject({type: 'file', content: 'bot body'});
    });

    test('fileContent falls back across the known columns', () => {
        expect(fileContent({about: 'a'})).toBe('a');
        expect(fileContent({content: 'c', about: 'a'})).toBe('c');
        expect(fileContent({})).toBe('');
        expect(fileContent(undefined)).toBe('');
    });

    test('pwd follows the tree when records arrive while inside the directory', () => {
        const entries = toEntries(projects, {child_type: CHILD_TYPE.FILE});
        const state = run([updatePWD({path: 'root/projects'}), projectsSuccess(entries)]);
        expect(state.pwdPath).toBe('root/projects');
        expect(Object.keys(state.pwd.children)).toEqual(['site', 'bot']);
        expect(resolvePath(state.dirRoot, 'root/projects')).toEqual(state.pwd);
        expect(resolvePath(state.dirRoot, 'root/nope')).toBe(state.dirRoot);
    });
});
