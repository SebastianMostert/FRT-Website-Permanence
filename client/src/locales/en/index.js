const json = Object.assign({}, ...Object.values(
    import.meta.globEager('./**/*.json')
).map(x => x.default));

const folderName = import.meta.url.split('/').slice(-2, -1)[0];
const translationsObj = {
    [folderName]: { translation: json }
}

export default translationsObj