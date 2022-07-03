import { useState, useContext } from 'react'
import OrderContext from '../components/OrderContext'

export default function usePizza({ pizzas, inputs }) {
  //create some state to hold our order

  //we got rid of this line beacuse we moved useState up to the provider
  // const [order, setOrder] = useState([])

  //now we access both our state and our updater function (setOrder) via context
  const [order, setOrder] = useContext(OrderContext)

  //make a function to add things to order
  function addToOrder(orderedPizza) {
    setOrder([...order, orderedPizza])
  }

  //make a function to remove things from order
  function removeFromOrder(index) {
    setOrder([
      //everything before the item we want to remove
      ...order.slice(0, index),

      //everything after the item we want to remove
      ...order.slice(index + 1)
    ])
  }
  //send this data the a serverless function when they check out

  return {
    order,
    addToOrder,
    removeFromOrder,
  }
}
