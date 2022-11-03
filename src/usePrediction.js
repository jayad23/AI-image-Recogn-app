import { useState, useEffect } from "react"
//require('@tensorflow/tfjs');
// import '@tensorflow/tfjs'
const toxicity = require('@tensorflow-models/toxicity');
const threshold = 0.9

export const usePrediction = (word) => {
    const [ report, setReport ] = useState(null);
    //console.log(toxicity)
    useEffect(() => {
        if(word){
            toxicity.load(threshold).then(model => {
                const sentences = [word];
                
                model.classify(sentences).then(predictions => {
                    setReport(predictions);
                });
            });
        }
    }, [word])

    return { report }
}