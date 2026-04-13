import React from "react";
import {AlertTriangle} from 'lucide-react';

class ErrorBoundary extends React.Component{
    constructor(props){
        super(props);
        this.state = {hasError: false, error:null};
    }
    static getDerivedStateFromError(error){
        return {hasError:true,error};
    }
    componentDidCatch(error,errorInfo){
        console.log('Error caught by boundary:', error,errorInfo);
    }
    render(){
        if(this.state.hasError){
            return(
                    <div style={{
          padding: '40px',
          textAlign: 'center',
          backgroundColor: '#fef2f2',
          border: '2px solid #fecaca',
          borderRadius: '8px',
          margin: '20px'
        }}>
          <AlertTriangle size={48} color="#dc2626" style={{marginBottom: '16px'}} />
          <h2 style={{color: '#dc2626', marginBottom: '8px'}}>
            Oops! Something went wrong
          </h2>
          <p style={{color: '#7f1d1d', marginBottom: '16px'}}>
            We encountered an error. Please try refreshing the page or come back later.
          </p>
          <p style={{color: '#991b1b', fontSize: '12px', marginTop: '12px'}}>
            Error: {this.state.error?.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '16px',
              padding: '10px 20px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Refresh Page
          </button>
        </div>
            );
        }
        return this.props.children;
    }
}
export default ErrorBoundary;