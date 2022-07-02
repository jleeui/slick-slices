var plugins = [{
      plugin: require('/Users/jlee/Documents/proj/gatsby/course/starter-files/gatsby/node_modules/gatsby-plugin-styled-components/gatsby-ssr'),
      options: {"plugins":[]},
    },{
      plugin: require('/Users/jlee/Documents/proj/gatsby/course/starter-files/gatsby/node_modules/gatsby-source-sanity/gatsby-ssr'),
      options: {"plugins":[],"projectId":"rc6g6wyk","dataset":"live","watchMode":true,"token":"skK7mCncHRlRjNsEsNpM5jkyytgGWPom8uKX8Q1iPhQBXwOKgoDMHWLteN6ppju5jFRfXNZa5mhxSe4Vv6LpHTDAmZIuVKzN7ZgMH8GM80HQBfNItpNW5CfawmBL1UXP139mzXXuY9MxDKOqUogey3dHzHoPN70wg99BKIbP1hQQF5zeKh1P"},
    },{
      plugin: require('/Users/jlee/Documents/proj/gatsby/course/starter-files/gatsby/gatsby-ssr'),
      options: {"plugins":[]},
    }]
// During bootstrap, we write requires at top of this file which looks like:
// var plugins = [
//   {
//     plugin: require("/path/to/plugin1/gatsby-ssr.js"),
//     options: { ... },
//   },
//   {
//     plugin: require("/path/to/plugin2/gatsby-ssr.js"),
//     options: { ... },
//   },
// ]

const apis = require(`./api-ssr-docs`)

// Run the specified API in any plugins that have implemented it
module.exports = (api, args, defaultReturn, argTransform) => {
  if (!apis[api]) {
    console.log(`This API doesn't exist`, api)
  }

  // Run each plugin in series.
  // eslint-disable-next-line no-undef
  let results = plugins.map(plugin => {
    if (!plugin.plugin[api]) {
      return undefined
    }
    const result = plugin.plugin[api](args, plugin.options)
    if (result && argTransform) {
      args = argTransform({ args, result })
    }
    return result
  })

  // Filter out undefined results.
  results = results.filter(result => typeof result !== `undefined`)

  if (results.length > 0) {
    return results
  } else {
    return [defaultReturn]
  }
}
