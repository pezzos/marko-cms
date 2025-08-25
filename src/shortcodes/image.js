const path = require("path");
const Image = require("@11ty/eleventy-img");

module.exports = async function imageShortcode(src, alt, sizes = "(max-width: 768px) 100vw, 768px") {
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

  const sources = Object.values(metadata)
    .map(images => {
      const type = images[0].sourceType;
      const srcset = images.map(img => `${img.srcset} ${img.width}w`).join(", ");
      return `<source type="${type}" srcset="${srcset}" sizes="${sizes}">`;
    })
    .join("");

  const img = metadata.jpeg[metadata.jpeg.length - 1];
  const attrs = {
    src: img.url,
    width: img.width,
    height: img.height,
    alt,
    loading: "lazy",
    decoding: "async"
  };

  const attributes = Object.entries(attrs)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  return `<picture>${sources}<img ${attributes}></picture>`;
};
