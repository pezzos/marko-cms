const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const posthtml = require("posthtml");
const Image = require("@11ty/eleventy-img");
const { minify } = require("html-minifier-terser");
const site = require("./_data/site.json");
const { i18nPath, t } = require("./src/filters/i18n.js");

const glossaryPath = path.join("_data", "glossary.yml");
let glossary = {};
try {
  const file = fs.readFileSync(glossaryPath, "utf8");
  glossary = yaml.load(file) || {};
} catch {
  glossary = {};
}

function escapeRegExp(str) {
  return str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("static");
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets" });
  eleventyConfig.ignores.add("src/filters/**");

  const locales = site.locales;

  eleventyConfig.addFilter("i18nPath", (url, locale) =>
    i18nPath(url, locale, site.defaultLocale)
  );
  eleventyConfig.addFilter("t", (key, locale) =>
    t(key, locale, site.defaultLocale)
  );

  eleventyConfig.addGlobalData("eleventyComputed", {
    lang: (data) => {
      if (data.lang) return data.lang;
      const segments = (data.page?.filePathStem || "").split("/");
      const lang = segments[1];
      return locales.includes(lang) ? lang : site.defaultLocale;
    }
  });

  locales.forEach((loc) => {
    eleventyConfig.addCollection(loc, (collection) =>
      collection.getFilteredByGlob(`content/${loc}/**/*`)
    );
  });

  eleventyConfig.addNunjucksAsyncShortcode("image", async (src, alt, sizes) => {
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
    return Image.generateHTML(metadata, imageAttributes);
  });

  eleventyConfig.addFilter("rssDate", (dateObj) => dateObj.toUTCString());
  eleventyConfig.addFilter("absoluteUrl", (path, base) => new URL(path, base).toString());

  eleventyConfig.addFilter("excerpt", (text, words = 200) => {
    if (!text) return "";
    const content = text.replace(/<[^>]+>/g, "");
    return content.trim().split(/\s+/).slice(0, words).join(" ");
  });

  eleventyConfig.addFilter("urlKey", (url = "") => url.replace(/\/$/, ""));

  eleventyConfig.addCollection("search", (collection) =>
    collection.getAll().filter((item) => item.data.title && !item.data.excludeFromSearch)
  );

  eleventyConfig.addCollection("backlinks", (collection) => {
    const map = {};
    // For now, return empty map to avoid templateContent issues
    // The backlinks functionality can be implemented as a transform instead
    return map;
  });

  eleventyConfig.addTransform("glossary", function (content) {
    if (!this.outputPath || !this.outputPath.endsWith(".html")) return content;
    if (!Object.keys(glossary).length) return content;

    const pageUrl = (this.page?.url || "").replace(/\/$/, "");

    return posthtml([
      (tree) => {
        tree.match({ tag: "p" }, (p) => {
          for (const [term, href] of Object.entries(glossary)) {
            if (href.replace(/\/$/, "") === pageUrl) continue;

            const linkTerm = (nodes) => {
              let linked = false;
              const result = [];
              for (const node of nodes) {
                if (linked) {
                  result.push(node);
                  continue;
                }

                if (typeof node === "string") {
                  const regex = new RegExp(`(${escapeRegExp(term)})`, "i");
                  const match = node.match(regex);
                  if (match) {
                    const parts = node.split(regex);
                    for (const part of parts) {
                      if (!linked && regex.test(part)) {
                        result.push({ tag: "a", attrs: { href }, content: [part] });
                        linked = true;
                      } else if (part) {
                        result.push(part);
                      }
                    }
                    continue;
                  }
                  result.push(node);
                } else if (node.tag && !["code", "pre", "a"].includes(node.tag)) {
                  const processed = linkTerm(node.content || []);
                  node.content = processed;
                  if (processed.linked) linked = true;
                  result.push(node);
                } else {
                  result.push(node);
                }
              }
              result.linked = linked;
              return result;
            };

            p.content = linkTerm(p.content || []);
          }
          return p;
        });
      }
    ])
      .process(content, { sync: true })
      .html;
  });

  eleventyConfig.addTransform("htmlmin", async function (content) {
    if (
      process.env.NODE_ENV === "production" &&
      this.outputPath &&
      this.outputPath.endsWith(".html")
    ) {
      return minify(content, {
        collapseWhitespace: true,
        removeComments: true,
        useShortDoctype: true
      });
    }
    return content;
  });

  return {
    dir: {
      input: ".",
      includes: "src/_includes",
      data: "_data",
      output: "dist"
    }
  };
};