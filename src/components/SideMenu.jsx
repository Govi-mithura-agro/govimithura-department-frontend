import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Menu, ConfigProvider } from "antd";
import GovimithuraLogo from "../assets/govimithura_logo.svg";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem("Dashboard", "/", <Icon icon="material-symbols:dashboard-outline" />),
  getItem(
    "Farmers",
    "/farmers",
    <Icon icon="fluent-emoji-high-contrast:farmer" />
  ),
  getItem("Warehouses", "sub3", <Icon icon="ph:plant-fill" />, [
    getItem("Insights", "/insights"),
    getItem("Warehouses List", "/warehouseslist"),
    getItem("Fertilizer Requests", "/fertilizerrequests"),
  ]),
  getItem("Mangers", "/managers", <Icon icon="clarity:employee-solid" />),
];

const rootSubmenuKeys = [
  "sub1",
  "sub2",
  "sub3",
  "sub4",
  "sub5",
  "sub6",
  "sub7",
];

function SideMenu() {
  const location = useLocation();
  const navigate = useNavigate();
  const [openKeys, setOpenKeys] = useState(["/admin"]);
  const [selectedKeys, setSelectedKeys] = useState("/admin");

  useEffect(() => {
    const pathName = location.pathname;
    setSelectedKeys(pathName);
  }, [location.pathname]);

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  return (
    <div className="bg-white h-[calc(100vh-30px)] w-fit m-[0] p-0 rounded-[8px] flex flex-col justify-start items-center">

      <img src={GovimithuraLogo} alt="logo" />
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              iconSize: "21px",
              itemHeight: "50px", // Increase item height to add more gap
              subMenuItemBg: "#ffffff",
              itemPadding: "10px 24px", // Customize padding for additional spacing
              itemSelectedBg: "#E7FFE6", // Background color of selected item
              itemSelectedColor: "#0C6C41", // Text color of selected item
            },
          },
        }}
      >
        <Menu
          mode="inline"
          openKeys={openKeys}
          selectedKeys={[selectedKeys]}
          onOpenChange={onOpenChange}
          onClick={(item) => {
            navigate(item.key);
          }}
          style={{
            width: 256,
            height: "100%",
            backgroundColor: "#ffffff", // Ensure menu background is white
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "400",
          }}
          items={items}
        />
      </ConfigProvider>
    </div>
  );
}

export default SideMenu;
