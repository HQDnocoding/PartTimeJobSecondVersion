import React from 'react';
import MapAddressSelector from '../Map/MapboxAddressSelector';

const AddressForm = ({ errors, loading, onAddressSelect }) => {
  return (

        <MapAddressSelector
          onAddressSelect={onAddressSelect}
          disabled={loading}
          isInvalid={errors.includes('Địa chỉ làm việc là bắt buộc.')}
        />

  );
};

export default AddressForm;