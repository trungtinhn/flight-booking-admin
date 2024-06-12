import React, { useState, useEffect } from "react";
import { Button, Flex, Table, Typography, Modal, message, Form, Input, InputNumber, Upload, Space } from "antd";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";
import { Voucher } from "./VoucherInterface";

const { Column } = Table;

const VoucherPage = () => {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentVoucher, setCurrentVoucher] = useState<Voucher | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchVouchers();
    }, []);

    const fetchVouchers = async () => {
        try {
            const response = await axios.get<Voucher[]>("https://flightbookingbe-production.up.railway.app/voucher/get-all");
            setVouchers(response.data);
        } catch (error) {
            handleError("Error fetching vouchers:", error);
        }
    };

    const handleAddOrUpdateVoucher = async (values) => {
        try {
            const formData = new FormData();
            formData.append("code", values.code);
            formData.append("voucherName", values.voucherName);
            formData.append("discountAmount", values.discountAmount);
            if (values.file) {
                formData.append("file", values.file.file);
            }

            const url = isEditing ? `https://flightbookingbe-production.up.railway.app/voucher/update/${currentVoucher?.id}` : "https://flightbookingbe-production.up.railway.app/voucher/add";
            const method = isEditing ? 'put' : 'post';

            await axios({
                method,
                url,
                data: formData,
                headers: isEditing ? {} : { 'Content-Type': 'multipart/form-data' },
            });

            message.success(isEditing ? "Voucher updated successfully!" : "Voucher added successfully!");
            fetchVouchers();
            resetForm();
        } catch (error) {
            handleError("Failed to submit voucher.", error);
        }
    };

    const handleDeleteVoucher = async (id) => {
        try {
            await axios.delete(`https://flightbookingbe-production.up.railway.app/delete/${id}`);
            message.success("Voucher deleted successfully!");
            fetchVouchers();
        } catch (error) {
            handleError("Failed to delete voucher.", error);
        }
    };

    const handleEditVoucher = (record: Voucher) => {
        setIsEditing(true);
        setCurrentVoucher(record);
        form.setFieldsValue(record);
        setModalOpen(true);
    };

    const resetForm = () => {
        form.resetFields();
        setIsEditing(false);
        setCurrentVoucher(null);
        setModalOpen(false);
    };

    const handleError = (messageText, error) => {
        console.error(messageText, error);
        message.error(messageText);
    };

    return (
        <Flex vertical gap="large">
            <Typography.Title level={2}>Vouchers Management</Typography.Title>
            <Button
                type="primary"
                style={{ backgroundColor: "#8DD3BB", fontWeight: 500 }}
                onClick={() => setModalOpen(true)}
            >
                Add Voucher
            </Button>
            <Modal
                title={isEditing ? "Edit Voucher" : "Add Voucher"}
                centered
                visible={modalOpen}
                onOk={form.submit}
                onCancel={resetForm}
            >
                <Form form={form} layout="vertical" onFinish={handleAddOrUpdateVoucher}>
                    <Form.Item
                        label="Voucher Code"
                        name="code"
                        rules={[{ required: true, message: "Please enter voucher code" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Voucher Name"
                        name="voucherName"
                        rules={[{ required: true, message: "Please enter voucher name" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Voucher Discount"
                        name="discountAmount"
                        rules={[{ required: true, message: "Please enter discount amount" }]}
                    >
                        <InputNumber min={0} max={100} />
                    </Form.Item>
                    <Form.Item label="File" name="file">
                        <Upload beforeUpload={() => false} maxCount={1}>
                            <Button icon={<UploadOutlined />}>Upload Image</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
            <Table dataSource={vouchers} rowKey="id">
                <Column title="Code" dataIndex="code" key="code" />
                <Column title="Name" dataIndex="voucherName" key="voucherName" />
                <Column title="Discount" dataIndex="discountAmount" key="discountAmount" />
                <Column
                    title="Image URL"
                    dataIndex="voucherImageUrl"
                    key="voucherImageUrl"
                    render={(text) => <a href={text} target="_blank" rel="noopener noreferrer">View Image</a>}
                />
                <Column
                    title="Actions"
                    key="actions"
                    render={(_, record: Voucher) => (
                        <Space size="middle">
                            <Button type="primary" onClick={() => handleEditVoucher(record)}>Edit</Button>
                            <Button danger onClick={() => handleDeleteVoucher(record.id)}>Delete</Button>
                        </Space>
                    )}
                />
            </Table>
        </Flex>
    );
};

export default VoucherPage;
