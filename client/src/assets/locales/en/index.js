const json = Object.assign({}, ...Object.values(
    import.meta.globEager('./**/*.json')
).map(x => x.default));

const translationsObj = {
    translation: json
}

export default translationsObj