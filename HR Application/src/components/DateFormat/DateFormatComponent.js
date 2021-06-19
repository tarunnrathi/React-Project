import React,{ Component } from 'react';

class DateFormatComponent extends Component{
    constructor(props){
        super(props);
    }

    render(){
       //debugger
        var monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                               "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                              ];
                              
        var monthNames = ["January", "February", "March", "April", "May", "June",
                          "July", "August", "September", "October", "November", "December"
                         ]; 
                         
                         
                         
        if(this.props.dateFormatString==="dd/MM/yyyy" && this.props.dateObj!==null){
            return(
                <>               
                {("0" + this.props.dateObj.getDate()).slice(-2)}/{( monthShortNames[ this.props.dateObj.getMonth()] )}/{ this.props.dateObj.getFullYear()}   
                </>
            )
        }

        if(this.props.dateFormatString==="dd/MMMM/yyyy" && this.props.dateObj!==null){
            return(
                <>               
                {("0" + this.props.dateObj.getDate()).slice(-2)}/{( monthNames[ this.props.dateObj.getMonth()] )}/{ this.props.dateObj.getFullYear()}   
                </>
            )
        }


        if(this.props.dateFormatString==="dd/MM/yyyy hh:mm:ss" && this.props.dateObj!==null){
            return(
                <>
                {("0" + this.props.dateObj.getDate()).slice(-2)}/{( monthShortNames[ this.props.dateObj.getMonth()] )}/{ this.props.dateObj.getFullYear()} {this.props.dateObj.getHours()}:{this.props.dateObj.getMinutes()}:{this.props.dateObj.getSeconds()}   
                </>
            )
        }


        if(this.props.dateFormatString==="dd/MMMM/yyyy hh:mm:ss" && this.props.dateObj!==null){
            return(
                <>
                {("0" + this.props.dateObj.getDate()).slice(-2)}/{( monthNames[ this.props.dateObj.getMonth()] )}/{ this.props.dateObj.getFullYear()} {this.props.dateObj.getHours()}:{this.props.dateObj.getMinutes()}:{this.props.dateObj.getSeconds()}   
                </>
            )
        }

        
    }

}

export default DateFormatComponent;