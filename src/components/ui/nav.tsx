import { memo } from "react";
import { Link } from "react-router";

/**
 * Navbar component
 */
export const Navbar = memo(() => (
  <nav className="bg-white shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex">
          <div className="flex-shrink-0 flex items-center sm:ml-6 sm:flex sm:space-x-8">
            <Link to="/" className="px-3 py-2 text-sm font-medium">
              Builder
            </Link>
            <Link to="/execution-log" className="px-3 py-2 text-sm font-medium">
              Execution Log
            </Link>
          </div>
        </div>
      </div>
    </div>
  </nav>
));
