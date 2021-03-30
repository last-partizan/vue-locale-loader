module.exports = function (source) {
  const {resource, rootContext} = this;
  const name = resource.replace(rootContext + "/", "").replace(".vue", ".yml");

  if (isWhitelisted(resource) && source.includes("$t(")) {
    return `${source}
<i18n src="@locale/ru/${name}" locale="ru" lang="yml"></i18n>
<i18n src="@locale/en/${name}" locale="en" lang="yml"></i18n>`;
  } else {
    return source;
  }
}

const whitelist = [
  ".vue",
];

function isWhitelisted(name) {
  return Boolean(whitelist.find(entry => name.includes(entry)));
}
