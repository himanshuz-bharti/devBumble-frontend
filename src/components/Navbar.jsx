import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { removeUser } from '../utils/userSlice.js';
import { BASE_URL } from '../utils/constants.js';
import axios from 'axios';

const Navbar = () => {
  const user = useSelector((store)=>store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handlelogout = async () =>{
     try {
      const res = await axios.post(BASE_URL+'/logout',{},{withCredentials:true});
      dispatch(removeUser());
      navigate('/login');
     } catch (error) {
      console.error(error.message);
     }
  }
  return (
    <div className="navbar bg-base-100 shadow-sm">
  <div className="flex-1">
    <Link to='/' className="btn btn-ghost text-xl">devBumble</Link>
  </div>
  <div className="flex gap-2">
    <div className="dropdown dropdown-end">
      {user?(
        <div className='flex gap-2'>
        <p>Welcome,{user.firstname}</p>
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src={user.photourl}/>
        </div>
      </div>
      </div>):null}
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li>
          <Link to='/profile' className="justify-between">
            Profile
            
          </Link>
        </li>
        <li><a>Settings</a></li>
        <li><a onClick={handlelogout}>Logout</a></li>
        <li>
          <Link to='/connections' className="justify-between">
            Connections
          </Link>
        </li>
        <li>
          <Link to='/requests' className="justify-between">
            Requests
          </Link>
        </li>
      </ul>
    </div>
  </div>
</div>
  )
}

export default Navbar
