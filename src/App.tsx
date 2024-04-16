import React, { useState, useEffect } from 'react';
import './App.css';

interface Customer {
  id: number;
  name: string;
  title: string;
  address: string;
}

const mockCustomers: Customer[] = [
  { id: 1, name: 'John Doe', title: 'CEO', address: '123 Main St' },
  { id: 2, name: 'Jane Smith', title: 'CTO', address: '456 Elm St' },
  { id: 3, name: 'Richard Smith', title: 'CFO', address: 'District of Columbia, USA' },
  { id: 4, name: 'Jason', title: 'COO', address: 'Arizona, USA' },
  { id: 5, name: 'Robert Hendrinkson', title: 'RN', address: 'Texas, USA' },
  { id: 6, name: 'Norman Johnson', title: 'CMDO', address: 'Florida, USA' }
];

const ACCESS_KEY = '_rl9jAoOaQIsKx44om76CUtKOeJ_umVaRqF6V1uNQe0';

const App: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);
  const [photosLoaded, setPhotosLoaded] = useState<boolean>(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch(`https://api.unsplash.com/photos/random?count=9&query=man&client_id=${ACCESS_KEY}`);
        const data = await response.json();
        const urls = data.map((photo: any) => photo.urls.small);
        setPhotoUrls(urls);
        setPhotosLoaded(true);

        const interval = setInterval(() => {
          setCurrentPhotoIndex(prevIndex => (prevIndex + 1) % urls.length);
        }, 10000);

        return () => clearInterval(interval);
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    };

    fetchPhotos();
  }, []);

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  return (
    <div className="app">
      <div className="customer-list">
        {mockCustomers.map(customer => (
          <div
            key={customer.id}
            className={`customer-card ${selectedCustomer?.id === customer.id ? 'selected' : ''}`}
            onClick={() => handleCustomerClick(customer)}
          >
            <h3>{customer.name}</h3>
            <p>{customer.title}</p>
          </div>
        ))}
      </div>
      <div className="customer-details">
        {selectedCustomer && (
          <>
            <h2>{selectedCustomer.name}</h2>
            <p>Title: {selectedCustomer.title}</p>
            <p>Address: {selectedCustomer.address}</p>
            <div className="photo-grid">
              {photosLoaded &&
                photoUrls.map((url, index) => (
                  <img
                    key={index}
                    src={index === currentPhotoIndex ? url : ''}
                    alt={`Photo ${index + 1}`}
                  />
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
