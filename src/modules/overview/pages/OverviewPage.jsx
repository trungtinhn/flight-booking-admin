import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";
import { ArrowDownOutlined, ArrowUpOutlined, ProjectOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic, Flex, DatePicker, Typography } from "antd";
import { Bar, Line } from "react-chartjs-2";

const options = {
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
    },
  },
};

const OverviewPage = () => {
  const [total, setTotal] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [monthlyDataFlight, setMonthlyDataFlight] = useState([]);
  const [monthlyDataBooking, setMonthlyDataBooking] = useState([]);
  const [weekyData, setWeeklyData] = useState([]);
  const [weekyDataFlight, setWeeklyDataFlight] = useState([]);
  const [weekyDataBooking, setWeeklyDataBooking] = useState([]);
  const [label, setLabel] = useState([]);
  const [totalFlight, setTotalFlight] = useState(0);
  const [totalBooking, setTotalBooking] = useState(0);
  const [totalAirline, setTotalAirline] = useState(0);
  const [totalAirport, setTotalAirport] = useState(0);
  const [totalPlane, setTotalPlane] = useState(0);
  const fetchDataStatistic = async () => {
    try {
      const response = await axios.get(
        "https://flightbookingbe-production.up.railway.app/statistic/revenue"
      );
      setTotal(response.data);

      const monthDataPromises = Array.from({ length: 12 }, (_, i) => {
        const year = 2024;
        const month = i;

        const startDate = new Date(year, month, 1, 0, 0, 0, 0).toISOString().replace('T', ' ').replace('Z', '');
        const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999).toISOString().replace('T', ' ').replace('Z', '');

        return axios.get(
          "https://flightbookingbe-production.up.railway.app/statistic/revenueByDateRange",
          {
            params: {
              startDate: startDate,
              endDate: endDate,
            }
          }
        );
      });

      const responses = await Promise.all(monthDataPromises);
      const monthlyData = responses.map(response => response.data || 0);

      setMonthlyData(monthlyData);

      const weeklyResponse = await axios.get(
        "https://flightbookingbe-production.up.railway.app/statistic/revenueForCurrentWeek"
      );
      setWeeklyData(weeklyResponse.data || [0, 0, 0, 0, 0, 0, 0]); // Default to 0 if no data

      const weeklyResponseFlight = await axios.get(
        "https://flightbookingbe-production.up.railway.app/statistic/flightCountForCurrentWeek"
      );
      setWeeklyDataFlight(weeklyResponseFlight.data || [0, 0, 0, 0, 0, 0, 0]); // Default to 0 if no data

      const weeklyResponseBooking = await axios.get(
        "https://flightbookingbe-production.up.railway.app/statistic/bookingCountForCurrentWeek"
      );
      setWeeklyDataBooking(weeklyResponseBooking.data || [0, 0, 0, 0, 0, 0, 0]); // Default to 0 if no data

      const airportResponse = await axios.get(
        "https://flightbookingbe-production.up.railway.app/statistic/totalAirport"
      );
      setTotalAirport(airportResponse.data || 0);
      const flightResponse = await axios.get(
        "https://flightbookingbe-production.up.railway.app/statistic/totalFlight"
      );
      setTotalFlight(flightResponse.data || 0);
      const bookingResponse = await axios.get(
        "https://flightbookingbe-production.up.railway.app/statistic/totalBooking"
      );
      setTotalBooking(bookingResponse.data || 0);
      const airlineResponse = await axios.get(
        "https://flightbookingbe-production.up.railway.app/statistic/totalAirline"
      );
      setTotalAirline(airlineResponse.data || 0);
      const planeResponse = await axios.get(
        "https://flightbookingbe-production.up.railway.app/statistic/totalPlane"
      );
      setTotalPlane(planeResponse.data || 0);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };


  const fetchDailyRevenueForMonth = async (month, year) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const labels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
    setLabel(labels);
    try {
      const response = await axios.get(
        "https://flightbookingbe-production.up.railway.app/statistic/dailyRevenueForMonth",
        {
          params: {
            month: month,
            year: year,
          }
        }
      );
      setMonthlyRevenue(response.data || Array.from({ length: 31 }, () => 0)); // Default to 0 if no data

      const flightresponse = await axios.get(
        "https://flightbookingbe-production.up.railway.app/statistic/dailyFlightForMonth",
        {
          params: {
            month: month,
            year: year,
          }
        }
      )
      setMonthlyDataFlight(flightresponse.data || Array.from({ length: 31 }, () => 0)); // Default to 0 if no data

      const bookingresponse = await axios.get(
        "https://flightbookingbe-production.up.railway.app/statistic/dailyBookingForMonth",
        {
          params: {
            month: month,
            year: year,
          }
        }
      )
      setMonthlyDataBooking(bookingresponse.data || Array.from({ length: 31 }, () => 0)); // Default to 0 if no data

      
    } catch (error) {
      console.log("Error fetching daily revenue data:", error);
    }
  };


  useEffect(() => {
    fetchDataStatistic();
  }, []);


  return (
    <Flex vertical gap="large">
      <Typography.Title level={2}>Dashboard</Typography.Title>
      <Typography.Title level={3}>Total</Typography.Title>
      <Row gutter={16}>
        <Col span={8}>
            <Card bordered={false}>
              <Statistic
                title="Total Revenue"
                value={total}
                precision={2}
                valueStyle={{ color: "#3f8600", fontWeight: 500 }}
                prefix={<ArrowUpOutlined />}
              />
            </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Total Flights"
              value={totalFlight}
              precision={0}
              valueStyle={{ color: "#3A5A40", fontWeight: 500 }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Total Bookings"
              value={totalBooking}
              precision={0}
              valueStyle={{ color: "#073B3A", fontWeight: 500 }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
            <Card bordered={false}>
              <Statistic
                title="Total Airlines"
                value={totalAirline}
                precision={0}
                valueStyle={{ color: "#25A18E", fontWeight: 500 }}
                prefix={<ArrowUpOutlined />}
              />
            </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Total Planes"
              value={totalPlane}
              precision={0}
              valueStyle={{ color: "#0F5132", fontWeight: 500 }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Total Airports"
              value={totalAirport}
              precision={0}
              valueStyle={{ color: "#0A5C36", fontWeight: 500 }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={16}>
          <Card>
            <Bar
              options={options}
              data={{
                labels: [
                  "January", "February", "March", "April", "May", "June", 
                  "July", "August", "September", "October", "November", "December"
                ],
                datasets: [
                  {
                    type: "line",
                    label: "Revenue",
                    borderColor: "#8DD3BB",
                    borderWidth: 2,
                    fill: false,
                    data: monthlyData,
                  },
                  {
                    type: "bar",
                    label: "Bookings",
                    backgroundColor: "#A7E6FF",
                    borderRadius: 10,
                    data: monthlyData,
                  },
                ],
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Typography.Title level={3}>Revenue in month</Typography.Title>
          <DatePicker
            picker="month"
            onChange={(date, dateString) => {   
            fetchDailyRevenueForMonth(dateString.split("-")[1], dateString.split("-")[0]);         
          }}
        />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={16}>
          <Card>
            <Bar
              options={options}
              data={{
                labels: label,
                datasets: [
                  {
                    type: "line",
                    label: "Month Revenue",
                    borderColor: "#8DD3BB",
                    borderWidth: 2,
                    fill: false,
                    data: monthlyRevenue,
                  },
                  {
                    type: "bar",
                    label: "Month Revenue",
                    backgroundColor: "#A7E6FF",
                    borderRadius: 10,
                    data: monthlyRevenue,
                  },
                ],
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={16}>
          <Card>
            <Bar
              options={options}
              data={{
                labels: label,
                datasets: [
                  {
                    type: "line",
                    label: "Flight Month",
                    borderColor: "#8DD3BB",
                    borderWidth: 2,
                    fill: false,
                    data: monthlyDataFlight,
                  },
                  
                ],
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={16}>
          <Card>
            <Bar
              options={options}
              data={{
                labels: label,
                datasets: [
                  {
                    type: "line",
                    label: "Booking Month",
                    borderColor: "#8DD3BB",
                    borderWidth: 2,
                    fill: false,
                    data: monthlyDataBooking,
                  },
                  
                ],
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Bar
              options={options}
              data={{
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [
                  {
                    type: "line",
                    label: "Daily Flights",
                    borderColor: "#25A18E",
                    borderWidth: 2,
                    data: weekyDataFlight,
                  },
                ],
              }}
            ></Bar>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Bar
              options={options}
              data={{
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [
                  {
                    type: "line",
                    label: "Booking",
                    borderColor: "#073B3A",
                    borderWidth: 2,
                    data: weekyDataBooking,
                  },
                ],
              }}
            ></Bar>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Bar
              options={options}
              data={{
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [
                  {
                    type: "bar",
                    label: "Revenue",
                    backgroundColor: "#0A5C36",
                    borderRadius: 10,
                    barThickness: 12,
                    borderWidth: 2,
                    borderSkipped: false,
                    data: weekyData,
                  },
                ],
              }}
            ></Bar>
          </Card>
        </Col>
      </Row>
    </Flex>
  );
};

export default OverviewPage;
