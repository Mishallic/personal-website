// Content of the `readme` file, also opened by the footer's About link. Markdown, rendered by the reader.
const readme = `# About this site

A portfolio with a terminal interface, built to give a perspective on who I am, my work and my
interests. Two reasons it is a terminal: I love terminals, and Google's foobar screening process
was an inspiration.

## ⌨️ How to use

It works like a Linux shell: \`ls\`, \`cd\`, \`cat\`, Tab completion and ↑ / ↓ history. Type \`help\` or
\`!\` for the full list. \`about\`, \`projects\`, \`blog\` and \`links\` jump straight to the right place.

## 🧰 Technologies

- **Front-end:** React, Redux Toolkit, plain CSS, markdown rendering with react-markdown
- **Back-end:** Node.js, Express, MySQL
- **Infrastructure:** Docker and Docker Compose for local development; Vercel for hosting, with the
  front-end as a static site and the API as a serverless function

## 🏗️ Architecture

- **CLI:** the interactive interface, made of the input line and the log of past commands. It
  captures every keystroke and hands submitted lines to the command processor.
- **Command processor:** parses the input, resolves it against the directory tree (\`cd\`, \`ls\`,
  \`cat\` and the shortcuts) and dispatches the resulting actions to the store.
- **Reader:** a text-viewer emulator on the right, driven by the store; renders markdown.
- **Store:** Redux Toolkit; holds the directory tree, the working directory, the command history
  queue and the reader state.
- **Content:** \`about\`, \`links\` and this page are bundled with the app; \`projects\` is generated
  from the repositories pinned on GitHub; blog posts come from the database when one is connected.

Source: [github.com/Mishallic/personal-website](https://github.com/Mishallic/personal-website)
`;

export default readme;
