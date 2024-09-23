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
  Typography,
  Layout,
  Card,
  Space,
  Row,
  Col,
  Statistic,
  Divider
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserSwitchOutlined,
  SearchOutlined,
  TeamOutlined,
  SolutionOutlined,
  UserOutlined,
  UserAddOutlined
} from "@ant-design/icons";
import axios from "axios";

const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;
const { Header, Content } = Layout;

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

  const totalManagers = filteredManagerList.length;
  const activeManagers = filteredManagerList.filter(m => m.status === "active").length;
  const suspendedManagers = totalManagers - activeManagers;

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

    if (searchKey) {
      tempList = tempList.filter(
        (item) =>
          item.name.toLowerCase().includes(searchKey.toLowerCase()) ||
          item.email.toLowerCase().includes(searchKey.toLowerCase()) ||
          item.managerId.toLowerCase().includes(searchKey.toLowerCase())
      );
    }

    if (selectedRole !== "all") {
      tempList = tempList.filter((item) => item.role === selectedRole);
    }

    if (selectedProvince !== "all") {
      tempList = tempList.filter(
        (item) => item.address.province === selectedProvince
      );
    }

    if (selectedDistrict !== "all") {
      tempList = tempList.filter(
        (item) => item.address.district === selectedDistrict
      );
    }

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
    if (!name || !email || !phoneNumber || !addressLine || !province || !district || !division) {
      return message.error("Please fill all the required fields.");
    }
  
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
  
    if (password) {
      managerData.password = password;
    }
  
    try {
      if (editingManager) {
        await axios.post(`http://localhost:5000/api/managers/updatemanager/${editingManager._id}`, managerData);
        message.success("Manager updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/managers/addmanagers", managerData);
        message.success("Manager added successfully");
      }
      handleModalClose();
      fetchManagerList();
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

  const handleSuspend = async (id) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/managers/togglemanagerstatus/${id}`);
      message.success(response.data.message);
      fetchManagerList();
    } catch (error) {
      message.error("Failed to update manager status");
    }
  };

  const StyledButton = ({ children, ...props }) => (
    <Button {...props} style={{ backgroundColor: "#0C6C41", borderColor: "#0C6C41", color: "white" }}>
      {children}
    </Button>
  );

  const StyledCard = ({ children, ...props }) => (
    <Card
      {...props}
      style={{
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        borderRadius: "8px",
        border: "none",
        marginBottom: "20px"
      }}
    >
      {children}
    </Card>
  );

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
        <Space>
          <Tooltip title="Edit">
            <StyledButton icon={<EditOutlined />} onClick={() => handleModalOpen(record)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure you want to delete this manager?"
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ style: { backgroundColor: "#0C6C41", borderColor: "#0C6C41" } }}
            >
              <StyledButton icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
          <Tooltip title={record.status === "active" ? "Suspend" : "Activate"}>
            <Popconfirm
              title={`Are you sure you want to ${
                record.status === "active" ? "suspend" : "activate"
              } this manager?`}
              onConfirm={() => handleSuspend(record._id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ style: { backgroundColor: "#0C6C41", borderColor: "#0C6C41" } }}
            >
              <StyledButton icon={<UserSwitchOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleFileChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const handlePreview = (file) => {
    setPreviewImage(file.url || file.thumbUrl);
    setPreviewOpen(true);
  };

  const getUniqueValues = (field) => {
    const uniqueValues = managerList.map((manager) => manager.address[field]);
    return ["all", ...new Set(uniqueValues.filter(Boolean))];
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ backgroundColor: "#0C6C41", padding: "0 20px" }}>
        <Title level={3} style={{ color: "white", margin: "16px 0" }}>
          <TeamOutlined /> Manager Management
        </Title>
      </Header>
      <div style={{ padding: "20px" }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card hoverable>
            <Statistic
              title="Total Managers"
              value={totalManagers}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#0C6C41" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card hoverable>
            <Statistic
              title="Active Managers"
              value={activeManagers}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card hoverable>
            <Statistic
              title="Suspended Managers"
              value={suspendedManagers}
              prefix={<SolutionOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      <Card>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={4}>Manager List</Title>
            </Col>
            <Col>
              <Button 
                type="primary" 
                icon={<UserAddOutlined />} 
                onClick={() => handleModalOpen()}
                style={{ backgroundColor: "#0C6C41", borderColor: "#0C6C41" }}
              >
                Add Manager
              </Button>
            </Col>
          </Row>

          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8} lg={6}>
              <Search
                placeholder="Search by name, email, or ID"
                onSearch={(value) => setSearchKey(value)}
                style={{ width: "100%" }}
                enterButton={<SearchOutlined />}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Radio.Group
                onChange={(e) => setSelectedRole(e.target.value)}
                value={selectedRole}
                buttonStyle="solid"
                style={{ width: "100%" }}
              >
                <Radio.Button value="all" style={{ width: "33.33%" }}>All</Radio.Button>
                <Radio.Button value="manager" style={{ width: "33.33%" }}>Manager</Radio.Button>
                <Radio.Button value="admin" style={{ width: "33.33%" }}>Admin</Radio.Button>
              </Radio.Group>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                style={{ width: "100%" }}
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
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                style={{ width: "100%" }}
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
            </Col>
          </Row>

          <Table
            columns={columns}
            dataSource={filteredManagerList}
            rowKey="_id"
            loading={isLoading}
            pagination={{ 
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
            }}
          />
        </Space>
      </Card>
    </div>

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
     </ Layout>    
  );
};

export default ManagerManagement;
