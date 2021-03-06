import { ShoppingCartIcon, LoginIcon } from '@heroicons/react/outline'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { logOut } from '../redux/user/userSlice'
const Header = () => {
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  return (
    <header className='sticky top-0 flex justify-between items-center h-24 bg-gray-800 text-white px-4 md:px-24 uppercase'>
      <Link to='/'>
        <div className='text-3xl hover:cursor-pointer'>A-Shop</div>
      </Link>
      <div className='flex items-center gap-12'>
        <div className='btn-hover flex justify-center items-center gap-2'>
          <div className='mr-6 italic text-gray-400'>
            {user.isAdmin && (
              <div className='flex items-center justify-center gap-3'>
                <Link to='/admin/products'>Products</Link>
                <Link to='/admin/users'>Users</Link>
              </div>
            )}
          </div>
          <Link to='/cart'>
            <div className='btn-hover flex justify-center items-center gap-2'>
              <ShoppingCartIcon className='h-5' />
              <p>Cart</p>
            </div>
          </Link>

          <div>
            {user.name ? (
              <div
                onClick={() => {
                  dispatch(logOut())
                  localStorage.removeItem('userInfo')
                }}
              >
                <p className='text-white'>{user.name}</p>
              </div>
            ) : (
              <Link to='/login'>
                <div className='btn-hover flex justify-center items-center gap-2'>
                  <LoginIcon className='h-5' />
                  <p>Login</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
