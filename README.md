# vue-locale-loader


Add this to `webpack.config.js`, `module.rules` section.

```js
        {
          test: /\.vue$/,
          use: [
            {
              loader: "vue-loader",
              options: {
                appendTsSuffixTo: [/\.vue$/],
              },
            },
            {
              loader: path.resolve("src/vue-locale-loader.js"),
            },
          ],
        },
```
