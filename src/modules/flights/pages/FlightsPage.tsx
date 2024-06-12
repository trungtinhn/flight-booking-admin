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
  const [delayModalOpen, setDelayModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flightLoading, setFlightLoading] = useState(true);
  const [airportLoading, setAirportLoading] = useState(true);
  const [planeLoading, setPlaneLoading] = useState(true);
  const [error, setError] = useState(null);
  const [delayFlightId, setDelayFlightId] = useState(null);
  const [delayDepartureDate, setDelayDepartureDate] = useState("");
  const [delayArrivalDate, setDelayArrivalDate] = useState("");
  const [delayReason, setDelayReason] = useState("");
  const [planes, setPlanes] = useState([]);

  //Create new flight
  const [flightStatus, setFlightStatus] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [planeId, setPlaneId] = useState("");
  const [departureAirportId, setDepartureAirportId] = useState("");
  const [arrivalAirportId, setArrivalAirportId] = useState("");

  const [airports, setAirports] = useState([]);

  const delayFlight = async (id, departureDate, arrivalDate, reason) => {
    try {
      const response = await axios.post(
        "https://flightbookingbe-production.up.railway.app/flight/delay",
        {
          flightId: id,
          newDepartureTime: departureDate,
          newArrivalTime: arrivalDate,
          reason,
        }
      );
      fetchData();
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAirportData = async () => {
    setAirportLoading(true);
    try {
      const response = await axios.get(
        "https://flightbookingbe-production.up.railway.app/airports"
      );

      setAirports(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setAirportLoading(false);
    }
  };

  const fetchPlaneData = async () => {
    try {
      const response = await axios.get(
        "https://flightbookingbe-production.up.railway.app/airlines/get-all-plane"
      );
      console.log(response.data);

      setPlanes(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setPlaneLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://flightbookingbe-production.up.railway.app/flight/get-all-flight"
      );

      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setFlightLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchAirportData();
    fetchPlaneData();
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
              <Form.Item label="From">
                <Select
                  onChange={(value) => {
                    setDepartureAirportId(value);
                  }}
                >
                  {airports.map((airport) => (
                    <Select.Option key={airport.id} value={airport.id}>
                      {airport.airportName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="To">
                <Select
                  onChange={(value) => {
                    setArrivalAirportId(value);
                  }}
                >
                  {airports.map((airport) => (
                    <Select.Option key={airport.id} value={airport.id}>
                      {airport.airportName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Departure Day">
                <DatePicker
                  showTime
                  onChange={(date, dateString) => {
                    setDepartureDate(date.toISOString());
                    console.log(date, dateString);
                  }}
                />
              </Form.Item>
              <Form.Item label="Arrival Day">
                <DatePicker
                  showTime
                  onChange={(date, dateString) => {
                    setArrivalDate(date.toISOString());
                    console.log(date, dateString);
                  }}
                />
              </Form.Item>
              <Form.Item label="Plane">
                <Select
                  onChange={(value) => {
                    setPlaneId(value);
                  }}
                >
                  {planes.map((plane) => (
                    <Select.Option key={plane.id} value={plane.id}>
                      {plane.flightNumber}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Status">
                <Select>
                  <Select.Option value="scheduled">SCHEDULED</Select.Option>
                  <Select.Option value="cancelled"> CANCELLED</Select.Option>
                  <Select.Option value="delay">DELAYED</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          </Flex>
        </Modal>
        <Modal
          title="Delay"
          centered
          open={delayModalOpen}
          onOk={() => {
            delayFlight(
              delayFlightId,
              delayDepartureDate,
              delayArrivalDate,
              delayReason
            );
            setDelayModalOpen(false);
          }}
          onCancel={() => setDelayModalOpen(false)}
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
              <Form.Item label="Departure Day">
                <DatePicker
                  showTime
                  onChange={(date, dateString) => {
                    setDelayDepartureDate(date.toISOString());
                    console.log(date, dateString);
                  }}
                />
              </Form.Item>
              <Form.Item label="Arrival Day">
                <DatePicker
                  showTime
                  onChange={(date, dateString) => {
                    setDelayArrivalDate(date.toISOString());
                    console.log(date, dateString);
                  }}
                />
              </Form.Item>
              <Form.Item label="Reason">
                <Input
                  onChange={(event) => {
                    setDelayReason(event.target.value);
                  }}
                />
              </Form.Item>
            </Form>
          </Flex>
        </Modal>
      </Flex>
      {flightLoading || airportLoading || planeLoading ? (
        <div>Loading...</div>
      ) : (
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
            render={(item) => {
              const date = new Date(item);
              const day = date.getDate();
              const month = date.getMonth() + 1;
              const year = date.getFullYear();
              const hours = date.getHours();
              const minutes = date.getMinutes();
              const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
              return <>{<span key={item}>{formattedDate}</span>}</>;
            }}
          />
          <Column
            title="Arrival Day"
            dataIndex="arrivalDate"
            key="arrivalDate"
            render={(item) => {
              const date = new Date(item);
              const day = date.getDate();
              const month = date.getMonth() + 1;
              const year = date.getFullYear();
              const hours = date.getHours();
              const minutes = date.getMinutes();
              const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
              return <>{<span key={item}>{formattedDate}</span>}</>;
            }}
          />
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
                {record.flightStatus !== "Delayed" && (
                  <Button
                    type="primary"
                    style={{ backgroundColor: "#8DD3BB" }}
                    onClick={() => {
                      setDelayFlightId(record.id);
                      setDelayModalOpen(true);
                    }}
                  >
                    Delay
                  </Button>
                )}
                <Button danger>Cancel</Button>
              </Space>
            )}
          />
        </Table>
      )}
    </Flex>
  );
};

export default FlightsPage;
