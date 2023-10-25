const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const config = {
  mode: 'production',
  entry: './src/index.jsx',
  devtool: 'inline-source-map',
  devServer: {
    allowedHosts: 'all',
    compress: true,
    port: 3000,
    open: true,
    historyApiFallback: true,
    https: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          plugins: [
            ['@babel/plugin-transform-runtime',
              {
                regenerator: true,
              },
            ],
            require.resolve('@babel/plugin-transform-flow-strip-types'),
            require.resolve('@babel/plugin-proposal-class-properties'),
            require.resolve('@babel/plugin-proposal-export-default-from'),
            require.resolve('@babel/plugin-proposal-export-namespace-from'),
            require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
            require.resolve('@babel/plugin-proposal-optional-chaining'),
          ],
          presets: [
            require.resolve('@babel/preset-env'),
            require.resolve('@babel/preset-flow'),
            require.resolve('@babel/preset-react'),
          ],
        },
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: true,
            },
          },
          'css-loader',
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          process.env.NODE_ENV !== 'production'
            ? 'style-loader'
            : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: process.env.NODE_ENV !== 'production',
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: process.env.NODE_ENV !== 'production',
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[contenthash].[ext]',
            outputPath: 'images/',
          },
        }],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      WEB_COMPONENT_API_ENDPOINT: JSON.stringify(process.env.WEB_COMPONENT_API_ENDPOINT),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    }),
    new HtmlWebPackPlugin({
      template: 'index.html',
      filename: 'index.html',
      inject: 'body',
      scriptLoading: 'defer',
      wcScript: `<script type="text/javascript">window.WEB_COMPONENT_API_ENDPOINT="${process.env.WEB_COMPONENT_API_ENDPOINT}";</script><script id="webComponents" defer src="${process.env.WEB_COMPONENT_ENDPOINT}?with=products,menu-user&version=latest&project=kpaste"></script>`,
    }),
  ],
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(process.cwd(), 'dist'),
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        default: false,
        defaultVendors: false,
        // vendor chunk
        vendor: {
          // name of the chunk
          name: 'vendor',
          // async + async chunks
          chunks: 'all',
          // import file path containing node_modules
          test: /node_modules/,
          // priority
          priority: 20,
        },
        // common chunk
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'async',
          priority: 10,
          reuseExistingChunk: true,
          enforce: true,
        },
      },
    },
  },
};

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    config.devtool = false;
    config.plugins = [new CleanWebpackPlugin(),
      new CopyPlugin({
        patterns: [
          {
            from: './public',
            to: '',
          },
        ],
      })].concat(config.plugins);
    config.optimization.minimize = true;

    config.plugins.push(new TerserPlugin());
  }

  return config;
};
