

# Portfolio

#### *overview*

This project was created to give perspective on:

- who I am🧔
- my work🦾
- my interests💻🎮🐎♟🎵

There are two **reasons** why this project was built with a **terminal** interface:
1. i love terminals
2. inspired by googles foobar.withgoogle secret screening process

#### *technologies*

- *frontend*:
  1. reactJs
  2. redux toolkit, react-redux
  3. css
  4. markdown
- *backend*:
  1. nodeJs
  2. expressJs
  3. mysql
- *infrastructure*:
  1. docker
  2. docker-compose
  3. adminer

#### *architecture*

- **CLI**: the main interactive user interface, consisting of two parts: *the input*, *the input log*.
- the CLI handles any input within the screen and passes it to the *CMD PROCESSOR*.
- **CMD PROCESSOR**: the application's core component, analyses inputs, creates and handles commands and triggers actions and state changers available from *the store*,
- The CMD PROCESSOR parses the input and creates a command, a command can simply be dir tree traversing, reading a file or listing a directory's content, etc.
- **The Reader**: a text-viewer emulator, its status is controlled by the store, in its core is a markdown library called: react-markdown.
- stored in the database: projects, blogs and log.

#### *how to use*
If you are familiar with the linux terminal It's very similar to, you can always type `help` or `!` for instructions.
#### thoughts
www.mishalai.com