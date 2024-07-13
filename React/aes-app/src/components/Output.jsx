import React from 'react';

const OutputComponent = ({ outputResponse, ...otherProps }) => {
    return (
      <div className="main-content flex-auto flex-shrink text-wrap">
        <h2 className="text-2xl text-gray-300 mt-5 font-bold text-center">
          Output:
        </h2>
        {outputResponse && outputResponse.value && (
          <div className="output-container">
            <pre className="output-text">Response: {outputResponse.value}</pre>
            {Object.keys(otherProps).map((key) => (
              <pre className="output-text" key={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}: {otherProps[key].value}
              </pre>
            ))}
          </div>
        )}
      </div>
    );
  };
  

export default OutputComponent;