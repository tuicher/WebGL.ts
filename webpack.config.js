const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
    },
    plugins: [
        new HtmlWebpackPlugin({
            templateContent: `
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                    <style>
                        html, body {
                            margin: 0;
                            padding: 0;
                            overflow: hidden;
                        }
                        canvas {
                            display: block;
                        }
                    </style>
                </head>
                <body>
                    <canvas id="glCanvas"></canvas>
                </body>
                </html>
            `,
            filename: 'index.html'
        }),
    ]
}
