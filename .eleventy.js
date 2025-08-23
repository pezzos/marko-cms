export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("static");

  eleventyConfig.addFilter("rssDate", (dateObj) => dateObj.toUTCString());
  eleventyConfig.addFilter("absoluteUrl", (path, base) => new URL(path, base).toString());

  return {
    dir: {
      input: "src",
      output: "dist"
    }
  };
}
