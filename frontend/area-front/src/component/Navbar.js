import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../icon/fontawesome';

const Navbar = () => {
  return (
    <div class="navbar bg-base-100">
  <div class="navbar-start">
    <div class="dropdown">
      <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      </div>
      <ul
        tabindex="0"
        class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
        <li><a className="font-bold">Services</a></li>
        <li>
          <a className="font-bold">Log in</a>
        </li>
        <li><a className="font-bold">Get Start</a></li>
      </ul>
    </div>
    <FontAwesomeIcon icon={['fas', 'circle-nodes']} className="text-2xl text-gray-600" />
    <a class="btn btn-ghost text-xl">Flowfy</a>
  </div>
  <div class="navbar-center hidden lg:flex">
    <ul class="menu menu-horizontal px-1">
        <li><a className="font-bold">Services</a></li>
        <li>
          <a className="font-bold">Log in</a>
        </li>
        <li><a className="font-bold">Get Start</a></li>
    </ul>
  </div>
  <div class="navbar-end">
  <div class="avatar">
      <div class="w-10 rounded-full">
        <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
      </div>
    </div>
  </div>
</div>
  );
}

export default Navbar;