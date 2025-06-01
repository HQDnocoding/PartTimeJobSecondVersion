document.addEventListener('DOMContentLoaded', function () {
    const citySelect = document.getElementById('city');
    const districtSelect = document.getElementById('district');
    var selectedCity = '';
    var selectedDistrict = '';

    function mapToApiFormat(location, isCity = true) {
        if (!location)
            return '';
        if (isCity) {
            return location.replace(/^Thành phố|Tỉnh\s+/, '');
        } else {
            return location.replace(/^(Quận|Huyện)\s+/, '');
    }
    }

    try {

        selectedCity = object && object.city ? object.city : '';
        selectedDistrict = object && object.district ? object.district : '';

        selectedCity = mapToApiFormat(selectedCity, true);
        selectedDistrict = mapToApiFormat(selectedaDistrict, false);

        console.log("0", selectedCity);

    } catch (e) {
        console.log(e);
    }




    console.log("Selected City:", selectedCity);
    console.log("Selected District:", selectedDistrict);

    // Tải danh sách tỉnh/thành phố
    fetch('https://provinces.open-api.vn/api/p/')
            .then(response => response.json())
            .then(provinces => {
                if (!Array.isArray(provinces)) {
                    throw new Error('Dữ liệu thành phố không đúng định dạng');
                }

                citySelect.innerHTML = '<option value="">Chọn Tỉnh/thành phố</option>';
                provinces.forEach(province => {
                    const option = document.createElement('option');
                    option.value = province.name;
                    option.text = province.name;
                    if (province.name === selectedCity) {
                        option.selected = true;
                    }
                    citySelect.appendChild(option);
                });

                if (selectedCity && selectedCity !== '') {
                    const selectedProvince = provinces.find(province => province.name.includes(selectedCity));
                    citySelect.value = selectedProvince.name;
                    console.log("tỉnh", selectedProvince);
                    if (selectedProvince && selectedDistrict) {
                        loadDistricts(selectedProvince.code, selectedDistrict);
                    } else {
                        console.warn(`Không tìm thấy tỉnh/thành phố: ${selectedCity}`);
                    }
                }

                //                // Tải danh sách quận/huyện nếu có selectedCity
                //                if (selectedCity) {
                //                    const selectedProvince = provinces.find(province => province.name === selectedCity);
                //                    if (selectedProvince) {
                //                        loadDistricts(selectedProvince.code, selectedDistrict);
                //                    } else {
                //                        console.warn(`Không tìm thấy tỉnh/thành phố: ${selectedCity}`);
                //                    }
                //                }
            })
            .catch(error => {
                console.error('Lỗi khi tải danh sách thành phố:', error);
            });

    // Sự kiện thay đổi tỉnh/thành phố
    if (districtSelect) {
        citySelect.addEventListener('change', function () {
            const cityName = this.value;
            districtSelect.innerHTML = '<option value="">Chọn quận/huyện</option>';
            if (cityName) {
                fetch('https://provinces.open-api.vn/api/p/')
                        .then(response => response.json())
                        .then(provinces => {
                            const selectedProvince = provinces.find(province => province.name.includes(cityName));
                            if (selectedProvince) {
                                loadDistricts(selectedProvince.code);
                            }
                        })
                        .catch(error => {
                            console.error('Lỗi khi tải danh sách tỉnh/thành phố:', error);
                        });
            }
        });
    }
});

function loadDistricts(cityCode, selectedDistrict = null) {
    fetch(`https://provinces.open-api.vn/api/p/${cityCode}?depth=2`)
            .then(response => response.json())
            .then(data => {
                if (!data.districts || !Array.isArray(data.districts)) {
                    throw new Error('Dữ liệu quận/huyện không đúng định dạng');
                }

                const districtSelect = document.getElementById('district');
                districtSelect.innerHTML = '<option value="">Chọn quận/huyện</option>';
                data.districts.forEach(district => {
                    const option = document.createElement('option');
                    option.value = district.name;
                    option.text = district.name;
                    if (district.name.includes(selectedDistrict)) {
                        option.selected = true;
                        districtSelect.value = district.name;
                    }
                    districtSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Lỗi khi tải danh sách quận/huyện:', error);
            });
}