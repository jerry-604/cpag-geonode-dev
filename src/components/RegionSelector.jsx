import React, { useState, useEffect } from 'react';
import { Select, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const RegionSelector = () => {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch('https://geonode.thecpag.org/api/v2/regions?page_size=200');
        const data = await response.json();
        const filteredRegions = data.regions.filter(region => region.count > 0);
        setRegions(filteredRegions);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching regions:', error);
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  const handleChange = (value) => {
    navigate(`/geonode/datasets/${value}`);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Spin indicator={<LoadingOutlined />} />
        <div style={{ marginLeft: 8 }}>Loading regions...</div>
      </div>
    );
  }

  return (
    <Select style={{ width: 200 }} onChange={handleChange} placeholder="Select a region">
      {regions.map((region) => (
        <Option key={region.id} value={region.code}>
          {region.name}
        </Option>
      ))}
    </Select>
  );
};

export default RegionSelector;
