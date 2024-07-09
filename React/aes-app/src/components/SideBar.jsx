import { FaLock } from "react-icons/fa";
import { FaUnlock } from "react-icons/fa";
import { Link } from "react-router-dom";

const SideBar = () => 
{
  return (
    <div className="fixed top-0 left-0 h-screen w-20 flex flex-col bg-[#2A323C] shadow-lg">
      <Link to="/encrypt">
        <SideBarIcon icon={<FaLock size="25" />} />
      </Link>
      <Link to="/decrypt">
        <SideBarIcon icon={<FaUnlock size="25" />} />
      </Link>
    </div>
  );
};

const SideBarIcon = ({ icon, text }) => (
  <div className="sidebar-icon group hover:shadow-xl">
    {icon}
  </div>
);
  
export default SideBar;