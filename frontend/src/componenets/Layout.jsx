import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, showSidebar = false }) => { // this equals to 
// const Layout = (props) => {
//   const { children, showSidebar = false } = props; //In React, children is a special prop that contains whatever is nested between your component's opening and closing tags:
// }
  return (
   
    <div className="min-h-screen h-screen flex">
      {/* this means if showsidebar is true show sidebar component otherwise dont do anything there is no else */}
    
      {showSidebar && <Sidebar />}

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  
  );
};
export default Layout;