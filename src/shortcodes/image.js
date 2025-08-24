const path = require("path");
const Image = require("@11ty/eleventy-img");

module.exports = async function imageShortcode(src, alt, sizes = "(max-width: 1600px) 100vw, 1600px") {
  const fullSrc = path.join("src", src);
  const metadata = await Image(fullSrc, {
    widths: [480, 768, 1024, 1600],
    formats: ["webp", "jpeg"],
    outputDir: "./dist/assets/img/",
    urlPath: "/assets/img/",
    cacheOptions: {
      directory: ".cache/img"
    }
  });

  const imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async"
  };

  return Image.generateHTML(metadata, imageAttributes, {
    whitespaceMode: "inline"
  });
};

