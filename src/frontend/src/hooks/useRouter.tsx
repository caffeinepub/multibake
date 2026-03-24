import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface RouterContextType {
  pathname: string;
  search: string;
  navigate: (path: string) => void;
}

const RouterContext = createContext<RouterContextType>({
  pathname: "/",
  search: "",
  navigate: () => {},
});

export function RouterProvider({ children }: { children: ReactNode }) {
  const [pathname, setPathname] = useState(window.location.pathname);
  const [search, setSearch] = useState(window.location.search);

  useEffect(() => {
    const handler = () => {
      setPathname(window.location.pathname);
      setSearch(window.location.search);
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    setPathname(path.split("?")[0]);
    setSearch(path.includes("?") ? `?${path.split("?")[1]}` : "");
  };

  return (
    <RouterContext.Provider value={{ pathname, search, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  return useContext(RouterContext);
}

export function useNavigate() {
  const { navigate } = useContext(RouterContext);
  return navigate;
}

export function useSearchParams() {
  const { search } = useContext(RouterContext);
  return new URLSearchParams(search);
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: ReactNode;
}

export function Link({ to, children, onClick, ...props }: LinkProps) {
  const { navigate } = useContext(RouterContext);
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      navigate(to);
    }
  };
  return (
    <a href={to} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
