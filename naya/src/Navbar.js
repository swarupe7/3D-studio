import React from 'react';
import './navb.css';

const Navbar = () => {
  return (
    <>
    <nav className="navbar bg-dark">
        <div className="container-fluid" style={{ display: "flex", justifyContent: "space-around",alignItems: "center" }}>
            <a className="navbar-brand text-light" href="/" >
              <b> <h1> 3D Studio </h1>  </b>
            </a>
           
        </div>
    </nav>
    
    </>
  )
}

export default Navbar