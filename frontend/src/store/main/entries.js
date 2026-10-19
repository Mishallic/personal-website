import {CHILD_TYPE, FILE_CONTENT_COLUMNS} from "../structure";

/** Readable body of a file entry, whichever db column carries it. */
export const fileContent = (entry) => {
    if (!entry) return '';
    for (const column of FILE_CONTENT_COLUMNS)
        if (typeof entry[column] === 'string') return entry[column];
    return '';
};

/** Entry type of a record: dictated by the parent directory's child_type, otherwise by the record. */
export const entryType = (record, parentDir) => {
    if (parentDir?.child_type === CHILD_TYPE.FILE) return 'file';
    return record?.type === 'dir' ? 'dir' : 'file';
};

/** Turn db records into a children map keyed by name; every file gets a normalised `content`. */
export const toEntries = (records, parentDir) => {
    const entries = {};
    for (const record of records || []) {
        if (!record || typeof record.name !== 'string' || !record.name) continue;
        const type = entryType(record, parentDir);
        entries[record.name] = type === 'file'
            ? {...record, type, content: fileContent(record)}
            : {...record, type, children: record.children || {}};
    }
    return entries;
};

/** Walk a path such as "root/projects" from the root dir; falls back to root if a segment is missing. */
export const resolvePath = (root, path) => {
    let dir = root;
    for (const segment of (path || 'root').split('/').slice(1)) {
        const next = dir?.children?.[segment];
        if (!next || next.type !== 'dir') return root;
        dir = next;
    }
    return dir;
};
