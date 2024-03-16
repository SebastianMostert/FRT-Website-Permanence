// webpack.config.js
import Dotenv from 'dotenv-webpack'

export default {
    // Other webpack config settings
    plugins: [
        new Dotenv()
    ]
};