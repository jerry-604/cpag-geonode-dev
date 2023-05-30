import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Tooltip, Badge, Spin } from 'antd';
import 'font-awesome/css/font-awesome.min.css';
import '../css/summary.css';

const SummaryPage = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://geonode.thecpag.org/api/v2/categories?page_size=40');
        const categoriesData = response.data.categories;
        const filteredCategories = categoriesData.filter(category => category.count > 0);
        setCategories(filteredCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      {isLoading ? (
        <div className="loading-message">
          <Spin size="large" />
          <h3>Generating Summary...</h3>
        </div>
      ) : (
        <>
          <h1 className="summary-title">Summary</h1>
          <div className="category-list">
            {categories.map(category => (
              <Tooltip title={category.description} key={category.id}>
                <Card className="category-card center-align">
                  <a href={`https://geonode.thecpag.org/catalogue/#/?filter%7Bcategory.identifier.in%7D=${category.identifier}`} className="category-link">
                    <span>
                      <i className={`fa ${category.fa_class} fa-4x`}></i>
                      <Badge count={`${category.count}`} showZero className="category-count-badge" style={{ backgroundColor: '#1850f6' }} />
                    </span>
                    <div className="category-description">{category.gn_description_en}</div>
                  </a>
                </Card>
              </Tooltip>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SummaryPage;
