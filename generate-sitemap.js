const fs = require("fs");
const path = require("path");
const { SitemapStream, streamToPromise } = require("sitemap");

const hostname = "https://home-puce-kappa.vercel.app";

const sitemap = new SitemapStream({ hostname });

const files = fs.readdirSync(__dirname);

const htmlFiles = files.filter(
  (file) => file.toLowerCase().endsWith(".html")
);

for (const file of htmlFiles) {
  let url;

  if (file.toLowerCase() === "index.html") {
    url = "/";
  } else {
    url = "/" + encodeURIComponent(file);
  }

  sitemap.write({
    url,
    changefreq: "weekly",
    priority: file.toLowerCase() === "index.html" ? 1.0 : 0.7,
  });
}

sitemap.end();

streamToPromise(sitemap)
  .then((data) => {
    fs.writeFileSync(
      path.join(__dirname, "sitemap.xml"),
      data
    );

    console.log("Sitemap created successfully!");
    console.log(`Found ${htmlFiles.length} HTML pages.`);
  })
  .catch((error) => {
    console.error("Error creating sitemap:", error);
  });