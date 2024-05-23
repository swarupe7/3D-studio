// src/App.js
import './appi.css';
import React,{useState,useEffect} from 'react';
import GLBViewer from './GLBViewer';
import Navbar from './Navbar';
import axios from 'axios';



function App() {

  const [models, setModels] = useState([]);
  
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await axios.get('https://threed-studio.onrender.com/models');
        setModels(response.data);
        console.log(models);
      } catch (error) {
        console.error('Error fetching models: ', error);
      }
    };
    fetchModels();
  }, []);

  

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('model', file);
    formData.append('name', file.name);

    try {
      const response = await axios.post('https://threed-studio.onrender.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data);
    } catch (error) {
      alert('Error uploading file: ' + error.message);
    }
  };

  return (
    <>
    <Navbar />
     <div className="App">

      <div className="dataCard">
        
        <b>
        This Project aims to demonstrate 3D objects from the DataBase Available . 
          Click here to upload a 3D model (only upload .glb files) 
        </b>
         <br />
         <div className="file" style={{margin:'0.1em auto', paddingLeft:'9.8em'}}>
          
         <input type="file"  onChange={handleFileChange} />
        
        <button  style={{border:'none' , backgroundColor:'blue', color:'white', padding:'0.2em'}}onClick={handleUpload} >UPLOAD</button>
         </div>
      </div>


{models.map((model, index) => (
          <div key={model._id} className={`dataCard ${index % 2 === 0 ? 'leftCard' : 'rightCard'}`}>
            <GLBViewer url={`https://threed-studio.onrender.com/models/${model._id}`} />
          </div>
        ))}

      </div>
    </>
  );
}

export default App;
