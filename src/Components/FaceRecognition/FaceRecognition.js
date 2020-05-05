import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({imageUrl, box}) =>
{
    let boundingBoxDivs = [];
    
    
    for (let i = 0; i<box.length; i++) {
        let randomColor = `0 0 0 3px #`+(Math.random()*0xFFFFFF<<0).toString(16)+` inset`;
        boundingBoxDivs.push(<div className='bounding-box'
        style={{
            top: box[i].topRow,
            right:box[i].rightCol,
            bottom: box[i].bottomRow,
            left: box[i].leftCol,
            boxShadow: randomColor.toString()
            }}></div>);
    }
    return (
        <div className='center ma'>
            <div className='absolute mt2'>
                <img id = 'inputImage' src={imageUrl} alt='' width='500px' height='auto'/>
                {boundingBoxDivs}
                
            </div>
        </div>
        

    );
}

export default FaceRecognition;