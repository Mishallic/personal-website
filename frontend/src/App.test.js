import {act, render, screen, fireEvent, waitFor, within} from '@testing-library/react';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import mainReducer from './store/main/mainSlice';
import App from './App';
import pinned from './content/projects.json';

// react-markdown and its remark plugins ship as ESM only, which CRA's jest does not transform.
jest.mock('react-markdown', () => ({children}) =>
    require('react').createElement('div', {'data-testid': 'markdown'}, children));
jest.mock('remark-gfm', () => () => null);

// Projects carry their body in `about`, blogs in `content`: both must read the same in the CLI.
const rows = {
    '/projects?n=5': {data: [{name: 'portfolio', about: 'terminal styled site'}]},
    '/blogs?n=5': {data: [{name: 'first-post', content: 'hello world'}]},
};

// Renders the app and lets the start-up metadata fetches settle.
const renderApp = async () => {
    const store = configureStore({reducer: {main: mainReducer}});
    render(<Provider store={store}><App/></Provider>);
    await waitFor(() => expect(store.getState().main.dirRoot.children.projects.children.portfolio).toBeDefined());
    await waitFor(() => expect(store.getState().main.dirRoot.children.blog.children['first-post']).toBeDefined());
    return store;
};

const input = () => screen.getByRole('textbox', {name: 'command'});
// Submitting a command may trigger fetches; the async act flushes their dispatches.
const type = (text) => act(async () => {
    fireEvent.change(input(), {target: {value: text}});
    fireEvent.keyDown(input(), {key: 'Enter'});
});
const press = (key) => fireEvent.keyDown(input(), {key});
const click = (element) => act(async () => {
    fireEvent.click(element);
});

beforeEach(() => {
    global.fetch = jest.fn((url) => {
        const body = rows[url];
        return Promise.resolve({text: () => Promise.resolve(body ? JSON.stringify(body) : '')});
    });
    jest.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(() => {
    delete global.fetch;
    console.log.mockRestore();
});

test('renders the prompt and answers help', async () => {
    await renderApp();
    expect(screen.getByText(/mishal-alshomary\$/)).toBeInTheDocument();
    await type('help');
    expect(screen.getByText('cat <file>')).toBeInTheDocument();
    expect(screen.getByText('open a file in the reader')).toBeInTheDocument();
});

test('lists and reads db-backed entries whatever column holds their body', async () => {
    await renderApp();
    await type('cd projects');
    await type('ls');
    expect(screen.getByText(/portfolio/)).toBeInTheDocument();
    await type('cat portfolio');
    expect(screen.getByTestId('markdown')).toHaveTextContent('terminal styled site');

    await type('cd ..');
    await type('cd blog');
    await type('cat first-post');
    expect(screen.getByTestId('markdown')).toHaveTextContent('hello world');
});

test('arrow keys walk the command history and restore the draft', async () => {
    await renderApp();
    await type('help');
    await type('ls');
    fireEvent.change(input(), {target: {value: 'cd b'}});
    press('ArrowUp');
    expect(input()).toHaveValue('ls');
    press('ArrowUp');
    expect(input()).toHaveValue('help');
    press('ArrowUp'); // nothing older: stays
    expect(input()).toHaveValue('help');
    press('ArrowDown');
    expect(input()).toHaveValue('ls');
    press('ArrowDown');
    expect(input()).toHaveValue('cd b');
});

test('clicking the terminal keeps an existing text selection', async () => {
    await renderApp();
    await type('help');
    act(() => input().blur());
    const getSelection = window.getSelection;
    window.getSelection = () => ({toString: () => 'open a file'});
    fireEvent.click(screen.getByText('open a file in the reader'));
    expect(input()).not.toHaveFocus();
    window.getSelection = () => ({toString: () => ''});
    fireEvent.click(screen.getByText('open a file in the reader'));
    expect(input()).toHaveFocus();
    window.getSelection = getSelection;
});

test('pinned github projects are readable without a backend', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('offline')));
    const store = configureStore({reducer: {main: mainReducer}});
    render(<Provider store={store}><App/></Provider>);
    const first = pinned[0];
    expect(pinned.length).toBeGreaterThan(0);
    await type('cd projects');
    await type('ls');
    expect(screen.getByText(new RegExp(first.name))).toBeInTheDocument();
    await type(`cat ${first.name}`);
    expect(screen.getByTestId('markdown')).toHaveTextContent(first.url);
});

test('ls tells folders from files by style, without labels', async () => {
    await renderApp();
    await type('ls');
    expect(screen.getByText('projects')).toHaveClass('lsName', 'dir');
    expect(screen.getByText('blog')).toHaveClass('lsName', 'dir');
    expect(screen.getByText('about')).toHaveClass('lsName', 'file');
    expect(screen.getByText('links')).toHaveClass('lsName', 'file');
    expect(screen.queryByText('folder')).not.toBeInTheDocument();
});

test('GUI Version opens the desktop, which browses the same tree, and Terminal returns', async () => {
    const store = await renderApp();
    await click(screen.getByText('GUI Version'));
    expect(screen.queryByRole('textbox', {name: 'command'})).not.toBeInTheDocument();
    expect(screen.getByRole('dialog', {name: 'Home'})).toBeInTheDocument();
    expect(window.location.hash).toBe('#gui');

    await click(screen.getByRole('button', {name: 'Projects'}));
    expect(store.getState().main.pwdPath).toBe('root/projects');
    expect(screen.getByRole('dialog', {name: 'projects'})).toBeInTheDocument();
    await click(screen.getByRole('button', {name: 'portfolio'}));
    expect(screen.getByRole('dialog', {name: 'portfolio - Text Editor'})).toHaveTextContent('terminal styled site');
    await click(screen.getByRole('button', {name: 'close portfolio - Text Editor'}));
    expect(screen.queryByTestId('markdown')).not.toBeInTheDocument();

    const dock = within(screen.getByRole('navigation', {name: 'dock'}));
    await click(dock.getByRole('button', {name: 'About'}));
    expect(screen.getByTestId('markdown')).toHaveTextContent('Mishal AlShomary');
    await click(screen.getByRole('button', {name: 'close about - Text Editor'}));
    const desktopIcons = within(screen.getByTestId('desktop-icons'));
    await click(desktopIcons.getByRole('button', {name: 'About'}));
    expect(screen.getByTestId('markdown')).toHaveTextContent('Mishal AlShomary');
    await click(screen.getByRole('button', {name: 'Terminal'}));
    expect(screen.getByRole('textbox', {name: 'command'})).toBeInTheDocument();
    expect(window.location.hash).toBe('');

    await type('gui');
    expect(screen.getByRole('dialog', {name: 'projects'})).toBeInTheDocument();
    await click(screen.getByRole('button', {name: 'Terminal'}));
});

test('the footer About and the readme file describe this site', async () => {
    await renderApp();
    fireEvent.click(screen.getByText('About'));
    expect(screen.getByTestId('markdown')).toHaveTextContent('terminal interface');
    await type('quit');
    expect(screen.queryByTestId('markdown')).not.toBeInTheDocument();
    await type('cat readme');
    expect(screen.getByTestId('markdown')).toHaveTextContent('github.com/Mishallic/personal-website');
});

test('about, links, projects, blog and quit work as shortcuts from anywhere', async () => {
    const store = await renderApp();
    await type('cd projects');
    await type('about');
    expect(screen.getByTestId('markdown')).toHaveTextContent('Mishal AlShomary');
    await type('links');
    expect(screen.getByTestId('markdown')).toHaveTextContent('https://github.com/Mishallic');
    expect(screen.getByTestId('markdown')).toHaveTextContent('linkedin.com/in/mishal-alshomary');
    await type('quit');
    expect(screen.queryByTestId('markdown')).not.toBeInTheDocument();
    await type('blog');
    expect(store.getState().main.pwdPath).toBe('root/blog');
    await type('projects');
    expect(store.getState().main.pwdPath).toBe('root/projects');
});
