import React, { useState } from 'react';
import styles from '../styles/Sidebar.module.css';
import { useDarkMode } from '../context/DarkModeContext';

interface SidebarProps {
  regions: string[];
  timezones: string[];
  loggedInUser: string;
  setLoggedInUser: (username: string) => void;
  onFilterRegion: (region: string) => void;
  onFilterTimezone: (timezone: string) => void;
  onSortByPopulation: (order: 'asc' | 'desc') => void;
  onSearch: (query: string) => void;
  onFaveChange: (isChecked: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  regions,
  timezones,
  loggedInUser,
  setLoggedInUser,
  onFilterRegion,
  onFilterTimezone,
  onSortByPopulation,
  onSearch,
  onFaveChange,
}) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedTimezone, setSelectedTimezone] = useState('');
  const { darkMode, toggleDarkMode } = useDarkMode();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const region = e.target.value;
    setSelectedRegion(region);
    onFilterRegion(region);
  };

  const handleTimezoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const timezone = e.target.value;
    setSelectedTimezone(timezone);
    onFilterTimezone(timezone);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortByPopulation(e.target.value as 'asc' | 'desc');
  };

  const handleFaveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    onFaveChange(isChecked);
  };

  const login = async (username: string, password: string) => {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      setIsLoggedIn(true);
      setLoggedInUser(username);
      alert('Login successful!');
    } else {
      alert(data.error);
    }
  };

  const register = async (username: string, password: string) => {
    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Registration successful!');
    } else {
      alert(data.error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setLoggedInUser('');
    alert('Logged out successfully');
  };

  return (
    <div className={`${styles.sidebar} ${darkMode ? 'dark-mode' : ''}`}>
      <h2>Country Data Dashboard</h2>

      {isLoggedIn ? (
        <>
          <h4>Logged in as {loggedInUser}.</h4>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <h4>Please log in.</h4>
          <div className={styles.loginForm}>
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button onClick={() => login(username, password)}>Login</button>
          <button onClick={() => register(username, password)}>Register</button>
        </>
      )}

      <div className={styles.filterGroup}>
        <label htmlFor="search-input">Search by Name or Capital:</label>
        <input
          type="text"
          id="search-input"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by name or capital"
        />
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="region-input">Filter by Region:</label>
        <select id="region-input" value={selectedRegion} onChange={handleRegionChange}>
          <option value="">All Regions</option>
          {regions.map((region) => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label>Filter by Timezone:</label>
        <select value={selectedTimezone} onChange={handleTimezoneChange}>
          <option value="">All Timezones</option>
          {timezones.map((timezone) => (
            <option key={timezone} value={timezone}>{timezone}</option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label>Sort by Population:</label>
        <select onChange={handleSortChange}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>


      {isLoggedIn ? 
        <div className={styles.faveFilter}>
          <label>Show Favorites Only:</label>
          <input
            type="checkbox"
            onChange={handleFaveChange}
            value="favorites"
            className={styles.checkbox}
          />
        </div>
        : null}
    

      <button onClick={toggleDarkMode}>
        {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>
    </div>
  );
};

export default Sidebar;