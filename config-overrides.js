const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CompressionPlugin = require('compression-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const zlib = require('zlib');

module.exports = function override(config, env) {
  const isProduction = env === 'production';
  
  // Only apply optimizations in production
  if (isProduction) {
    // Add Bundle Analyzer in CI mode (generates report without starting server)
    if (process.env.ANALYZE) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: 'bundle-report.html'
        })
      );
    }
    
    // Add compression plugins
    config.plugins.push(
      // Gzip
      new CompressionPlugin({
        filename: '[path][base].gz',
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
        minRatio: 0.8,
      }),
      // Brotli (better compression)
      new CompressionPlugin({
        filename: '[path][base].br',
        algorithm: 'brotliCompress',
        test: /\.(js|css|html|svg)$/,
        compressionOptions: {
          params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
          },
        },
        threshold: 10240,
        minRatio: 0.8,
      })
    );
    
    // Add service worker for caching and offline access
    config.plugins.push(
      new WorkboxWebpackPlugin.InjectManifest({
        swSrc: './public/service-worker.js',
        swDest: 'service-worker.js',
        exclude: [/\.map$/, /asset-manifest\.json$/],
      })
    );
    
    // Optimize CSS extraction
    const miniCssExtractPlugin = config.plugins.find(
      plugin => plugin.constructor.name === 'MiniCssExtractPlugin'
    );
    if (miniCssExtractPlugin) {
      miniCssExtractPlugin.options.chunkFilename = 'static/css/[name].[contenthash:8].chunk.css';
    }
    
    // Optimize chunk splitting
    config.optimization = {
      ...config.optimization,
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 20000,
        maxSize: 250000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              return `vendor.${packageName.replace('@', '')}`;
            },
            priority: 10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      },
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
              drop_console: true,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
          parallel: true,
          extractComments: false,
        }),
      ],
    };
  }
  
  return config;
}; 