import {act, render, screen, fireEvent, waitFor} from '@testing-library/react';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import mainReducer from './store/main/mainSlice';
import App from './App';

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
    expect(screen.getByText(/Available commands/)).toBeInTheDocument();
});

test('lists and reads db-backed entries whatever column holds their body', async () => {
    await renderApp();
    await type('cd projects');
    await type('ls');
    expect(screen.getByText('portfolio')).toBeInTheDocument();
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
    window.getSelection = () => ({toString: () => 'Available commands'});
    fireEvent.click(screen.getByText(/Available commands/));
    expect(input()).not.toHaveFocus();
    window.getSelection = () => ({toString: () => ''});
    fireEvent.click(screen.getByText(/Available commands/));
    expect(input()).toHaveFocus();
    window.getSelection = getSelection;
});
