import {useEffect, useState} from 'react'
import {fetchData} from "./services/api.js";
import CustomSelect from "./ui/CustomSelect/CustomSelect.jsx";
import './App.scss';

function App() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const names = await fetchData();
        setList(names);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    })();
  }, []);

  const handleChangeSelect = (e) => {
    console.log(e);
  }

  return (
    <>
      <CustomSelect
        list={list}
        loading={loading}
        width="300px"
        placeholder="Please select an item..."
        onChange={(e) => handleChangeSelect(e)}
      />
    </>
  )
}

export default App;
