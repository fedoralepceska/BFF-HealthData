import React, {useEffect, useState} from 'react';
import axios from 'axios';
import path from './environment';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';


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
    return data;
  };

  const getPatientsAndDoctorsData = () => {
    // Fetch data from Patients service
    const patientsDataPromise = getOnlyPatients();

    // Fetch data from Doctors service
    const doctorsDataPromise = getOnlyDoctors();

    // Use Promise.all to wait for both requests to complete
    Promise.all([patientsDataPromise, doctorsDataPromise])
        .then(([patientsData, doctorsData]) => {
          // Combine and merge the data from both services
          const combinedData = mergeData(patientsData, doctorsData);

          // Set the merged data in the state
          setData(combinedData);

          // Extract columns from the merged data
          const allColumns = extractColumns(combinedData);
          setColumns(allColumns);

          // Display columns with capitalized names
          setDisplayColumns(allColumns.map(capitalizeFirstLetter));
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
  };


  const mergeData = (patientsData, doctorsData) => {
    // Helper function to flatten nested objects
    const flattenObject = (obj) => {
      const flatItem = { ...obj };
      if (flatItem.location) {
        flatItem.location = `${flatItem.location.street}, ${flatItem.location.number}, ${flatItem.location.city}, ${flatItem.location.postcode}`;
      }
      return flatItem;
    };

    // Combine the data from both services here
    // Ensure that you handle cases where columns exist in one dataset but not the other
    // You may need to iterate through both datasets and merge them appropriately
    // For columns that don't exist, set null values
    // Example:
    const mergedData = [];
    // Loop through patients data
    for (const patient of patientsData) {
      const mergedRow = flattenObject({ ...patient });
      // Check if the patient data matches any doctor by ID
      const matchingDoctor = doctorsData.find((doctor) => doctor.name === patient.name && doctor.surname === patient.surname);

      // Merge doctor data if a match is found
      if (matchingDoctor) {
        Object.assign(mergedRow, flattenObject(matchingDoctor));
      }

      mergedData.push(mergedRow);
    }
    // Handle any remaining doctors not matched with patients
    for (const doctor of doctorsData) {
      const matchingPatient = mergedData.find((patient) => patient.id === doctor.id);
      if (!matchingPatient) {
        mergedData.push(flattenObject(doctor));
      }
    }
    return mergedData;
  };


  const extractColumns = (data) => {
    // Extract columns from the merged data
    // You can use Set to avoid duplicate column names
    const columnsSet = new Set();
    for (const row of data) {
      for (const column in row) {
        columnsSet.add(column);
      }
    }
    return Array.from(columnsSet);
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

  const getOnlyPatients = () => {
    return axios.get(`${path}/patients`)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error('Error fetching patients:', error);
          throw error; // Re-throw the error to handle it later if needed
        });
  };

  const getOnlyDoctors = () => {
    return axios.get(`${path}/doctors`)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error('Error fetching doctors:', error);
          throw error; // Re-throw the error to handle it later if needed
        });
  };

  const filterColumns = () => {
    return columns.filter((column) => column !== 'id');
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
      <div className="app">
        <img src="/images/logo.png" alt="Logo" className="logo" />
        <ul className="navigation-menu">
          <li onClick={getPatients}>Patients</li>
          <li onClick={getDoctors}>Doctors</li>
          <li onClick={getPatientsAndDoctorsData}>Patients + Doctors</li>
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
                        <button onClick={() => deleteRow(item.id)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
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
