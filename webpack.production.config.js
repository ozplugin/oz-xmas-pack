const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

 module.exports = {
   entry: {
//        polyfills: './src/polyfills',
        index: './index.js',
        },
   output: {
    filename: 'ozxbundle.js',
    path: path.join(__dirname, '../../')+'/oz-xmas-pack/assets/js/',
   },
   mode: 'production',
   cache: false,
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
        use: [
          'style-loader',
          // MiniCssExtractPlugin.loader,
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
   plugins: [
    new BundleAnalyzerPlugin(),
    // new MiniCssExtractPlugin({
    //   filename: "[name].css",
    //   chunkFilename: "[id].oz_employee_profile_bundle.css",
      
    // }),
   ]
 };