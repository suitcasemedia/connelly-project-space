const { DateTime } = require("luxon");
const slugify = require("slugify");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("CNAME");

  // ✅ Add date filter
  eleventyConfig.addFilter("date", dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("MMMM d, yyyy");
  });

  // ✅ Add slug filter
  eleventyConfig.addFilter("slug", function(input) {
    return slugify(input, { lower: true, remove: /[*+~.()'"!:@]/g });
  });

  // ✅ Categories collection
  eleventyConfig.addCollection("categories", function(collectionApi) {
    const categoriesSet = new Set();
    collectionApi.getAll().forEach(item => {
      const cats = item.data.categories;
      if (cats) {
        (Array.isArray(cats) ? cats : [cats]).forEach(c => categoriesSet.add(c));
      }
    });
    return [...categoriesSet];
  });

  // ✅ Archives collection
  eleventyConfig.addCollection("archives", function(collectionApi) {
    const years = new Set();
    collectionApi.getAllSorted().forEach(item => {
      if (item.date) years.add(item.date.getFullYear());
    });
    return [...years].sort().reverse();
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site"
    }
  };
};
