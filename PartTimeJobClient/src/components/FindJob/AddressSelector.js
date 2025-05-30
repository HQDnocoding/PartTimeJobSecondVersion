import React, { useState, useEffect, useRef } from 'react';
import { Form, ListGroup } from 'react-bootstrap';
import debounce from 'lodash.debounce';

const AddressSelector = ({ onAddressSelect, disabled, isInvalid }) => {
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  const HERE_API_KEY = process.env.REACT_APP_HERE_API_KEY;

  // Load HERE Maps JavaScript API
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
        setIsLoaded(true);
        return;
      }

      try {
        await loadScript('https://js.api.here.com/v3/3.1/mapsjs-core.js');
        await loadScript('https://js.api.here.com/v3/3.1/mapsjs-service.js');
        setIsLoaded(true);
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

  // Fetch address suggestions
  const fetchSuggestions = async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://autosuggest.search.hereapi.com/v1/autosuggest?at=10.7769,106.7009&q=${encodeURIComponent(query)}&in=countryCode:VNM&limit=5&resultType=address,place&lang=vi&apiKey=${encodeURIComponent(HERE_API_KEY)}`
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
      console.error('Error fetching suggestions:', error);
      setError(`Lỗi khi lấy gợi ý: ${error.message}`);
    }
  };

  const debouncedFetchSuggestions = useRef(
    debounce((query) => fetchSuggestions(query), 500)
  ).current;

  const handleAddressChange = (e) => {
    const query = e.target.value;
    setAddress(query);
    debouncedFetchSuggestions(query);
  };

  const handleSuggestionClick = (suggestion) => {
    try {
      if (!suggestion.position || (!suggestion.address?.label && !suggestion.title)) {
        setError('Gợi ý không hợp lệ: thiếu địa chỉ hoặc tọa độ');
        return;
      }

      const { lng, lat } = suggestion.position;
      const displayAddress = suggestion.address?.label || suggestion.title;
      let suggestionDistrict = suggestion.address?.district || '';
      let suggestionCity = suggestion.address?.city || suggestion.address?.county || '';

      // Parse label to extract district and city
      if (!suggestionDistrict || !suggestionCity) {
        const addressParts = displayAddress.split(',').map(part => part.trim());
        suggestionCity = '';
        suggestionDistrict = '';

        for (let i = addressParts.length - 1; i >= 0; i--) {
          const part = addressParts[i];
          if (part.match(/Hồ Chí Minh|Đà Nẵng|Hà Nội|Thành phố/)) {
            suggestionCity = part.replace(/Thành phố /, '');
          } else if (part.match(/Quận|Huyện/)) {
            suggestionDistrict = part;
          }
        }
        if (!suggestionCity && addressParts.length > 0) {
          suggestionCity = addressParts[addressParts.length - 1];
        }
        if (!suggestionDistrict && addressParts.length > 1) {
          suggestionDistrict = addressParts[addressParts.length - 2];
        }
      }

      setAddress(displayAddress);
      setSuggestions([]);

      onAddressSelect({
        address: displayAddress,
        coordinates: [lng, lat],
        district: suggestionDistrict || 'Chưa xác định',
        city: suggestionCity || 'Chưa xác định',
      });
    } catch (err) {
      console.error('Error handling suggestion:', err);
      setError(`Lỗi khi xử lý gợi ý: ${err.message}`);
    }
  };

  return (
    <Form.Group className="mb-2">
      <Form.Label>Địa chỉ</Form.Label>
      {!isLoaded && <div className="text-info">Đang tải...</div>}
      {error && <div className="text-danger">{error}</div>}
      <Form.Control
        type="text"
        value={address}
        onChange={handleAddressChange}
        placeholder="Nhập địa chỉ (ví dụ: 123 Lê Lợi, Quận 1, Hồ Chí Minh)"
        disabled={disabled || !isLoaded}
        isInvalid={isInvalid}
      />
      <Form.Control.Feedback type="invalid">
        Vui lòng nhập địa chỉ hợp lệ.
      </Form.Control.Feedback>
      {suggestions.length > 0 && isLoaded && (
        <ListGroup
          style={{
            position: 'absolute',
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
    </Form.Group>
  );
};

export default AddressSelector;