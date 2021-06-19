import React, { Link, Component } from 'react';
import Axios from 'axios'
class Table extends React.Component {
    state = {
        countries: []
      }
      componentDidMount() {
        //console.log("devender");
         Axios.get(`http://115.112.34.123:5252/api/hrapi/MenuItem`).then((res) => {           
           this.setState({ countries:res.data.Data.MainMenuList });
          console.log(res.data.Data); 
         });         
    }
  render () {
    return (
      <>
        {
             this.state.countries.map((hmenu)=>
            <tr>
            <td>{hmenu.ID}</td>
            <td>{hmenu.MenuName}</td>
            <td><ul>
                {
                  hmenu.SubMenu.map((sub)=>
                  <li> {sub.MenuName}</li>
                )} 
                </ul>
             </td>
            <td>
              <ul>
                {
                this.state.countries.map((ssub)=>
                  <li key ={ssub.ID}> {ssub.MenuName}</li>
                )} 
              </ul>
            </td>
            
            </tr>
        )}
        
      </>
    );
  }
}

export default Table;