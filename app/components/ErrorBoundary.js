import React from 'react';

import { View } from 'react-native';

import AudioEngine from '../audio/AudioEngine';

import ErrorDimension from './ErrorDimension';







class EnhancedErrorBoundary extends React.Component {



  constructor(props) {



    super(props);



    this.state = {



      hasError: false,



      error: null,



      errorInfo: null



    };







    this.audioEngine = AudioEngine;
  }







  static getDerivedStateFromError(error) {



    return { hasError: true, error };



  }







  componentDidCatch(error, errorInfo) {



    this.setState({



      hasError: true,



      error,



      errorInfo



    });



    // Use standard root frequency instead of heart
    this.audioEngine.playSound(
      'meditation',
      500,
      0.3
    );
  }







  render() {



    if (this.state.hasError) {



      return (



        <ErrorDimension 



          error={this.state.error}



          errorInfo={this.state.errorInfo}



          onRecover={() => {



            this.setState({ hasError: false });
            
            // Use standard sound instead of healing frequency
            this.audioEngine.playSound(
              'crystal',
              1000,
              0.5
            );
          }}



        />



      );



    }







    return this.props.children;



  }



}







export default EnhancedErrorBoundary;








