import { FaLock } from "react-icons/fa";
import { FaUnlock } from "react-icons/fa";
import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <div className="fixed top-0 left-0 h-screen w-20 flex flex-col bg-[#2A323C] shadow-lg">
      <Link to="/encrypt">
        <SideBarIcon icon={<FaLock size="25" />} text="Encrypt File" />
      </Link>
      <Link to="/decrypt">
        <SideBarIcon icon={<FaUnlock size="25" />} text="Decrypt File" />
      </Link>
    </div>
  );
};

const SideBarIcon = ({ icon, text }) => (
  <div className="sidebar-icon group hover:shadow-xl">
    {icon}
    <span className="sidebar-tooltip group-hover:scale-100 hover:shadow-md">
      {text}
    </span>
  </div>
);

export default SideBar;
