import pinnedProjects from "../content/projects.json";
import about from "../content/about";
import links from "../content/links";

// What kind of entries a directory may contain.
export const CHILD_TYPE = {
    MIXED: 0, // directories and files (the root)
    FILE: 1,  // files only (projects, blog: their entries come from the db)
};

// Columns a db row may use to carry a file's readable body, in order of preference.
// Projects use `about`, blogs use `content`; new tables can be added here without touching the CLI.
export const FILE_CONTENT_COLUMNS = ['content', 'about', 'body', 'description'];

// Entries bundled with the app (see scripts/pinned-projects.js); db rows are merged over them at runtime.
const fileEntries = (items) =>
    Object.fromEntries(items.map(item => [item.name, {...item, type: 'file', editable: false}]));

export const structure = {
    "root": {
        "type": "dir",
        "child_type": CHILD_TYPE.MIXED,
        "children": {
            "projects": {
                "type": "dir",
                "child_type": CHILD_TYPE.FILE,
                "children": fileEntries(pinnedProjects)
            },
            "blog": {
                "type": "dir",
                "child_type": CHILD_TYPE.FILE,
                "children": {}
            },
            "about": {
                "type": "file",
                "editable": false,
                "content": about
            },
            "links": {
                "type": "file",
                "editable": false,
                "content": links
            }
        }
    }
}
