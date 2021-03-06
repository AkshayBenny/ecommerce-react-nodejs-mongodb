import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Rating from '../components/Rating'
import { useDispatch, useSelector } from 'react-redux'
import { getProduct } from '../redux/product/productSlice'
import ReactLoading from 'react-loading'
import { addToCart } from '../redux/cart/cartSlice'

const ProductPage = () => {
  const [quantity, setQuantity] = useState(1)

  const { pid } = useParams()
  // const product = products.find((product) => product._id === pid)
  const { product, isLoading, error } = useSelector((state) => state.product)
  const dispatch = useDispatch()

  const addToCartHandler = () => {
    const cartItems = {
      product: pid,
      quantity: quantity,
      price: product.price * quantity,
    }
    dispatch(addToCart({ cartItems }))
  }

  useEffect(() => {
    dispatch(getProduct(pid))
  }, [pid, dispatch])

  if (error) {
    return <div>Something went wrong...</div>
  }

  if (isLoading) {
    return (
      <div className='h-screen w-screen max-h-screen max-w-screen flex items-center'>
        <ReactLoading type={'bubbles'} color={'#6b7280'} className='mx-auto' />
      </div>
    )
  }

  if (product) {
    return (
      <div className='grid  lg:grid-cols-3'>
        <div>
          <img
            src={product?.image}
            alt={product?.name}
            className='w-full object-cover'
          />
        </div>
        <div>
          <h1 className=''>{product?.name}</h1>
          <hr />
          {product.rating && (
            <Rating
              rating={product.rating}
              text={`${product.numReviews} reviews`}
            />
          )}
          <hr />
          <h4>Price: {product.price}$</h4>
          <p>{product?.description}</p>
        </div>
        <div>
          <button
            onClick={() => {
              quantity > 1 ? setQuantity(quantity - 1) : setQuantity(quantity)
            }}
          >
            -
          </button>
          <p>{quantity}</p>
          <button
            onClick={() => {
              quantity < product.countInStock
                ? setQuantity(quantity + 1)
                : setQuantity(quantity)
            }}
          >
            +
          </button>
        </div>
        <div>
          <button
            disabled={product.countInStock === 0}
            className='bg-black text-white px-4 py-2 hover:text-gray-300 transition disabled:bg-gray-700 disabled:cursor-not-allowed'
            onClick={addToCartHandler}
          >
            Add to cart
          </button>
        </div>
      </div>
    )
  } else {
    return <div>Product not found</div>
  }
}

export default ProductPage
