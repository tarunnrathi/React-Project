import React, { Component } from 'react';
import Axios from 'axios'

export default class TextArray extends Component {
         state = {
        persons: []
      }
      
    componentDidMount() {
        //console.log("devender");
         Axios.get(`http://115.112.34.123:5252/api/usermasters/munuitem`).then((res) => {           
           this.setState({ persons:res.data.Data.MainMenuList });
          console.log(res.data.Data); 
         });         
         
    }
    render() {
     
        return ( 
          
            <div>            
               {
                this.state.persons.map((number) =>
             
				        <li key={number.ID}>
                  {number.ID}
                  {number.MenuName}
                </li>

                  
                                )}
              </div>
        )
    }
}