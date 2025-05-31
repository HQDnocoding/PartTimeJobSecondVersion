import React, { useState, useContext } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { MyDispatchContext, MyUserContext } from '../../configs/Contexts';
import { authApis, endpoints, } from '../../configs/APIs';

const AddAuthenticationModal = ({ show, onHide, onSuccess }) => {
    const user = useContext(MyUserContext);
    const [formData, setFormData] = useState({
        paperFile: null,
        idCardFrontFile: null,
        idCardBackFile: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
      const dispatch = useContext(MyDispatchContext);
    

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData({ ...formData, [name]: files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.paperFile || !formData.idCardFrontFile || !formData.idCardBackFile) {
            setError('Vui lòng cung cấp đầy đủ các file.');
            return;
        }

        console.log("ok", user);


        const data = new FormData();
        data.append('paperFile', formData.paperFile);
        data.append('idCardFrontFile', formData.idCardFrontFile);
        data.append('idCardBackFile', formData.idCardBackFile);
        data.append('companyId', user.company.id);

        try {
            setLoading(true);
            setError(null);
            await authApis().post(endpoints['addCompanyAuthentication'], data);
            setSuccess('Thêm thông tin chứng thực thành công!');
            setFormData({ paperFile: null, idCardFrontFile: null, idCardBackFile: null });
            onSuccess(); // Gọi để báo cần refresh context
            setTimeout(() => {
                onHide();
                setSuccess(null);
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Lỗi khi thêm thông tin chứng thực');
        } finally {
            setLoading(false);
            await authApis().get(endpoints['infor']).then(res => { dispatch({ type: 'update_user', payload: res.data }) }).catch(err => {
                dispatch({ type: 'logout' });
            });
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Thêm thông tin chứng thực</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Giấy phép kinh doanh</Form.Label>
                        <Form.Control
                            type="file"
                            name="paperFile"
                            accept=".pdf"
                            onChange={handleFileChange}
                            disabled={loading}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Mặt trước CMND/CCCD</Form.Label>
                        <Form.Control
                            type="file"
                            name="idCardFrontFile"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={loading}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Mặt sau CMND/CCCD</Form.Label>
                        <Form.Control
                            type="file"
                            name="idCardBackFile"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={loading}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : 'Thêm'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddAuthenticationModal;