import vuePlugin from "rollup-plugin-vue";

export default {
  input: "./src/App.vue",
  output: {
    name: "vue",
    format: "es",
    file: "lib/mini-vue.esm.js",
  },
  plugins: [vuePlugin()],
};
