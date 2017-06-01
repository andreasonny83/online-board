const path = require('path');

const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const postcssUrl = require('postcss-url');
const cssnano = require('cssnano');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OfflinePlugin = require('offline-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const HtmlElementsPlugin = require('./config/html-elements-plugin');

const { NoEmitOnErrorsPlugin } = require('webpack');
const { GlobCopyWebpackPlugin } = require('@angular/cli/plugins/webpack');
const { CommonsChunkPlugin } = require('webpack').optimize;
const { AotPlugin } = require('@ngtools/webpack');

const nodeModules = path.join(process.cwd(), 'node_modules');
const genDirNodeModules = path.join(process.cwd(), 'src', '$$_gendir', 'node_modules');
const entryPoints = ["inline","polyfills","sw-register","styles","vendor","main"];
const minimizeCss = false;

const METADATA = {
  title: "Online Board",
  baseUrl: "/",
  description: "Create and share interactive retrospective boards online.",
  keywords: "Online board,Retrospective,Kanban,Scrum,Agile,Progressive WebApp,PWA",
  backgroundColor: "#00bcd4",
  url: "https://online-board.firebaseapp.com",
  thumbnail: "https://firebasestorage.googleapis.com/v0/b/online-board.appspot.com/o/oline-board.png?alt=media&token=7561b1f4-55ac-407e-9ff0-0196140f4c75",
};

const postcssPlugins = function () {
    // safe settings based on: https://github.com/ben-eb/cssnano/issues/358#issuecomment-283696193
    const importantCommentRe = /@preserve|@license|[@#]\s*source(?:Mapping)?URL|^!/i;
    const minimizeOptions = {
      autoprefixer: false,
      safe: true,
      mergeLonghand: false,
      discardComments: { remove: (comment) => !importantCommentRe.test(comment) }
    };

    return [
      postcssUrl({
        url: (URL) => {
          // Only convert root relative URLs, which CSS-Loader won't process into require().
          if (!URL.startsWith('/') || URL.startsWith('//')) {
            return URL;
          }

          // Dedupe multiple slashes into single ones.
          return URL.replace(/\/\/+/g, '/');
        }
      }),
      autoprefixer(),
  ].concat(minimizeCss ? [cssnano(minimizeOptions)] : []);
};

const config = {
  "devtool": "source-map",
  "resolve": {
    "extensions": [
      ".ts",
      ".js"
    ],
    "modules": [
      "./node_modules"
    ]
  },
  "resolveLoader": {
    "modules": [
      "./node_modules"
    ]
  },
  "entry": {
    "main": [
      "./src/main.ts"
    ],
    "polyfills": [
      "./src/polyfills.ts"
    ],
    "styles": [
      "./src/styles.scss"
    ]
  },
  "output": {
    "path": path.join(process.cwd(), "dist"),
    "filename": "[name].[chunkhash:20].bundle.js",
    "chunkFilename": "[id].[chunkhash:20].chunk.js"
  },
  "module": {
    "rules": [
      {
        "enforce": "pre",
        "test": /\.js$/,
        "loader": "source-map-loader",
        "exclude": [
          /\/node_modules\//
        ]
      },
      {
        "test": /\.json$/,
        "loader": "json-loader"
      },
      {
        "test": /\.html$/,
        "loader": "raw-loader"
      },
      {
        "test": /\.(eot|svg)$/,
        "loader": "file-loader?name=[name].[hash:20].[ext]"
      },
      {
        "test": /\.(jpg|png|gif|otf|ttf|woff|woff2|cur|ani)$/,
        "loader": "url-loader?name=[name].[hash:20].[ext]&limit=10000"
      },
      {
        "exclude": [
          path.join(process.cwd(), "src/styles.scss")
        ],
        "test": /\.css$/,
        "use": [
          "exports-loader?module.exports.toString()",
          {
            "loader": "css-loader",
            "options": {
              "sourceMap": false,
              "importLoaders": 1
            }
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "postcss",
              "plugins": postcssPlugins
            }
          }
        ]
      },
      {
        "exclude": [
          path.join(process.cwd(), "src/styles.scss")
        ],
        "test": /\.scss$|\.sass$/,
        "use": [
          "exports-loader?module.exports.toString()",
          {
            "loader": "css-loader",
            "options": {
              "sourceMap": false,
              "importLoaders": 1
            }
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "postcss",
              "plugins": postcssPlugins
            }
          },
          {
            "loader": "sass-loader",
            "options": {
              "sourceMap": false,
              "precision": 8,
              "includePaths": []
            }
          }
        ]
      },
      {
        "include": [
          path.join(process.cwd(), "src/styles.scss")
        ],
        "test": /\.scss$|\.sass$/,
        "use": ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              "loader": "css-loader",
              "options": {
                "sourceMap": false,
                "importLoaders": 1
              }
            },
            {
              "loader": "postcss-loader",
              "options": {
                "ident": "postcss",
                "plugins": postcssPlugins
              }
            },
            {
              "loader": "sass-loader",
              "options": {
                "sourceMap": false,
                "precision": 8,
                "includePaths": []
              }
            }
          ]
        })
      },
      {
        "test": /\.ts$/,
        "loader": "@ngtools/webpack"
      }
    ]
  },
  "plugins": [
    new NoEmitOnErrorsPlugin(),

    new GlobCopyWebpackPlugin({
      "patterns": [
        "assets",
        "favicon.png"
      ],
      "globOptions": {
        "cwd": "./src",
        "dot": true,
        "ignore": "**/.gitkeep"
      }
    }),

    new ProgressPlugin(),

    new HtmlWebpackPlugin({
      "template": "./src/index.template.sjs",
      "filename": "./index.html",
      "hash": false,
      "inject": true,
      "compile": true,
      "favicon": false,
      "minify": false,
      "cache": true,
      "showErrors": true,
      "chunks": "all",
      "excludeChunks": [],
      "xhtml": true,
      "title": METADATA.title,
      "metadata": METADATA,
      "chunksSortMode": function sort(left, right) {
        let leftIndex = entryPoints.indexOf(left.names[0]);
        let rightindex = entryPoints.indexOf(right.names[0]);
        if (leftIndex > rightindex) {
          return 1;
        }
        else if (leftIndex < rightindex) {
          return -1;
        }
        else {
          return 0;
        }
    }
    }),

    new ExtractTextPlugin("[name].[chunkhash:20].css"),

    new HtmlElementsPlugin({
      headTags: require('./config/head-config.common')
    }),

    new OfflinePlugin(),

    new CommonsChunkPlugin({
      "name": "inline",
      "minChunks": null
    }),

    new CommonsChunkPlugin({
      "name": "vendor",
      "minChunks": (module) => module.resource &&
                (module.resource.startsWith(nodeModules) || module.resource.startsWith(genDirNodeModules)),
      "chunks": [
        "main"
      ]
    }),

    new AotPlugin({
      "mainPath": "main.ts",
      "hostReplacementPaths": {
        "environments/environment.ts": process.env.NODE_ENV === 'production'
                                       ? "environments/environment.prod.ts"
                                       : "environments/environment.ts"
      },
      "exclude": [],
      "tsConfigPath": "src/tsconfig.app.json",
      "skipCodeGeneration": true
    }),

    new WebpackPwaManifest({
      "name": METADATA.title,
      "short_name": METADATA.title,
      "description": METADATA.description,
      "background_color": METADATA.backgroundColor,
      "start_url": "./?utm_source=web_app_manifest",
      "dir": "rtl",
      "lang": "en-US",
      "icons": [
        {
          "src": path.join(process.cwd(), "src/assets/icons/icon.png"),
          "sizes": [120, 152, 167, 180, 1024],
          "destination": path.join("icons", "ios")
        },
        {
          "src": path.join(process.cwd(), "src/assets/icons/icon.png"),
          "sizes": [32, 36, 48, 72, 96, 144, 192, 512],
          "destination": path.join("icons", "android")
        }
      ]
    }),

  ],
  "node": {
    "fs": "empty",
    "global": true,
    "crypto": "empty",
    "tls": "empty",
    "net": "empty",
    "process": true,
    "module": false,
    "clearImmediate": false,
    "setImmediate": false
  },
  "devServer": {
    "historyApiFallback": true,
    contentBase: 'src/',
  }
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push([
    // production only plugins
  ]);
}

module.exports = config;
