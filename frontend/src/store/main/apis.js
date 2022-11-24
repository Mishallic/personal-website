export function fetchLog(amount = 1) {
    const data = [
        {
            cmd: 'command1',
            time: '17-11-2022 01:25:11:20345',
            response: 'response1',
            user: 'mishal-alshomary',
        },
        {
            cmd: 'command2',
            time: '17-11-2022 01:25:11:20345',
            response: 'response2',
            user: 'mishal-alshomary',
        },
        {
            cmd: 'command3',
            time: '17-11-2022 01:25:11:20345',
            response: 'response3',
            user: 'mishal-alshomary',
        },
    ]
    return new Promise((resolve) =>
        setTimeout(() => resolve({data: data}), 100)
    );
}

export function addEntry(data) {
    const response = {statusCode: 201, message: 'successful'};
    return new Promise((resolve) =>
        setTimeout(() => resolve({data: response}), 100)
    );
}

export function fetchProjects() {
    return new Promise((resolve, reject) =>
        fetch("/projects?n=2")
            .then(response => response.text())
            .then(result => resolve(JSON.parse(result)))
            .catch(error => reject(error))
    );
}

export function fetchBlogs() {
    return new Promise((resolve, reject) =>
        fetch("/blogs?n=2")
            .then(response => response.text())
            .then(result => resolve(JSON.parse(result)))
            .catch(error => reject(error))
    );
}