// NavBar.js
import React, { useEffect, useState } from "react";
import { Dropdown, Space, Avatar, ConfigProvider, message } from "antd";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

function NavBar({ setIsAuthenticated }) {
  const [loggedUser, setLoggedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setLoggedUser(user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("scrollPosition");
    localStorage.removeItem("rememberedEmail");
    
    setIsAuthenticated(false);
    navigate("/login");
    message.success("Logged out successfully");
  };

  const items = [
    {
      label: <a href="/">Home</a>,
      key: "home",
    },
    {
      type: "divider",
    },
    {
      label: <a href="/userprofile">Profile</a>,
      key: "profile",
    },
    {
      type: "divider",
    },
    {
      label: (
        <div onClick={handleLogout} role="button" tabIndex={0} onKeyPress={(e) => e.key === 'Enter' && handleLogout()}>
          Log Out
        </div>
      ),
      key: "logout",
    }
  ];

  return (
    <div className="flex justify-end gap-[25px] items-center h-[51px] bg-white rounded-[11px] m-[15px] px-[15px]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        {/* Your SVG paths here */}
      </svg>
      <ConfigProvider
        theme={{
          components: {
            Dropdown: {
              colorText: "rgba(0, 0, 0, 0.87)",
              colorTextDisabled: "rgba(0, 0, 0, 0.16)",
              fontSize: 14,
            },
          },
        }}
      >
        <Dropdown 
          menu={{ items }} 
          trigger={["click"]}
          overlay={(
            <div className="bg-white p-4 rounded shadow-md">
              <p><strong>Name:</strong> {loggedUser?.name || 'Not available'}</p>
              <p><strong>Email:</strong> {loggedUser?.email || 'Not available'}</p>
              {/* Add more user details as needed */}
            </div>
          )}
        >
          <Space>
            <span>{loggedUser?.name || "Guest"}</span>
            <Avatar
              size="large"
              icon={<Icon icon="mdi:user" style={{ fontSize: "24px" }} />}
              src={loggedUser?.profilePic}
            />
          </Space>
        </Dropdown>
      </ConfigProvider>
    </div>
  );
}

export default NavBar;