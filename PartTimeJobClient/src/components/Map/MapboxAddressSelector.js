import React, { useState, useEffect, useRef } from 'react';
import { Form, ListGroup, Row, Col } from 'react-bootstrap';
import debounce from 'lodash.debounce';
import useLocationData from '../Authenticate/useLocationData';

const MapAddressSelector = ({ onAddressSelect, disabled, isInvalid }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const marker = useRef(null);
    const platform = useRef(null);
    const [address, setAddress] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [coordinates, setCoordinates] = useState([105.8342, 21.0278]);
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [error, setError] = useState(null);

    const HERE_API_KEY = process.env.REACT_APP_HERE_API_KEY;
    const { provinces, districts, isProvinceLoading, isDistrictLoading, errors: locationErrors } = useLocationData(selectedCity);

    const debouncedFetchSuggestions = useRef(
        debounce((query, coords) => fetchSuggestions(query, coords), 400)
    ).current;

    useEffect(() => {
        return () => {
            debouncedFetchSuggestions.cancel(); // Hủy debounce khi component unmount
        };
    }, []);

    // Xử lý lỗi từ useLocationData
    useEffect(() => {
        if (locationErrors.length > 0) {
            setError(locationErrors.join(', '));
        }
    }, [locationErrors]);

    //truyền dữ liệu địa chỉ
    useEffect(() => {
        if (selectedCity || selectedDistrict || address) {
            onAddressSelect({
                address,
                coordinates: coordinates.map(String),
                district: selectedDistrict || 'Chưa xác định',
                city: selectedCity || 'Chưa xác định',
            });
        }
    }, [selectedCity, selectedDistrict, address, coordinates, onAddressSelect]);

    // Tải HERE Maps API
    useEffect(() => {
        if (!HERE_API_KEY) {
            setError('Thiếu HERE API Key. Vui lòng kiểm tra cấu hình.');
            return;
        }

        const loadScript = (src) => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.async = true;
                script.onload = resolve;
                script.onerror = () => reject(new Error(`Không tải được ${src}`));
                document.head.appendChild(script);
            });
        };

        const loadHereMaps = async () => {
            if (window.H) {
                setIsMapLoaded(true);
                return;
            }

            try {
                await loadScript('https://js.api.here.com/v3/3.1/mapsjs-core.js');
                await loadScript('https://js.api.here.com/v3/3.1/mapsjs-service.js');
                await loadScript('https://js.api.here.com/v3/3.1/mapsjs-mapevents.js');
                await loadScript('https://js.api.here.com/v3/3.1/mapsjs-ui.js');
                setIsMapLoaded(true);
            } catch (err) {
                console.error('Lỗi khi tải script:', err);
                setError(`Lỗi khi tải HERE Maps API: ${err.message}`);
            }
        };

        loadHereMaps();

        return () => {
            const scripts = document.querySelectorAll('script[src*="mapsjs-"]');
            scripts.forEach((script) => script.remove());
        };
    }, [HERE_API_KEY]);

    // Resize bản đồ
    const resize = () => {
        if (map.current) {
            map.current.getViewPort().resize();
        }
    };

    // Khởi tạo bản đồ và thêm sự kiện click
    useEffect(() => {
        if (!isMapLoaded || !window.H || !HERE_API_KEY || error || !mapContainer.current) {
            return;
        }

        try {
            platform.current = new window.H.service.Platform({
                apikey: HERE_API_KEY,
            });

            const defaultLayers = platform.current.createDefaultLayers();
            map.current = new window.H.Map(
                mapContainer.current,
                defaultLayers.vector.normal.map,
                {
                    center: { lng: coordinates[0], lat: coordinates[1] },
                    zoom: 14,
                    pixelRatio: window.devicePixelRatio || 1,
                }
            );

            marker.current = new window.H.map.Marker({ lng: coordinates[0], lat: coordinates[1] });
            map.current.addObject(marker.current);

            // Thêm sự kiện click vào bản đồ
            const behavior = new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(map.current));
            map.current.addEventListener('tap', async (evt) => {
                const coord = map.current.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
                setCoordinates([coord.lng, coord.lat]);
                marker.current.setGeometry({ lng: coord.lng, lat: coord.lat });
                map.current.setCenter({ lng: coord.lng, lat: coord.lat });
                map.current.setZoom(16);

                // Lấy địa chỉ từ tọa độ (reverse geocoding)
                try {
                    const response = await fetch(
                        `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${coord.lat},${coord.lng}&lang=vi&apiKey=${encodeURIComponent(HERE_API_KEY)}`
                    );
                    if (!response.ok) {
                        throw new Error('Lỗi khi lấy địa chỉ từ tọa độ');
                    }
                    const data = await response.json();
                    const addressLabel = data.items[0]?.address?.label || 'Không tìm thấy địa chỉ';
                    setAddress(addressLabel);
                } catch (err) {
                    setError(`Lỗi khi lấy địa chỉ: ${err.message}`);
                }
            });

            window.addEventListener('resize', resize);

            return () => {
                window.removeEventListener('resize', resize);
                if (map.current) {
                    map.current.dispose();
                }
            };
        } catch (err) {
            setError(`Lỗi khi khởi tạo bản đồ: ${err.message}`);
        }
    }, [isMapLoaded, HERE_API_KEY, error]);

    // Cập nhật marker khi tọa độ thay đổi
    useEffect(() => {
        if (!map.current || !marker.current) return;

        marker.current.setGeometry({ lng: coordinates[0], lat: coordinates[1] });
        map.current.setCenter({ lng: coordinates[0], lat: coordinates[1] });
        map.current.setZoom(16);
    }, [coordinates]);

    // Tìm kiếm gợi ý địa chỉ
    const fetchSuggestions = async (query, coords) => {
        if (!query || query.length < 3) {
            setSuggestions([]);
            return;
        }

        try {
            console.log('Tọa độ gửi API:', coords); 
            const response = await fetch(
                `https://autosuggest.search.hereapi.com/v1/autosuggest?at=${coords[1]},${coords[0]}&q=${encodeURIComponent(query)}&in=countryCode:VNM&limit=10&resultType=address,place&lang=vi&apiKey=${encodeURIComponent(HERE_API_KEY)}`
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Lỗi API: ${errorData.error || response.statusText}`);
            }

            const data = await response.json();
            const validSuggestions = (data.items || []).filter(
                (item) => (item.address && item.address.label) || item.title
            );
            setSuggestions(validSuggestions);
        } catch (error) {
            console.error('Lỗi khi lấy gợi ý:', error);
            setError(`Lỗi khi lấy gợi ý: ${error.message}`);
        }
    };

    const handleAddressChange = (e) => {
        const query = e.target.value;
        setAddress(query);
        if (query && query.length >= 3) {
            debouncedFetchSuggestions(query, coordinates); // Truyền coordinates hiện tại
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        try {
            if (!suggestion.position || (!suggestion.address?.label && !suggestion.title)) {
                setError('Gợi ý không hợp lệ: thiếu địa chỉ hoặc tọa độ.');
                return;
            }

            if (!map.current || !marker.current) {
                setError('Bản đồ chưa được khởi tạo.');
                return;
            }

            const { lng, lat } = suggestion.position;
            const displayAddress = suggestion.address?.label || suggestion.title;

            setAddress(displayAddress);
            setCoordinates([lng, lat]);
            setSuggestions([]);
        } catch (err) {
            console.error('Lỗi khi chọn gợi ý:', err);
            setError(`Lỗi khi chọn gợi ý: ${err.message}`);
        }
    };

    // Xử lý chọn tỉnh
    const handleCityChange = (e) => {
        const city = e.target.value;
        setSelectedCity(city);
        setSelectedDistrict(''); 
    };

    // Xử lý chọn huyện và lấy tọa độ
    const handleDistrictChange = async (e) => {
        const district = e.target.value;
        setSelectedDistrict(district);

        if (district && selectedCity) {
            try {
                const query = `${district}, ${selectedCity}, Việt Nam`;
                const response = await fetch(
                    `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(query)}&apiKey=${encodeURIComponent(HERE_API_KEY)}`
                );
                if (!response.ok) {
                    throw new Error('Lỗi khi lấy tọa độ từ huyện và tỉnh');
                }
                const data = await response.json();
                if (data.items && data.items.length > 0) {
                    const { lng, lat } = data.items[0].position;
                    setCoordinates([lng, lat]);
                    setAddress(data.items[0].address.label || `${district}, ${selectedCity}`);
                } else {
                    setError('Không tìm thấy tọa độ cho khu vực này.');
                }
            } catch (err) {
                setError(`Lỗi khi lấy tọa độ: ${err.message}`);
            }
        }
    };

    return (
        <Form.Group as={Row} className="mb-3" style={{ justifyContent: 'space-between' }}>
            <Form.Label column md={3}>
                Địa chỉ làm việc
            </Form.Label>
            <Col md={8}>
                {(isProvinceLoading || isDistrictLoading || !isMapLoaded) && (
                    <div className="text-info">Đang tải dữ liệu...</div>
                )}
                {error && <div className="text-danger">{error}</div>}

                <Form.Select
                    className="mb-3"
                    value={selectedCity}
                    onChange={handleCityChange}
                    disabled={disabled || isProvinceLoading || !isMapLoaded}
                    aria-label="Chọn tỉnh/thành phố"
                >
                    <option value="">Chọn tỉnh/thành phố</option>
                    {provinces.map((province) => (
                        <option key={province.code} value={province.name}>
                            {province.name}
                        </option>
                    ))}
                </Form.Select>

                <Form.Select
                    className="mb-3"
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    disabled={!selectedCity || isDistrictLoading || !isMapLoaded || disabled}
                    aria-label="Chọn quận/huyện"
                >
                    <option value="">Chọn quận/huyện</option>
                    {districts.map((district) => (
                        <option key={district.code} value={district.name}>
                            {district.name}
                        </option>
                    ))}
                </Form.Select>

                <Form.Control
                    type="text"
                    value={address}
                    onChange={handleAddressChange}
                    placeholder="Nhập địa chỉ cụ thể"
                    disabled={disabled || !isMapLoaded || isProvinceLoading}
                    isInvalid={isInvalid}
                />
                <Form.Control.Feedback type="invalid">
                    Vui lòng nhập địa chỉ làm việc.
                </Form.Control.Feedback>

                {suggestions.length > 0 && isMapLoaded && (
                    <ListGroup
                        style={{
                            position: 'relative',
                            zIndex: 1000,
                            width: '100%',
                            maxHeight: '200px',
                            overflowY: 'auto',
                        }}
                    >
                        {suggestions.map((suggestion) => (
                            <ListGroup.Item
                                key={suggestion.id}
                                action
                                onClick={() => handleSuggestionClick(suggestion)}
                            >
                                {suggestion.address?.label || suggestion.title || 'Không có tên'}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}

                <div
                    ref={mapContainer}
                    style={{ height: '300px', borderRadius: '8px', marginTop: '10px' }}
                />

                {address && (
                    <div className="address-info mt-2">
                        <p><strong>Quận/Huyện:</strong> {selectedDistrict || 'Chưa chọn'}</p>
                        <p><strong>Thành phố:</strong> {selectedCity || 'Chưa chọn'}</p>
                        <p><strong>Tọa độ:</strong> Kinh độ {coordinates[0]}, Vĩ độ {coordinates[1]}</p>
                    </div>
                )}
            </Col>
        </Form.Group>
    );
};

export default MapAddressSelector;