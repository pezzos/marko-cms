export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("static");
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets" });

  eleventyConfig.addFilter("rssDate", (dateObj) => dateObj.toUTCString());
  eleventyConfig.addFilter("absoluteUrl", (path, base) => new URL(path, base).toString());

  eleventyConfig.addFilter("excerpt", (text, words = 200) => {
    if (!text) return "";
    const content = text.replace(/<[^>]+>/g, "");
    return content.trim().split(/\s+/).slice(0, words).join(" ");
  });

  eleventyConfig.addCollection("search", (collection) =>
    collection.getAll().filter((item) => item.data.title && !item.data.excludeFromSearch)
  );

  return {
    dir: {
      input: "src",
      output: "dist"
    }
  };
}
