import Navbar from "./Navbar.tsx";
import { FunctionComponent } from "preact";

type LayoutProps = {
  user?: {
    id: string;
    avatar_url: string;
    name: string;
  };
};
const Layout: FunctionComponent<LayoutProps> = ({ children, user }) => {
  return (
    <>
      <div class="flex max-w-6xl mx-auto flex-col py-2 min-h-screen">
        <Navbar user={user} />
        {children}
      </div>
    </>
  );
};

export default Layout;
