import { useLocation, Link } from "wouter";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [location] = useLocation();

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <div
      className={`bg-white dark:bg-gray-900 w-64 shadow-lg fixed inset-y-0 left-0 z-30 transform transition duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 border-r border-gray-200 dark:border-gray-800 flex flex-col`}
    >
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-amber-gold rounded-md flex items-center justify-center mr-3">
          <img src="http://alero.dev/wp-content/uploads/2025/04/ARCH-ICON-BLACK-PNG1.png" alt="" className="w-10 h-10 object-contain inline-block"/>
          </div>
          <h1 className="font-semibold text-xl dark:text-white">ARCH</h1>
        </div>
        <button
          onClick={closeSidebar}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 dark:text-gray-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <nav className="mt-6 px-4 flex-1 overflow-y-auto">
        <div className="space-y-1">
          <Link 
            href="/"
            className={`group flex items-center px-2 py-2.5 text-sm font-medium rounded-2xl ${
              isActive("/")
                ? "bg-amber-gold/10 text-amber-gold"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`w-5 h-5 mr-3 ${
                isActive("/") ? "text-amber-gold" : "text-gray-500 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300"
              }`}
            >
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
              <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
            </svg>
            Dashboard
          </Link>
          <Link 
            href="/transactions"
            className={`group flex items-center px-2 py-2.5 text-sm font-medium rounded-2xl ${
              isActive("/transactions")
                ? "bg-amber-gold/10 text-amber-gold"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`w-5 h-5 mr-3 ${
                isActive("/transactions") ? "text-amber-gold" : "text-gray-500 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300"
              }`}
            >
              <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
              <path
                fillRule="evenodd"
                d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z"
                clipRule="evenodd"
              />
              <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" />
            </svg>
            Transactions
          </Link>
          <Link 
            href="/api-keys"
            className={`group flex items-center px-2 py-2.5 text-sm font-medium rounded-2xl ${
              isActive("/api-keys")
                ? "bg-amber-gold/10 text-amber-gold"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`w-5 h-5 mr-3 ${
                isActive("/api-keys") ? "text-amber-gold" : "text-gray-500 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300"
              }`}
            >
              <path
                fillRule="evenodd"
                d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 00-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 00.75-.75v-1.5h1.5A.75.75 0 009 19.5V18h1.5a.75.75 0 00.53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1015.75 1.5zm0 3a.75.75 0 000 1.5A2.25 2.25 0 0118 8.25a.75.75 0 001.5 0 3.75 3.75 0 00-3.75-3.75z"
                clipRule="evenodd"
              />
            </svg>
            API Keys & Webhooks
          </Link>
          <Link 
            href="/swap"
            className={`group flex items-center px-2 py-2.5 text-sm font-medium rounded-2xl ${
              isActive("/swap")
                ? "bg-amber-gold/10 text-amber-gold"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`w-5 h-5 mr-3 ${
                isActive("/swap") ? "text-amber-gold" : "text-gray-500 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300"
              }`}
            >
              <path
                fillRule="evenodd"
                d="M15.97 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 11-1.06-1.06l3.22-3.22H7.5a.75.75 0 010-1.5h11.69l-3.22-3.22a.75.75 0 010-1.06zm-7.94 9a.75.75 0 010 1.06l-3.22 3.22H16.5a.75.75 0 010 1.5H4.81l3.22 3.22a.75.75 0 11-1.06 1.06l-4.5-4.5a.75.75 0 010-1.06l4.5-4.5a.75.75 0 011.06 0z"
                clipRule="evenodd"
              />
            </svg>
            Swap
          </Link>
          <Link 
            href="/yield"
            className={`group flex items-center px-2 py-2.5 text-sm font-medium rounded-2xl ${
              isActive("/yield")
                ? "bg-amber-gold/10 text-amber-gold"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`w-5 h-5 mr-3 ${
                isActive("/yield") ? "text-amber-gold" : "text-gray-500 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300"
              }`}
            >
              <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z" />
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a3.833 3.833 0 001.72-.756c.712-.566 1.112-1.35 1.112-2.178 0-.829-.4-1.612-1.113-2.178a3.833 3.833 0 00-1.719-.756V6.334c.64.049 1.238.292 1.673.707l.88.66a.75.75 0 00.9-1.2l-.88-.66A4.032 4.032 0 0012.75 6z"
                clipRule="evenodd"
              />
            </svg>
            Yield Farming
          </Link>
          <Link 
            href="/settings"
            className={`group flex items-center px-2 py-2.5 text-sm font-medium rounded-2xl ${
              isActive("/settings")
                ? "bg-amber-gold/10 text-amber-gold"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`w-5 h-5 mr-3 ${
                isActive("/settings") ? "text-amber-gold" : "text-gray-500 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300"
              }`}
            >
              <path
                fillRule="evenodd"
                d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
                clipRule="evenodd"
              />
            </svg>
            Settings
          </Link>
        </div>
      </nav>

      <div className="border-t border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <img
              className="h-10 w-10 rounded-full"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User avatar"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Alex Morgan</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">alex@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
