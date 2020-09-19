export default (fullPath: string) => {
    if (fullPath == '/') return [fullPath];
    return fullPath.split('/').filter(path => path.length !== 0);
}