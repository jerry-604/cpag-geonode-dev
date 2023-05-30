import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Modal, Card } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import 'font-awesome/css/font-awesome.min.css';
import '../css/datasets.css';

const CountryDatasets = ({ countryCode }) => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regionName, setRegionName] = useState();
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [categoryIcons, setCategoryIcons] = useState({});

  const pageSize = 500;
  const resource = {
    type: 'dataset'
  };
  const apiEndpoint = 'https://geonode.thecpag.org/api/v2/resources';
  const regionApiEndpoint = 'https://geonode.thecpag.org/api/v2/regions';
  const categoryApiEndpoint = 'https://geonode.thecpag.org/api/v2/categories';
  const url = `${apiEndpoint}?filter{resource_type}=${resource.type}&page_size=${pageSize}&filter{regions.code}=${countryCode}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const regionResponse = await axios.get(`${regionApiEndpoint}?filter{code}=${countryCode}&page_size=${pageSize}`);
        const region = regionResponse.data['regions'][0];
        const countryName = region.name;
        setRegionName(countryName);

        const categoryResponse = await axios.get(`${categoryApiEndpoint}?page_size=${pageSize}`);
        const categories = categoryResponse.data['categories'];
        let icons = {};
        for (let category of categories) {
          icons[category.identifier] = {
            faClass: category.fa_class,
            gnDescriptionEn: category.gn_description_en
          };
        }
        setCategoryIcons(icons);

        const response = await axios.get(url);
        const rawData = response.data['resources'];
        setDatasets(rawData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchData();
  }, [countryCode, url]);

  const columns = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) =>
        category ? (
          <>
            <i className={`fa ${categoryIcons[category.identifier].faClass}`} />
            &nbsp;&nbsp;&nbsp;
            {categoryIcons[category.identifier].gnDescriptionEn}
          </>
        ) : (
          'N/A'
        ),
      responsive: ['md'],
      className: 'title-column'
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title) => (title ? title : 'N/A'),
      className: 'title-column'
    },
    {
      title: 'Abstract',
      dataIndex: 'raw_abstract',
      key: 'abstract',
      render: (raw_abstract) => (raw_abstract ? raw_abstract : 'N/A')
    },
    {
      title: 'SRID',
      dataIndex: 'srid',
      key: 'srid',
      render: (srid) => (srid ? srid : 'N/A'),
      responsive: ['xl']
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => (date ? date : 'N/A'),
      responsive: ['xl']
    },
    {
      title: 'Attribution',
      dataIndex: 'attribution',
      key: 'attribution',
      render: (attribution) => (attribution ? attribution : 'N/A'),
      responsive: ['md']
    }
  ];

  const handleRowClick = (record) => {
    setSelectedDataset(record);
  };

  const handleClose = () => {
    setSelectedDataset(null);
  };

  return (
    <>
      {regionName && (
        <h1 style={{ margin: '1em', top: '0px' }}>Datasets for {regionName}</h1>
      )}
      <Table
        columns={columns}
        dataSource={datasets}
        rowKey="id"
        loading={loading}
        pagination={false}
        scroll={{ x: 20 }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record)
        })}
      />
      <Modal
        visible={selectedDataset !== null}
        onCancel={handleClose}
        footer={null}
        closeIcon={<CloseOutlined className="closeIcon" />}
      >
        {selectedDataset && (
          <Card
            title={selectedDataset.title}
            extra={<a href={selectedDataset.detail_url}>View Details</a>}
            style={{ margin: '18px', position: 'sticky' }}
          >
            <img
              src={selectedDataset.thumbnail_url}
              alt="Thumbnail"
              style={{ width: '100%' }}
            />
          </Card>
        )}
      </Modal>
    </>
  );
};

export default CountryDatasets;
