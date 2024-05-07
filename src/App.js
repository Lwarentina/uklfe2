import React from 'react';
import Main from './pages/main';
import {Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

class App extends React.Component {
  render() {
    return(
      <div><hr />
        <ul class="nav justify-content-left">
          <li class="nav-item">
            <Link class="nav-link" to="/menu">menu</Link>
          </li>        
          <li class="nav-item">
            <Link class="nav-link" to="/riwayat">riwayat</Link>
          </li>       
        </ul>
        <ul class="nav justify-content-left">
          <li class="nav-item">
            <Link class="nav-link" to="/login">logout</Link>
          </li>  
        </ul>
        <hr />
        <p><Main /></p>
      </div>
    );
  } 
}

export default App;