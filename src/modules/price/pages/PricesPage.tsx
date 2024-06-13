import React, { useState, useEffect } from "react";
import {
    Button,
    Row,
    Col,
    Table,
    Typography,
    Input,
    Modal,
    message,
    Form,
    Image,
} from "antd";
import axios from "axios";
import "./PricesPage.css";

interface Price {
    key: string;
    class: string;
    price: number;
}

interface Plane {
    id: number;
    flightNumber: string;
}

interface Regulation {
    id: number;
    firstClassPrice: number;
    businessPrice: number;
    economyPrice: number;
}

interface Airline {
    id: number;
    airlineName: string;
    logoUrl: string;
    promoForAirline: string[];
    planes: Plane[];
}

const { Column } = Table;
const { Search } = Input;

const PricesPage = () => {
    const [airlines, setAirlines] = useState<Airline[]>([]);
    const [regulations, setRegulations] = useState<{ [key: number]: Regulation | null }>({});
    const [selectedRegulation, setSelectedRegulation] = useState<Regulation | null>(null);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [selectedAirlineId, setSelectedAirlineId] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchAirlines();
    }, []);

    const fetchAirlines = async () => {
        try {
            const response = await axios.get("https://flightbookingbe-production.up.railway.app/regulations/getAllWithRegulations");
            const data = response.data;
            setAirlines(data);
        } catch (error) {
            console.error("Error fetching airlines:", error);
        }
    };

    const fetchRegulation = async (airlineId: number) => {
        try {
            const response = await axios.get(`https://flightbookingbe-production.up.railway.app/regulations/byAirline/${airlineId}`);
            return response.data as Regulation;
        } catch (error) {
            console.error("Error fetching regulation:", error);
            return null;
        }
    };

    const handleExpand = async (expanded: boolean, airline: Airline) => {
        if (expanded && airline.id) {
            const regulation = await fetchRegulation(airline.id);
            setRegulations(prev => ({ ...prev, [airline.id]: regulation }));
        }
    };

    const handleUpdatePrice = async (values: { price: number }) => {
        try {
            if (!selectedAirlineId || !selectedClass) return;

            const updateUrl = `https://flightbookingbe-production.up.railway.app/regulations/updatePrice/${selectedAirlineId}`;
            const params: any = {};
            if (selectedClass === 'First Class') {
                params.firstClassPrice = values.price;
            } else if (selectedClass === 'Business') {
                params.businessPrice = values.price;
            } else if (selectedClass === 'Economy') {
                params.economyPrice = values.price;
            }
            await axios.put(updateUrl, null, { params });

            // Cập nhật state regulations ngay lập tức sau khi cập nhật giá vé thành công
            setRegulations(prev => {
                const updatedRegulation: Regulation = {
                    id: prev[selectedAirlineId]?.id || selectedAirlineId,
                    firstClassPrice: prev[selectedAirlineId]?.firstClassPrice || 0,
                    businessPrice: prev[selectedAirlineId]?.businessPrice || 0,
                    economyPrice: prev[selectedAirlineId]?.economyPrice || 0,
                };
                if (selectedClass === 'First Class') {
                    updatedRegulation.firstClassPrice = values.price;
                } else if (selectedClass === 'Business') {
                    updatedRegulation.businessPrice = values.price;
                } else if (selectedClass === 'Economy') {
                    updatedRegulation.economyPrice = values.price;
                }
                return { ...prev, [selectedAirlineId]: updatedRegulation };
            });

            message.success("Price updated successfully!");
            setModalOpen(false);
            form.resetFields();
        } catch (error) {
            message.error("Failed to update price.");
            console.error("Error updating price:", error);
        }
    };

    const onFinish = (values: any) => {
        handleUpdatePrice(values);
    };

    const getInitialPrice = () => {
        if (!selectedRegulation || !selectedClass) return 0;
        if (selectedClass === 'First Class') {
            return selectedRegulation.firstClassPrice;
        } else if (selectedClass === 'Business') {
            return selectedRegulation.businessPrice;
        } else if (selectedClass === 'Economy') {
            return selectedRegulation.economyPrice;
        }
        return 0;
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography.Title level={2}>Prices Management</Typography.Title>
            <Row justify="space-between" style={{ marginBottom: '20px' }}>
                <Col>
                    <Search
                        placeholder="Search prices"
                        onSearch={(value) => console.log(value)}
                        enterButton
                        className="search-input"
                    />
                </Col>
            </Row>
            <Table
                dataSource={airlines}
                rowKey="id"
                expandable={{
                    expandedRowRender: airline => {
                        const regulation = regulations[airline.id];
                        return (
                            <Table
                                dataSource={[
                                    { key: '1', class: 'First Class', price: regulation?.firstClassPrice },
                                    { key: '2', class: 'Business', price: regulation?.businessPrice },
                                    { key: '3', class: 'Economy', price: regulation?.economyPrice }
                                ]}
                                rowKey="key"
                                pagination={false}
                            >
                                <Column title="Class" dataIndex="class" key="class" />
                                <Column title="Price" dataIndex="price" key="price" render={price => price !== undefined ? `$${price}` : 'N/A'} />
                                <Column
                                    title="Action"
                                    key="action"
                                    render={(text, record: Price) => (
                                        <Button
                                            type="link"
                                            onClick={() => {
                                                setSelectedClass(record.class);
                                                setSelectedAirlineId(airline.id);
                                                form.setFieldsValue({ price: record.price });
                                                setSelectedRegulation(regulation);
                                                setModalOpen(true);
                                            }}
                                        >
                                            Edit
                                        </Button>
                                    )}
                                />
                            </Table>
                        )
                    },
                    onExpand: handleExpand,
                }}
            >
                <Column
                    title="Airline"
                    dataIndex="airlineName"
                    key="airlineName"
                    render={(text, record: Airline) => (
                        <Row align="middle">
                            <Col>
                                <Image src={record.logoUrl} alt={record.airlineName} width={50} height={50} />
                            </Col>
                            <Col style={{ marginLeft: 10 }}>{record.airlineName}</Col>
                        </Row>
                    )}
                />
            </Table>
            <Modal
                title="Update Price"
                centered
                open={modalOpen}
                onOk={form.submit}
                onCancel={() => setModalOpen(false)}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Price"
                        name="price"
                        initialValue={getInitialPrice()}
                        rules={[{ required: true, message: "Please enter a price" }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default PricesPage;
