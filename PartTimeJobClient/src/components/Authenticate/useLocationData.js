import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const useLocationData = (city) => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [isProvinceLoading, setIsProvinceLoading] = useState(false);
    const [isDistrictLoading, setIsDistrictLoading] = useState(false);
    const [errors, setErrors] = useState([]);

    const memoizedProvinces = useMemo(() => provinces, [provinces]);

    useEffect(() => {
        const fetchProvinces = async () => {
            if (provinces.length > 0) return;
            setIsProvinceLoading(true);
            try {
                const response = await axios.get('https://provinces.open-api.vn/api/p/');
                setProvinces(response.data || []);
            } catch (err) {
                const errorMsg = err.response?.data?.message || 'Không thể tải danh sách tỉnh/thành phố.';
                toast.error(errorMsg);
                setErrors((prev) => [...new Set([...prev, errorMsg])]);
            } finally {
                setIsProvinceLoading(false);
            }
        };
        fetchProvinces();
    }, []);

    // Lấy danh sách huyện
    useEffect(() => {
        if (!city) {
            setDistricts([]);
            return;
        }

        const fetchDistricts = async () => {
            setIsDistrictLoading(true);
            try {
                const selectedProvince = memoizedProvinces.find((p) => p.name === city);
                if (selectedProvince) {
                    const response = await axios.get(`https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`);
                    setDistricts(response.data.districts || []);
                } else {
                    setDistricts([]);
                }
            } catch (err) {
                const errorMsg = err.response?.data?.message || 'Không thể tải danh sách quận/huyện.';
                toast.error(errorMsg);
                setErrors((prev) => [...new Set([...prev, errorMsg])]);
                setDistricts([]);
            } finally {
                setIsDistrictLoading(false);
            }
        };
        fetchDistricts();
    }, [city, memoizedProvinces]);

    return { provinces, districts, isProvinceLoading, isDistrictLoading, errors };
};

export default useLocationData;