import path from 'path';
import fetch from 'isomorphic-fetch';

async function turnPizzasIntoPages({ graphql, actions }) {
  // get a template for this page
  const pizzaTemplate = path.resolve('./src/templates/Pizza.js');
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
  `);

  // loop over each pizza and crate a page for that pizza
  data.pizzas.nodes.forEach((pizza) => {
    console.log('Creating a page  for ', pizza.name);

    actions.createPage({
      // what is the URL for this new page??
      path: `pizza/${pizza.slug.current}`,
      component: pizzaTemplate,
      context: {
        slug: pizza.slug.current,
      },
    });
  });
}

async function turnToppingsIntoPages({ graphql, actions }) {
  // get a template for this page
  const toppingTemplate = path.resolve('./src/pages/pizzas.js');
  // query all pizzas
  const { data } = await graphql(`
    query {
      toppings: allSanityTopping {
        nodes {
          name
          id
        }
      }
    }
  `);

  // loop over each pizza and crate a page for that pizza
  data.toppings.nodes.forEach((topping) => {
    console.log('Creating a page  for ', topping.name);

    actions.createPage({
      path: `topping/${topping.name}`,
      component: toppingTemplate,
      context: {
        name: topping.name,
        toppingRegex: `/${topping.name}/i`,
      },
    });
  });
}

async function fetchBeersAndTurnIntoNodes({
  actions,
  createNodeId,
  createContentDigest,
}) {
  console.log('turn beers into nodes');
  // fetch list of beers
  const res = await fetch('https://api.sampleapis.com/beers/ale');
  const beers = await res.json();

  console.log(beers);

  // loop over each one
  for (const beer of beers) {
    // create a node for each beer
    const nodeMeta = {
      id: createNodeId(`beer-${beer.name}`),
      parent: null,
      children: [],
      internal: {
        type: 'Beer',
        mediaType: 'application/json',
        contentDigest: createContentDigest(beer),
      },
    };

    // create a node for each
    actions.createNode({
      ...beer,
      ...nodeMeta,
    });
  }
}

async function turnSlicemastersIntoPaginatedPages({ graphql, actions }) {
  // query all slicemasters
  const { data } = await graphql(`
    query {
      slicemasters: allSanityPerson {
        totalCount
        nodes {
          name
          id
          slug {
            current
          }
        }
      }
    }
  `);

  // turn each slicemasters into their own page
  data.slicemasters.nodes.forEach((person) => {
    console.log(`Creating page for ${person.name}`);

    const personTemplate = path.resolve('./src/templates/Slicemaster.js');

    actions.createPage({
      path: `slicemasters/${person.slug.current}`,
      component: personTemplate,
      context: {
        name: person.name,
        slug: person.slug.current,
      },
    });
  });

  // figure out how many pages there are based on how many slicemasters there are,
  // and how many per page
  const pageSize = parseInt(process.env.GATSBY_PAGE_SIZE);
  const pageCount = Math.ceil(data.slicemasters.totalCount / pageSize);

  console.log(
    `There are ${data.slicemasters.totalCount} total people. and we have ${pageCount} pages with ${pageSize} per page`
  );

  // loop from 1 to n and create the pages for them
  Array.from({ length: pageCount }).forEach((_, i) => {
    console.log(`Creating page ${i}`);

    actions.createPage({
      path: `slicemasters/${i + 1}`,
      component: path.resolve('./src/pages/slicemasters.js'),
      context: {
        skip: i * pageSize,
        currentPage: i + 1,
        pageSize,
      },
    });
  });
}

export async function sourceNodes(params) {
  // fetch a list of beers and source them into our gatsby API
  await Promise.all([fetchBeersAndTurnIntoNodes(params)]);
}

export async function createPages(params) {
  // create pages dynamically
  // wait for all promises to be resolved before finishing this function
  await Promise.all([
    // pizzas
    turnPizzasIntoPages(params),
    // toppings
    turnToppingsIntoPages(params),
    // slicemasters
    turnSlicemastersIntoPaginatedPages(params),
  ]);
}
