import React, { useState, useEffect, useRef } from 'react'
import "./styles/imageStyle.scss";
import * as mobilenet from "@tensorflow-models/mobilenet"
import Loader from "../assets/loader2.gif";
//
const ImageApp = () => {
    const [isModelLoading, setIsModelLoading] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [classifyResults, setClassifyResults] = useState(null);
    const [model, setModel] = useState(null)
    const [imgUrl, setImgUrl ] = useState(null);
    const [dummyImgUrl, setDummyImageUrl] = useState(null)
    const [error, setError] = useState(null);

    const reset = () => {
        setClassifyResults(null);
        setDummyImageUrl(null)
        setError(null)
        setImgUrl(null)
        setIsImageLoading(false)
    }

    const imageRef = useRef();
    const textInputRef = useRef();
    const fileInputRef = useRef();

    const loadModel = async () => {
        setIsModelLoading(true);
        try {
            const model = await mobilenet.load();
            setModel(model);
            setIsModelLoading(false);
        } catch (error) {
            setIsModelLoading(false);
            throw new Error(error);
        }
    }

    const triggerUpload = () => {
        fileInputRef.current.click()
    }

    useEffect(() => {
        loadModel()
    }, []);

    if(isModelLoading){
        return <h1 className="header">Loading Model...</h1>
    }

    const uploadImage = (e) => {
        setError(null);
        setIsImageLoading(true);
        const { files } = e.target;

        setTimeout(() => {
            if(files.length > 0){
                const url = URL.createObjectURL(files[0])
                setImgUrl(url)
                setIsImageLoading(false);
            } else {
                setImgUrl(null);
                setIsImageLoading(false);
            }
        }, 2000);
    }

    const identifier = async () => {
        textInputRef.current.value = '';
        try {
            const results = await model.classify(imageRef.current)
            setClassifyResults(results);
        } catch (error) {
            setError(error);
        }
    }
    
    const handleOnChange = (e) => {
        setError(null);
        setImgUrl(e.target.value);
        setDummyImageUrl(e.target.value);
        setClassifyResults([])
    }

    return (
        <div>
            <h1 className="header">Image Identification App</h1>
            <div className="inputHolder">
                <input 
                    className="uploadInput"
                    type="file" 
                    accept="image/*" 
                    capture="camera" 
                    onChange={uploadImage}
                    ref={fileInputRef}
                />
                <button className="uploadImage" onClick={triggerUpload}>Upload Image</button>
                <span className='or'>OR</span>
                <input 
                    type="text" 
                    placeholder='Paste image url' 
                    ref={textInputRef} 
                    onChange={handleOnChange}
                />
            </div>
            <div className='mainWrapper'>
                <div className='mainContent'>
                    <div className='imageHolder'>
                        {
                            imgUrl ? (
                                <>
                                    <img 
                                        src={imgUrl} 
                                        alt="image_selected" 
                                        crossOrigin='anonymous' 
                                        ref={imageRef} 
                                        style={ dummyImgUrl && { display: "none" }} 
                                    />
                                    { dummyImgUrl && (
                                        <img 
                                            src={dummyImgUrl} 
                                            alt="url_image_selected"
                                        />
                                    )}
                                </>
                            ):(
                                isImageLoading ? (
                                    <div style={{ width: "200px", margin: "0 auto"}}>
                                        <img src={Loader} alt="loader" style={{ width: "100%"}}/>
                                    </div>
                                ):(
                                    <p>Select an image to identify</p>
                                )
                            )
                        }
                        {
                            imgUrl && (
                                !classifyResults ? (
                                    <button 
                                        className="button" 
                                        onClick={identifier}
                                    >
                                        Identify image
                                    </button>
                                ):(
                                    <button 
                                        className="button" 
                                        onClick={reset}
                                    >
                                        Clean values
                                    </button>
                                )
                            )
                        }
                    </div>
                    {classifyResults && (
                            <div className='resultsHolder'>
                                {classifyResults.map((result, index) => {
                                    return (
                                        <div className='result' key={result.className}>
                                            <span className='name'>{result.className}</span>
                                            <span 
                                                className='confidence'>
                                                    Confidence level: 
                                                    {(result
                                                        .probability * 100)
                                                        .toFixed(2)}% {index === 0 && 
                                                        <span  
                                                            className='bestGuess'
                                                        >
                                                            Best Guess
                                                        </span>
                                                    }
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    }
                    {error && (
                        <div className='resultsHolder'>
                            <p>We are unable to identify the image right now due to its size 
                                / quality.
                            </p>
                            <p>Please, provide a different one, 
                                and try again.
                            </p>
                        </div>
                    )}
                </div>
            </div>
            {
                !imgUrl && (
                    <footer 
                        className='footerElement'
                        >
                        <span>AI project with image recogn model.</span>
                        <br/>
                        <span>Made by Kike Vanegas with Tensorflow.js & React js.</span>
                    </footer>
                )
            }
        </div>
    )
}

export default ImageApp