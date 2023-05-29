
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Modal, Card } from 'antd';
import '../css/datasets.css'
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
      render: (category) => category ? category.identifier : 'N/A',
      responsive: ['md'],
      className: 'title-column',

    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title) => title ? title : 'N/A',
      className: 'title-column'
    },
    {
        title: 'Abstract',
        dataIndex: 'raw_abstract',
        key: 'abstract',
        render: (raw_abstract) => raw_abstract ? raw_abstract : 'N/A',
    },
    {
      title: 'SRID',
      dataIndex: 'srid',
      key: 'srid',
      render: (srid) => srid ? srid : 'N/A',
      responsive: ['xl'],
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => date ? date : 'N/A',
      responsive: ['xl'],
    },
    {
      title: 'Attribution',
      dataIndex: 'attribution',
      key: 'attribution',
      render: (attribution) => attribution ? attribution : 'N/A',
      responsive: ['md'],
    },
];


    
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


  const handleRowClick = (record) => {
    setSelectedDataset(record);
  };

  const handleClose = () => {
    setSelectedDataset(null);
  };

  return (
    <div className="Container">
     {regionName && <h1 style={ {margin:"1em", top:"0px"}}>Datasets for {regionName}</h1>}
      <Table
        columns={columns}
        dataSource={datasets}
        rowKey="id"
        loading={loading}
        pagination={false}
        scroll={{ x: 20 }}
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