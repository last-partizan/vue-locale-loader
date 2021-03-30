/**
 * @jest-environment node
 * https://webpack.js.org/contribute/writing-a-loader/#testing
 */
/* eslint-env node, jest */
import path from "path";
import webpack from "webpack";
import { createFsFromVolume, Volume } from "memfs";
import VueLoaderPlugin from "vue-loader/lib/plugin";

test("Inserts i18n blocks", async () => {
  const stats = await compiler("example.vue");
  const {modules} = stats.toJson({ source: true });

  // Количество модулей - 3, две локализации + 1 исходный файл
  expect(modules.length).toBe(3);
});


const compiler = (fixture, options = {}) => {
  const compiler = webpack({
    context: __dirname,
    entry: `./${fixture}`,
    output: {
      path: path.resolve(__dirname),
      filename: "bundle.js",
    },
    plugins: [
      new VueLoaderPlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: [
            "vue-loader",
            {
              loader: path.resolve(__dirname, "../src/vue-locale-loader.js"),
              options,
            },
          ],
        },
      ],
    },
    resolve: {
      alias: {
        "@locale": path.resolve(__dirname, "locale"),
      },
    },
  });

  compiler.outputFileSystem = createFsFromVolume(new Volume());
  compiler.outputFileSystem.join = path.join.bind(path);

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err);
      if (stats.hasErrors()) reject(stats.toJson().errors);

      resolve(stats);
    });
  });
};
