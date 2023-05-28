
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Modal, Card } from 'antd';
import './page.css';
// import './CountryDatasets.css'; // Import the CSS file
import { CloseOutlined } from '@ant-design/icons';

const CountryDatasets = ({ countryCode }) => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regionName, setRegionName] = useState();
  const [selectedDataset, setSelectedDataset] = useState(null);

  const pageSize = 500;
  const resource = {
    type: 'dataset'
  }
  const apiEndpoint = 'https://geonode.thecpag.org/api/v2/resources';
  const regionApiEndpoint = 'https://geonode.thecpag.org/api/v2/regions';
  const url = `${apiEndpoint}?filter{resource_type}=${resource.type}&page_size=${pageSize}&filter{regions.code}=${countryCode}`;

  useEffect(() => {
    const fetchData = async () => {
        try {
            const regionResponse = await axios.get(`${regionApiEndpoint}?filter{code}=${countryCode}&page_size=${pageSize}`);
            const region = regionResponse.data['regions'][0];
            const countryName = region.name;
            setRegionName(countryName);
            const response = await axios.get(url);
            const rawData = response.data['resources'];
            setDatasets(rawData);
          } catch (error) {
            console.error("Error fetching data: ", error);
          } finally {
            setLoading(false);
          }
        };

    fetchData();
  }, [countryCode, url]);

  const columns = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => category ? category.identifier : '',
      responsive: ['md'],
    //   width: 100,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 1,
    },
    {
      title: 'Abstract',
      dataIndex: 'raw_abstract',
      key: 'abstract',
    },
    {
      title: 'SRID',
      dataIndex: 'srid',
      key: 'srid',
      responsive: ['lg'],
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      responsive: ['lg'],
    },
    {
      title: 'Attribution',
      dataIndex: 'attribution',
      key: 'attribution',
    },
    // {
    //   title: 'Thumbnail Url',
    //   dataIndex: 'thumbnail_url',
    //   key: 'thumbnailUrl',
    // },
    // {
    //   title: 'Link',
    //   dataIndex: 'detail_url',
    //   key: 'detailUrl',
    // },
  ];

  const handleRowClick = (record) => {
    setSelectedDataset(record);
  };

  const handleClose = () => {
    setSelectedDataset(null);
  };

  return (
    <div className="Container">
      <h1 style={ {margin:"1em", top:"0px"}}>Datasets for {regionName}</h1>
      <Table
        columns={columns}
        dataSource={datasets}
        rowKey="id"
        loading={loading}
        pagination={false}
        scroll={{ x: 768 }}
        // scroll={{ x: 'max-content' }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />
      <Modal
        visible={selectedDataset !== null}
        onCancel={handleClose}
        footer={null}
        // closeIcon={<span className="closeIcon">X</span>}
        closeIcon={<CloseOutlined className="closeIcon" />}
      >
        {selectedDataset && (
          <Card
            title={selectedDataset.title}
            extra={<a href={selectedDataset.detail_url}>View Details</a>}
            style={{  margin: "18px", position: 'sticky' }}
          >
            <img src={selectedDataset.thumbnail_url} alt="Thumbnail" style={{ width: '100%',}} />
          </Card>
        )}
      </Modal>
    </div>
  );
};


export default CountryDatasets;