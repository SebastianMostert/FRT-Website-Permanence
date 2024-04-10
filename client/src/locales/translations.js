import enJson from './en/index';
import frJson from './fr/index';
import luJson from './lu/index';
import deJson from './de/index';

const translations = {
    ...enJson,
    ...frJson,
    ...luJson,
    ...deJson
};

console.log(translations)
export default translations