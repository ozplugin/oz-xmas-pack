const path = require('path');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

 module.exports = smp.wrap({
   entry: {
        index: './index.js',
        },
   output: {
     filename: 'ozxbundle.js',
     path: path.join(__dirname, '../../')+'/oz-xmas-pack/assets/js/',
   },
   watch: true,
   optimization: {
    minimize: false
  },
  cache: true,
   devtool: 'eval-cheap-module-source-map',
   module: {
        rules: [

     {
       test: /\.js$/,
       exclude: /node_modules/,
       use: [{
           loader: "babel-loader",
           options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: ["@babel/plugin-transform-runtime"],
           }
        }],
     },
      {
       test: /\.s[ac]ss$/i,
       exclude: /node_modules/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
       test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
     ],
   },
 });