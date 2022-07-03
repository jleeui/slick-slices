import React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import styled from 'styled-components';

const ToppingsStyles = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 4rem;

  a {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 0 1rem;
    align-items: center;
    padding: 5px;
    background: var(--grey);
    border-radius: 2px;

    .count {
      background: white;
      padding: 2px 5px;
    }

    &[aria-current='page'] {
      background: var(--yellow);
    }
  }
`;

function countPizzasInToppings(pizzas) {
  // return the pizzas with counts
  console.log(pizzas);

  const counts = pizzas
    .map((pizza) => pizza.toppings)
    .flat()
    .reduce((acc, topping) => {
      // check if this is an exisiting topping
      const existingTopping = acc[topping.id];
      if (existingTopping) {
        // if it is, increment by 1
        existingTopping.count += 1;
      } else {
        // otherwise, create a new entry in our acc and set it to one
        acc[topping.id] = {
          id: topping.id,
          name: topping.name,
          count: 1,
        };
      }

      return acc;
    }, {});

  // sort them based on their count
  const sortedToppings = Object.values(counts).sort(
    (a, b) => b.count - a.count
  );

  return sortedToppings;
}

export default function ToppingsFitler({ activeTopping }) {
  // get a list of all the toppings
  // get a list of all the pizzas with their toppings
  const { toppings, pizzas } = useStaticQuery(graphql`
    query MyQuery {
      toppings: allSanityTopping {
        nodes {
          name
          id
          vegetarian
        }
      }
      pizzas: allSanityPizza {
        nodes {
          toppings {
            name
            id
          }
        }
      }
    }
  `);

  console.log({ toppings, pizzas });

  // count how many pizzas are in each toppings
  const toppingsWithCounts = countPizzasInToppings(pizzas.nodes);
  // link it up
  return (
    <ToppingsStyles>
      <Link to="/pizzas">
        <span className="name">All</span>
        <span className="count">{pizzas.nodes.length}</span>
      </Link>
      {
        // loop over the list of toppings and display the topping and the count of pizzas in that toping
        toppingsWithCounts.map((topping) => (
          <Link
            key={topping.id}
            to={`/topping/${topping.name}`}
            className={topping.name === activeTopping ? 'active' : ''}
          >
            <span className="name">{topping.name}</span>
            <span className="count">{topping.count}</span>
          </Link>
        ))
      }
    </ToppingsStyles>
  );
}
