export const structure = {
    "root": {
        "type": "dir",
        "children": {
            "projects": {
                "type": "dir",
                "children": {
                    "project1": {
                        "type": "file"
                    },
                    "project2": {
                        "type": "file"
                    },
                    "project3": {
                        "type": "file"
                    }
                }
            },
            "blog": {
                "type": "dir",
                "children": {
                    "blog1": {
                        "type": "file"
                    },
                    "blog2": {
                        "type": "file"
                    },
                    "blog3": {
                        "type": "file"
                    }
                }
            },
            "about": {
                "type": "file",
                "editable": false,
                "content": "about content"
            },
            "links": {
                "type": "file",
                "editable": false,
                "content": "about Links"
            }
        }
    }
}