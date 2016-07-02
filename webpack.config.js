webpack = require('webpack');

module.exports = {
   entry: './src/index.js',
   output: {
     path: './dist',
     filename: 'd3-bdc.js'
   },
   module: {
     loaders: [
       {
         test: /\.js$/,
         exclude: /(node_modules|bower_components)/,
         loader: 'babel-loader',
         query: {
           presets: ['es2015'],
         }
       }
     ]
   }
 };
