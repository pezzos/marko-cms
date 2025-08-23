import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import posthtml from "posthtml";

const glossaryPath = path.join("src", "data", "glossary.yml");
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

  return {
    dir: {
      input: "src",
      output: "dist"
    }
  };
}
