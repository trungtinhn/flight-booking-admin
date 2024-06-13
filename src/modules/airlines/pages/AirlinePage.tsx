import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Cascader,
  DatePicker,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  TreeSelect,
  Typography,
  Upload,
  message,
} from "antd";
import Search from "antd/es/input/Search";
import Column from "antd/es/table/Column";
import React, { useEffect, useState } from "react";
import "./AirlinePage.css";
import axios from "axios";

const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

const AirlinePage = () => {
  const onSearch = (value, _e, info) => {
    setData(data.filter((item) => item.airlineName.toString().includes(value)));
    console.log(info?.source, value);
  };
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [airlineName, setAirlineName] = useState("");

  const handleUpload = () => {
    if (!file) {
      message.error("Please select a file first!");
      return;
    }

    if (!airlineName) {
      message.error("Please enter an airline name!");
      return;
    }

    const formData = new FormData();
    formData.append("airlineName", airlineName);
    formData.append("file", file);

    axios
      .post(
        "https://flightbookingbe-production.up.railway.app/airlines/upload-new-airline",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        message.success("Upload successful!");
        fetchData();
      })
      .catch((error) => {
        message.error("Upload failed.");
      });
  };

  const props = {
    name: "file",
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    headers: {
      authorization: "authorization-text",
    },
    beforeUpload: (file) => {
      setFile(file);
      return false;
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        console.log(info.file);
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://flightbookingbe-production.up.railway.app/airlines"
      );

      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <Flex vertical gap="large">
      <Typography.Title level={2}>Airline Management</Typography.Title>
      <Flex justify="space-between">
        <Search
          placeholder="Search airlines"
          onSearch={onSearch}
          enterButton
          className="search-input"
        />
        <Button
          type="primary"
          style={{ backgroundColor: "#8DD3BB", fontWeight: 500 }}
          onClick={() => setModalOpen(true)}
        >
          Add Airline
        </Button>
        <Modal
          title="Add new airline"
          centered
          open={modalOpen}
          onOk={() => {
            handleUpload();
            setModalOpen(false);
          }}
          onCancel={() => setModalOpen(false)}
        >
          <Flex vertical align="center">
            <Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 10 }}
              layout="horizontal"
              size="middle"
              style={{ width: "100%" }}
              labelAlign="left"
            >
              <Form.Item label="Name">
                <Input
                  color="white"
                  onChange={(e) => setAirlineName(e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Logo">
                <Upload {...props} maxCount={1}>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>
            </Form>
          </Flex>
        </Modal>
      </Flex>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table dataSource={data}>
          <Column title="ID" dataIndex="id" key="id" />
          <Column
            title="Image"
            key="logoUrl"
            render={(_, record) => {
              return (
                <img
                  alt="example"
                  src={record.logoUrl}
                  width={140}
                  height={140}
                  style={{ objectFit: "scale-down" }}
                />
              );
            }}
          />
          <Column title="Name" dataIndex="airlineName" key="airlineName" />

          <Column
            title="Action"
            key="action"
            render={(_, record) => (
              <Space size="middle">
                <Button type="primary" style={{ backgroundColor: "#8DD3BB" }}>
                  Edit
                </Button>
                <Button danger>Delete</Button>
              </Space>
            )}
          />
        </Table>
      )}
    </Flex>
  );
};

export default AirlinePage;
