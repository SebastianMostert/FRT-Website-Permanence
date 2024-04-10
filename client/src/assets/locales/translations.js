import enJson from './en/index';
import frJson from './fr/index';
import luJson from './lu/index';
import deJson from './de/index';

const translations = {
    en: { ...enJson },
    fr: { ...frJson },
    de: { ...deJson },
    lu: { ...luJson },
};

export default translations