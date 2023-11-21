const path = require('path');

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                include: [path.resolve(__dirname, 'src')]
            },
            {
                test: /\.(obj|glsl)$/,
                type: 'asset/source'
            }
        ]
    },
    resolve:{
        extensions: ['.ts', '.js', 'obj', '.glsl'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public')
    }
}