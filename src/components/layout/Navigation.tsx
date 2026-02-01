import { Link } from '@tanstack/react-router';

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="px-4 py-4 md:px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4 md:space-x-6">
            <Link
              to="/"
              className="text-sm transition-colors"
              activeProps={{
                className: 'text-white border-b-2 border-white pb-1',
              }}
              inactiveProps={{
                className: 'text-gray-300 hover:text-white',
              }}
            >
              Home
            </Link>
            {/* Pricing - Commented out for pre-launch */}
            {/* <Link
              to="/pricing"
              className="text-sm transition-colors"
              activeProps={{
                className: 'text-white border-b-2 border-white pb-1',
              }}
              inactiveProps={{
                className: 'text-gray-300 hover:text-white',
              }}
            >
              Pricing
            </Link> */}
            <Link
              to="/about"
              className="text-sm transition-colors"
              activeProps={{
                className: 'text-white border-b-2 border-white pb-1',
              }}
              inactiveProps={{
                className: 'text-gray-300 hover:text-white',
              }}
            >
              About
            </Link>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Login - Commented out for pre-launch */}
            {/* <Link
              to="/home"
              className="text-sm text-gray-300 hover:text-white transition-colors px-3 py-2 md:px-4 min-h-[44px] touch-manipulation"
            >
              Login
            </Link> */}
            <Link
              to="/signup"
              className="text-sm bg-white text-black px-4 py-2.5 md:px-5 hover:bg-gray-200 transition-colors font-medium min-h-[44px] touch-manipulation"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
