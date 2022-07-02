import path from 'path'

async function turnPizzasIntoPages({ graphql, actions }) {
  // get a template for this page
  const pizzaTemplate = path.resolve('./src/templates/Pizza.js')
  // query all pizzas
  const { data } = await graphql(`
    query {
      pizzas: allSanityPizza {
        nodes {
          name
          slug {
            current
          }
        }
      }
    }
  `)

  // loop over each pizza and crate a page for that pizza
  data.pizzas.nodes.forEach(pizza => {
    console.log('Creating a page  for ', pizza.name)

    actions.createPage({
      //what is the URL for this new page??
      path: `pizza/${pizza.slug.current}`,
      component: pizzaTemplate,
      context: {
        slug: pizza.slug.current,
      }
    })
  })
}

export async function createPages(params) {
  // create pages dynamically
  // pizzas
  await turnPizzasIntoPages(params)
  // toppings
  // slicemasters
}
