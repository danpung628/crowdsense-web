import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: "홈", icon: "🏠" },
    { path: "/crowd", label: "인파", icon: "👥" },
    { path: "/transit", label: "교통", icon: "🚇" },
    { path: "/parking", label: "주차", icon: "🅿️" },
  ];

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link to="/" className="text-xl font-bold hover:text-blue-200">
            CrowdSense
          </Link>

          {/* 메뉴 */}
          <div className="flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded transition ${
                  isActive(item.path)
                    ? "bg-blue-700 font-semibold"
                    : "hover:bg-blue-500"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
