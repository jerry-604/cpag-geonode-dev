import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, List, Table, Progress } from 'antd';
import '../css/datasets.css';

const { Title } = Typography;

const SummaryPage = () => {
    const [categories, setCategories] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [tkeywords, setTkeywords] = useState([]);
    const [regions, setRegions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
        try {
          setLoading(true);
          setProgress(5);
  
          const regionResponse = axios.get('https://geonode.thecpag.org/api/v2/regions/?page_size=80');
          const catResponse = axios.get('https://geonode.thecpag.org/api/v2/categories/?page_size=30');
          const keyResponse = axios.get('https://geonode.thecpag.org/api/v2/keywords/?page_size=130');
          const tkeyResponse = axios.get('https://geonode.thecpag.org/api/v2/tkeywords/?page_size=37');
  
          const updateProgress = (percent) => {
            setProgress((oldProgress) => oldProgress + percent);
          };
  
          regionResponse.then((response) => {
            setRegions(response.data.regions);
            updateProgress(20);
          });
          
          catResponse.then((response) => {
            setCategories(response.data.categories);
            updateProgress(15);
          });
  
          keyResponse.then((response) => {
            setKeywords(response.data.keywords);
            updateProgress(45);
          });
  
          tkeyResponse.then((response) => {
            setTkeywords(response.data.tkeywords);
            updateProgress(15);
            
          });
  
          await Promise.all([regionResponse, catResponse, keyResponse, tkeyResponse]);
          
  
        } catch (error) {
          console.error("Error fetching data: ", error);
          setProgress(0);
        } finally {
          setLoading(false);
        }
      };
      

    fetchData();
  }, []);

  const regionColumns = [
    {
      title: 'ISO Code',
      dataIndex: 'code',
      key: 'code',
      // width: 500,
      className: 'title-column'

    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
  ];

  const categoryColumns = [
    {
      title: 'Category',
      dataIndex: 'gn_description',
      key: 'gn_description',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  const tkeywordColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    //   width: 500,
      
    },
    {
      title: 'Description',
      dataIndex: 'i18n',
      key: 'i18n',
      render: i18n => i18n && i18n.en ? i18n.en : 'N/A'
    },
  ];

  if (loading) {
    return (
    <div className='Container'> 
        <h3 style={{textAlign:"center", margin:"0px"}}> Generating summary... </h3>
        <Progress className='Container' percent={progress} />
    </div>)
  };

  return (
    <div className='Container'>
      <Title style={{textAlign:"center"}}>Summary</Title>
      <Title level={2}>Categories ({categories.length})</Title>
      <Table
        columns={categoryColumns}
        dataSource={categories}
        rowKey="gn_description"
        pagination={false}
      />
      <Title level={2}>Tkeywords ({tkeywords.length})</Title>
      <Table
        columns={tkeywordColumns}
        dataSource={tkeywords}
        rowKey="name"
        pagination={false}
      />
      <Title level={2}>Regions ({regions.length})</Title>
      <Table
        columns={regionColumns}
        dataSource={regions}
        rowKey="code"
        pagination={false}
      />
      <Title level={2}>Keywords ({keywords.length})</Title>
      <List
        bordered
        dataSource={keywords}
        renderItem={item => (
          <List.Item>
            {item.name}
          </List.Item>
        )}
      />
    </div>
  );
};

export default SummaryPage;
