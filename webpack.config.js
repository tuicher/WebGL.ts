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
            },
            {
                test: /\.(png|jpg|jpeg)$/,
                type: 'asset/resource'
            }
        ]
    },
    resolve:{
        extensions: ['.ts', '.js', '.obj', '.glsl', '.png', '.jpg', '.jpeg'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public'),
        assetModuleFilename: 'images/[hash][ext][query]' // Esta línea organiza tus assets en una carpeta 'images'.
    }
}
