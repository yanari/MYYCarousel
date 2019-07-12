import React from 'react';
import MYYCarousel from './MYYCarousel';
import './App.css';

function App() {
  const lista = [
    {color: 'rgb(40, 40, 194)', content: 'A'},
    {color: 'rgb(0, 100, 200)', content: 'B'},
    {color: 'rgb(100, 0, 200)', content: 'C'},
    {color: 'rgb(100, 0, 0)', content: 'D'},
    {color: 'rgb(0, 0, 200)', content: 'E'},
    {color: 'rgb(200, 0, 200)', content: 'F'},
    {color: 'rgb(0, 200, 200)', content: 'G'},
    {color: 'rgb(50, 132, 200)', content: 'H'},
  ];
  return (
    <div style = {{margin: 48}}>
      <MYYCarousel>
        {lista.map((data) => {
          return (
            <div className = "item" key = {data.content} style = {{backgroundColor: data.color, fontSize: '6rem', height: '100%'}}>
              {data.content}
            </div>
          );
        })}
      </MYYCarousel>
    </div>
  );
}

export default App;
