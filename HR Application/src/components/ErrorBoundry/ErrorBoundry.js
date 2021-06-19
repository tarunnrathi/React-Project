import React, { Component } from 'react';

class ErrorBoundry extends Component{
    constructor(props){
        super(props);
        this.state={error:null,errorInfo:null}
    }

    componentDidCatch(error,errorInfo){
        this.setState({
            error:error,
            errorInfo:errorInfo
        });
    }

    render(){
        debugger
        if(this.state.errorInfo){
            return(
                <div style={{position:'relative',left:'50px',left: '524px',position:'absolute'}}>
                     <h3>Something wrong.</h3>                    
                </div>
            )
        }
        return this.props.children;        
    }
}

export default ErrorBoundry;