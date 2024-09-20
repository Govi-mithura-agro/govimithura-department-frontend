import React, { useState, useEffect } from "react";
import {
  Modal,
  Input,
  Upload,
  Button,
  Table,
  Radio,
  Select,
  message,
  Popconfirm,
  Tag,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Search } = Input;
const { Option } = Select;

const ManagerManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedProvince, setSelectedProvince] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedDivision, setSelectedDivision] = useState("all");
  const [managerList, setManagerList] = useState([]);
  const [filteredManagerList, setFilteredManagerList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingManager, setEditingManager] = useState(null);

  // Form State
  const [managerId, setManagerId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [division, setDivision] = useState("");
  const [role, setRole] = useState("manager");
  const [status, setStatus] = useState("active");

  useEffect(() => {
    fetchManagerList();
  }, []);

  useEffect(() => {
    filterManagers();
  }, [
    searchKey,
    selectedRole,
    selectedProvince,
    selectedDistrict,
    selectedDivision,
    managerList,
  ]);

  const fetchManagerList = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/managers/getallmanagers"
      );
      setManagerList(response.data);
    } catch (error) {
      message.error("Failed to fetch managers");
    } finally {
      setIsLoading(false);
    }
  };

  const filterManagers = () => {
    let tempList = [...managerList];

    // Filter by search key (name, email, or managerId)
    if (searchKey) {
      tempList = tempList.filter(
        (item) =>
          item.name.toLowerCase().includes(searchKey.toLowerCase()) ||
          item.email.toLowerCase().includes(searchKey.toLowerCase()) ||
          item.managerId.toLowerCase().includes(searchKey.toLowerCase())
      );
    }

    // Filter by role (manager/admin)
    if (selectedRole !== "all") {
      tempList = tempList.filter((item) => item.role === selectedRole);
    }

    // Filter by province
    if (selectedProvince !== "all") {
      tempList = tempList.filter(
        (item) => item.address.province === selectedProvince
      );
    }

    // Filter by district
    if (selectedDistrict !== "all") {
      tempList = tempList.filter(
        (item) => item.address.district === selectedDistrict
      );
    }

    // Filter by division
    if (selectedDivision !== "all") {
      tempList = tempList.filter(
        (item) => item.address.division === selectedDivision
      );
    }

    setFilteredManagerList(tempList);
  };

  const handleModalOpen = (manager = null) => {
    if (manager) {
      setEditingManager(manager);
      setManagerId(manager.managerId);
      setName(manager.name);
      setEmail(manager.email);
      setDepartmentId(manager.departmentId);
      setPhoneNumber(manager.phoneNumber);
      setAddressLine(manager.address.addressLine);
      setProvince(manager.address.province);
      setDistrict(manager.address.district);
      setDivision(manager.address.division);
      setRole(manager.role);
      setStatus(manager.status || "active");
    } else {
      setEditingManager(null);
      resetForm();
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setManagerId("");
    setName("");
    setEmail("");
    setPassword("");
    setDepartmentId("");
    setPhoneNumber("");
    setAddressLine("");
    setProvince("");
    setDistrict("");
    setDivision("");
    setRole("manager");
    setStatus("active");
    setFileList([]);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSave = async () => {
    // Basic validation for required fields
    if (!name || !email || !phoneNumber || !addressLine || !province || !district || !division) {
      return message.error("Please fill all the required fields.");
    }
  
    // Prepare the manager data
    const managerData = {
      managerId,
      name,
      email,
      departmentId,
      phoneNumber,
      address: {
        addressLine,
        province,
        district,
        division,
      },
      role,
      status,
    };
  
    // Conditionally add the password if it is set
    if (password) {
      managerData.password = password;
    }
  
    try {
      if (editingManager) {
        // Editing existing manager
        await axios.post(`http://localhost:5000/api/managers/updatemanager/${editingManager._id}`, managerData);
        message.success("Manager updated successfully");
      } else {
        // Adding a new manager
        await axios.post("http://localhost:5000/api/managers/addmanagers", managerData);
        message.success("Manager added successfully");
      }
      handleModalClose(); // Close the modal
      fetchManagerList(); // Refresh the manager list
    } catch (error) {
      message.error(error.response?.data?.message || "An error occurred");
    }
  };
  

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/managers/deletemanager/${id}`
      );
      message.success("Manager deleted successfully");
      fetchManagerList();
    } catch (error) {
      message.error("Failed to delete manager");
    }
  };

  const handleSuspend = async (id, currentStatus) => {
    try {
      // Make the API call to toggle the manager's status
      const response = await axios.post(`http://localhost:5000/api/managers/togglemanagerstatus/${id}`);
      message.success(response.data.message);
      fetchManagerList(); // Refresh the manager list after suspension/activation
    } catch (error) {
      message.error("Failed to update manager status");
    }
  };
  

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Tooltip title={`ID: ${record.managerId}`}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Department ID",
      dataIndex: "departmentId",
      key: "departmentId",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (text) => (
        <Tag color={text === "admin" ? "gold" : "geekblue"}>
          {text ? text.toUpperCase() : "UNKNOWN"}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <Tag color={text === "active" ? "green" : "red"}>
          {text ? text.toUpperCase() : "UNKNOWN"}
        </Tag>
      ),
    },
    {
      title: "Province",
      dataIndex: ["address", "province"],
      key: "province",
    },
    {
      title: "District",
      dataIndex: ["address", "district"],
      key: "district",
    },
    {
      title: "Division",
      dataIndex: ["address", "division"],
      key: "division",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="space-x-2">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleModalOpen(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this manager?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} />
          </Popconfirm>
          <Popconfirm
            title={`Are you sure you want to ${
              record.status === "active" ? "suspend" : "activate"
            } this manager?`}
            onConfirm={() => handleSuspend(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<UserSwitchOutlined />} />
          </Popconfirm>
        </div>
      ),
    },

  ];

  const handleFileChange = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const handlePreview = (file) => {
    setPreviewImage(file.url || file.thumbUrl);
    setPreviewOpen(true);
  };

  const getUniqueValues = (field) => {
    const uniqueValues = managerList.map((manager) => manager.address[field]);
    return ["all", ...new Set(uniqueValues.filter(Boolean))]; // 'all' + unique values
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-5">
        <Search
          placeholder="Search by name, email, or ID"
          onSearch={(value) => setSearchKey(value)}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={() => handleModalOpen()}>
          Add Manager
        </Button>
      </div>

      <div className="mb-5 space-x-4">
        <Radio.Group
          onChange={(e) => setSelectedRole(e.target.value)}
          value={selectedRole}
        >
          <Radio.Button value="all">All Roles</Radio.Button>
          <Radio.Button value="manager">Manager</Radio.Button>
          <Radio.Button value="admin">Admin</Radio.Button>
        </Radio.Group>

        <Select
          style={{ width: 200 }}
          placeholder="Select Province"
          onChange={(value) => setSelectedProvince(value)}
          value={selectedProvince}
        >
          {getUniqueValues("province").map((province) => (
            <Option key={province} value={province}>
              {province}
            </Option>
          ))}
        </Select>

        <Select
          style={{ width: 200 }}
          placeholder="Select District"
          onChange={(value) => setSelectedDistrict(value)}
          value={selectedDistrict}
        >
          {getUniqueValues("district").map((district) => (
            <Option key={district} value={district}>
              {district}
            </Option>
          ))}
        </Select>

      </div>

      <Table
        columns={columns}
        dataSource={filteredManagerList}
        rowKey="_id"
        loading={isLoading}
      />

      <Modal
        title={editingManager ? "Edit Manager" : "Add Manager"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={handleModalClose}
        width={800}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input
              placeholder="Manager ID"
              value={managerId}
              onChange={(e) => setManagerId(e.target.value)}
              className="mb-2"
            />
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-2"
            />
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-2"
            />
            {!editingManager && (
              <Input.Password
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-2"
              />
            )}
            <Input
              placeholder="Department ID"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="mb-2"
            />
          </div>
          <div>
            <Input
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mb-2"
            />
            <Input
              placeholder="Address Line"
              value={addressLine}
              onChange={(e) => setAddressLine(e.target.value)}
              className="mb-2"
            />
            <Input
              placeholder="Province"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="mb-2"
            />
            <Input
              placeholder="District"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="mb-2"
            />
            <Input
              placeholder="Division"
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              className="mb-2"
            />
            <Select
              value={role}
              onChange={(value) => setRole(value)}
              style={{ width: "100%" }}
              className="mb-2"
            >
              <Option value="manager">Manager</Option>
              <Option value="admin">Admin</Option>
            </Select>
            <Select
              value={status}
              onChange={(value) => setStatus(value)}
              style={{ width: "100%" }}
            >
              <Option value="active">Active</Option>
              <Option value="suspended">Suspended</Option>
            </Select>
          </div>
        </div>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleFileChange}
        >
          {fileList.length >= 1 ? null : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
        <Modal
          open={previewOpen}
          footer={null}
          onCancel={() => setPreviewOpen(false)}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </Modal>
    </div>
  );
};

export default ManagerManagement;
