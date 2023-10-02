import React, {useEffect, useState} from 'react';
import axios from 'axios';
import path from './environment';
import './App.css';

function App() {
  const [data, setData] = useState('');
  const [columns, setColumns] = useState([]);
  const [displayColumns, setDisplayColumns] = useState([]);
  const [currentRoute, setCurrentRoute] = useState('/');

  const setRouteAndGetData = (route) => {
    setCurrentRoute(route);
    fetchData(route);
  };

  useEffect(() => {
    fetchData(currentRoute);
  }, [currentRoute]);


  const fetchData = (route) => {
    axios.get(`${path}${route}`).then((response) => {
      // Flatten the nested objects in the data
      const flattenedData = response.data.map((item) => {
        const flatItem = { ...item };
        if (flatItem.location) {
          flatItem.location = `${flatItem.location.street}, ${flatItem.location.number}, ${flatItem.location.city}, ${flatItem.location.postcode}`;
        }
        return flatItem;
      });

      setData(flattenedData);

      // Assuming the data structure is consistent, set the columns based on the first item in the data array
      if (flattenedData.length > 0) {
        const originalColumns = Object.keys(flattenedData[0]);
        setColumns(originalColumns);
        setDisplayColumns(originalColumns.map(capitalizeFirstLetter)); // Capitalize column names
      }
    });
  };

  const deleteRow = (id) => {
    axios
        .delete(`${path}${currentRoute}/${id}`)
        .then((response) => {
          if (response.status === 200) {
            fetchData(currentRoute); // Refresh the list of doctors
          } else {
            console.error('Failed to delete item');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  };


  const getPatients = () => {
    setRouteAndGetData('/patients');
  };

  const getDoctors = () => {
    setRouteAndGetData('/doctors');
  };

  const filterColumns = () => {
    return columns.filter((column) => column !== 'id');
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
      <div className="app">
        <ul className="navigation-menu">
          <li onClick={getPatients}>Patients</li>
          <li onClick={getDoctors}>Doctors</li>
        </ul>

        {data.length > 0 && (
            <div className="app-renderer">
              <table>
                <thead>
                <tr>
                  {filterColumns().map((column, index) => (
                      <th key={column}>{displayColumns[index]}</th>
                  ))}
                  <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item, rowIndex) => (
                    <tr key={rowIndex}>
                      {filterColumns().map((column, colIndex) => (
                          <td key={column + rowIndex}>{item[column]}</td>
                      ))}
                      <td>
                        <button onClick={() => deleteRow(item.id)}>Delete</button>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}
      </div>
  );
}

export default App;
