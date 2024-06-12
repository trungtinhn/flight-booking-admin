import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Space,
  Table,
  Tag,
  Typography,
  Input,
  Modal,
  message,
  Upload,
  Divider,
  Form,
  Radio,
  Select,
  TreeSelect,
  DatePicker,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
const { Column, ColumnGroup } = Table;
const { Search } = Input;
import "./FlightsPage.css";
import axios from "axios";

// const data = [
//   {
//     key: "1",
//     firstName: "Vietnam Airlines",
//     origin: "Ho Chi Minh",
//     destination: "Ha Noi",
//     duration: 2,
//     tags: ["Active"],
//   },
//   {
//     key: "2",
//     firstName: "Vietjet Air",
//     origin: "Ho Chi Minh",
//     destination: "Ha Noi",
//     duration: 4,

//     tags: ["Cancelled"],
//   },
//   {
//     key: "3",
//     firstName: "Bamboo Airways",
//     origin: "Ha Noi",
//     destination: "My",
//     duration: 2,

//     tags: ["Active"],
//   },
// ];

const uploadProps = {
  name: "file",
  headers: {
    authorization: "authorization-text",
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const FlightsPage = () => {
  const onSearch = (value, _e, info) => console.log(info?.source, value);
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://flightbooking-be.onrender.com/flight/get-all-flight"
      );

      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Flex vertical gap="large">
      <Typography.Title level={2}>Flights Management</Typography.Title>
      <Flex justify="space-between">
        <Search
          placeholder="Search flights"
          onSearch={onSearch}
          enterButton
          className="search-input"
        />
        <Button
          type="primary"
          style={{ backgroundColor: "#8DD3BB", fontWeight: 500 }}
          onClick={() => setModalOpen(true)}
        >
          Add Flight
        </Button>
        <Modal
          title="Add new flights"
          centered
          open={modalOpen}
          onOk={() => setModalOpen(false)}
          onCancel={() => setModalOpen(false)}
        >
          <Flex vertical align="center">
            <Upload {...uploadProps} accept=".csv">
              <Button icon={<UploadOutlined />}>Add by excel file</Button>
            </Upload>
            <Divider plain>Or</Divider>
            <Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 10 }}
              layout="horizontal"
              size="middle"
              style={{ width: "100%" }}
              labelAlign="left"
            >
              <Form.Item label="Airlines">
                <Select>
                  <Select.Option value="vietname-airline">
                    Vietnam Airline
                  </Select.Option>
                  <Select.Option value="vietject-air">
                    Vietjet Air
                  </Select.Option>
                  <Select.Option value="bambo">Bambo Airway</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="From">
                <Select>
                  <Select.Option value="hcm">Ho Chi Minh</Select.Option>
                  <Select.Option value="hn"> Ha Noi</Select.Option>
                  <Select.Option value="dn">Da Nang</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="To">
                <Select>
                  <Select.Option value="hcm">Ho Chi Minh</Select.Option>
                  <Select.Option value="hn"> Ha Noi</Select.Option>
                  <Select.Option value="dn">Da Nang</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Departure Day">
                <DatePicker showTime />
              </Form.Item>
              <Form.Item label="Arrival Day">
                <DatePicker showTime />
              </Form.Item>
              <Form.Item label="Plane">
                <Select>
                  <Select.Option value="1">1</Select.Option>
                  <Select.Option value="2">2</Select.Option>
                  <Select.Option value="3">3</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="Status">
                <Select>
                  <Select.Option value="active">Active</Select.Option>
                  <Select.Option value="cancelled"> Cancelled</Select.Option>
                  <Select.Option value="delay">Delayed</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          </Flex>
        </Modal>
      </Flex>
      <Table dataSource={data}>
        <Column title="ID" dataIndex="id" key="id" />
        <Column
          title="From"
          dataIndex="departureAirportId"
          key="departureAirportId"
        />
        <Column
          title="To"
          dataIndex="arrivalAirportId"
          key="arrivalAirportId"
        />
        <Column
          title="Departure Day"
          dataIndex="departureDate"
          key="departureDate"
        />
        <Column title="Arrival Day" dataIndex="arrivalDate" key="arrivalDate" />
        <Column title="Duration" dataIndex="duration" key="duration" />
        <Column title="Plane" dataIndex="planeId" key="planeId" />
        <Column
          title="Status"
          dataIndex="flightStatus"
          key="flightStatus"
          render={(tags) => <>{<Tag key={tags}>{tags.toUpperCase()}</Tag>}</>}
        />
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
    </Flex>
  );
};

export default FlightsPage;
