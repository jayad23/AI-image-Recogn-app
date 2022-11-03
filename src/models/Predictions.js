//import { BaseLayout } from './Containers/BaseLayout';
import { useState, useEffect } from "react";
import { usePrediction } from "../usePrediction";

function Predictions() {
  const [ word, setWord ] = useState(null);
  const [results, setResults ] = useState([]);
  const [showWord, setShowWord ] = useState("");
  const { report } = usePrediction(showWord);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowWord(word);
  }

  useEffect(() => {
    const response = [];
    if(report){
      const minResults = report.map((item) => item.results);
      minResults.map((itemResult, idx) => (response.push({ itemResult: report[idx].label, res: itemResult[0].match})))
    }
    setResults(response);
  }, [report])

  return (
    <div>
      <h1>Ingresa una palabra</h1>
       <form onSubmit={handleSubmit}>
       <input placeholder="aquí" value={word || ""} onChange={(e) => setWord(e.target.value)}/>
       <button type="submit">Submit</button>
       </form>
      <p>la palabra ingresada es: {showWord}</p>
      <ul>
      {
        results && results.length > 0 && (
          results.map((result, idx) => (
            <li key={idx}>La palabra {result.res ? "cae" : "no cae"} en la categoría de {result.itemResult.replaceAll("_", " ")}</li>
          ))
        )
      }
      </ul>
    </div>
  );
}

export default Predictions;
