import mongoose from 'mongoose';

const reqStr = {
    type: String,
    default: '',
};

const bool = {
    type: Boolean,
    default: false,
};

const defaultStr = {
    type: String,
    default: '',
};

const reportSchema = new mongoose.Schema({
    // missionNumber: {
    //     type: Number,
    //     required: true,
    //     unique: true,
    // },
    // firstResponders: {
    //     type: Array,
    //     default: [],
    // },
    // patientInfo: {
    //     age: {
    //         type: Number,
    //         required: true,
    //     },
    //     gender: {
    //         type: String,
    //         enum: ['Male', 'Female', 'Other'],
    //         required: true,
    //     },
    //     firstName: reqStr,
    //     lastName: reqStr,
    //     IAM: reqStr,
    //     otherInfo: reqStr,
    // },
    // abcdeSchema: {
    //     criticalBleeding: {
    //         problem: bool,
    //         tourniquet: bool,
    //         tourniquetTime: defaultStr,
    //         manualCompression: bool,
    //     },
    //     airway: {
    //         problem: bool,
    //         airway: defaultStr,
    //         cervicalSpineTrauma: bool,
    //         esmarch: bool,
    //         guedel: bool,
    //         wendl: bool,
    //         absaugen: bool,
    //         stiffneck: bool,
    //     },
    //     breathing: {
    //         breathingSpeed: defaultStr,
    //         auskultationSeitengleich: bool,
    //         thorax: defaultStr,
    //         sauerStoffgabe: defaultStr,
    //         brille: bool,
    //         maske: bool,
    //         beatmungsbeutel: bool,
    //         assistierteBeatmung: bool,
    //         hyperventilationsmaske: bool,
    //         oberkörperhochlagerung: bool,
    //     },
    //     circulation: {
    //         problem: bool,
    //         pulsRegelmäßig: defaultStr,
    //         pulsTastbar: defaultStr,
    //         bpm: defaultStr,
    //         sys: defaultStr,
    //         dia: defaultStr,
    //         abdomen: defaultStr,
    //         becken: defaultStr,
    //         oberschenkel: defaultStr,
    //         ecgImage: defaultStr,
    //         spO2: defaultStr,
    //         bloodSugar: defaultStr,
    //     },
    //     disability: {
    //         problem: bool,
    //         dmsExtremitäten: bool,
    //         durchblutung: bool,
    //         motorik: bool,
    //         sensorik: bool,
    //         avpu: defaultStr,
    //         bewegungRight: defaultStr,
    //         bewegungLeft: defaultStr,
    //         pupillenRight: defaultStr,
    //         fastProblem: bool,
    //         arms: bool,
    //         time: bool,
    //         speech: bool,
    //         face: bool,
    //         pupillenRightLicht: bool,
    //         pupillenLeftLicht: bool,
    //     },
    //     exposureEnvironment: {
    //         problem: bool,
    //         wärmeerhalt: bool,
    //         schmerzskala: {
    //             type: Number,
    //             default: 0,
    //         },
    //         weitereVerletzungen: defaultStr,
    //         wundversorgung: bool,
    //         extremitätenschienung: bool,
    //         bodycheck: bool,
    //         bodyDiagramLetters: {
    //             type: Array,
    //             default: [],
    //         },
    //     },
    // },
    // samplerSchema: {
    //     symptoms: {
    //         text: defaultStr,
    //         erhoben: bool,
    //     },
    //     allergies: {
    //         text: defaultStr,
    //         erhoben: bool,
    //     },
    //     medications: {
    //         text: defaultStr,
    //         medicineHasImage: bool,
    //         medicineListImage: defaultStr,
    //         erhoben: bool,
    //     },
    //     pastMedicalHistory: {
    //         text: defaultStr,
    //         erhoben: bool,
    //     },
    //     lastOralIntake: {
    //         type: defaultStr,
    //         time: defaultStr,
    //         erhoben: bool,
    //         details: defaultStr
    //     },
    //     events: {
    //         text: defaultStr,
    //         erhoben: bool,
    //     },
    //     riskFactors: {
    //         text: defaultStr,
    //         erhoben: bool,
    //     },
    // },
    // archived: {
    //     type: Boolean,
    //     default: false,
    // },

    missionNumber: {
        type: Number,
        required: true,
    },
    firstResponders: {
        type: Array,
        default: [],
    },
    patientInfo: {
        age: {
            type: Number,
            required: true,
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other'],
            required: true,
        },
        firstName: reqStr,
        lastName: reqStr,
        IAM: reqStr,
        otherInfo: reqStr,
    },
    abcdeSchema: {
        type: Object,
        required: true,
    },
    samplerSchema: {
        type: Object,
        required: true,
    },
    archived: {
        type: Boolean,
        default: false,
    },
});

const Report = mongoose.model('Report', reportSchema);

export default Report;