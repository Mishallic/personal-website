const entered = (pre, post) => {
    const diff = post.replace(pre, '');
    return diff === '\n';
}

export default entered;