import React from 'react';
import YanariCarousel from './YanariCarousel';
import './App.css';

function App() {
  const lista = [
    {color: 'rgb(40, 40, 194)', content: 'A', key: 0},
    {color: 'rgb(0, 100, 200)', content: 'B', key: 1},
    {color: 'rgb(100, 0, 200)', content: 'C', key: 2},
    {color: 'rgb(100, 0, 0)', content: 'D', key: 3},
    {color: 'rgb(0, 0, 200)', content: 'E', key: 4},
    {color: 'rgb(200, 0, 200)', content: 'F', key: 5},
    {color: 'rgb(0, 200, 200)', content: 'G', key: 6},
    {color: 'rgb(50, 132, 200)', content: 'H', key: 7},
  ];
  const itemRenderer = ({data}) => {
    const styles = {
      backgroundColor: data.color,
      fontSize: '6rem',
      height: '100%',
    };
    return (
      <div
        className = "item"
        key = {data.content}
        style = {styles}
      >
        {data.content}
      </div>
    );
  };
  return (
    <YanariCarousel
      arrows = {{
        left: {
          label: '<',
          margin: 8,
          size: 32,
        },
        right: {
          label: '>',
          margin: 8,
          size: 32,
        },
      }}
      itemRenderer = {itemRenderer}
      items = {lista}
      itemPreviewSize = {{
        left: 0,
        right: 80,
      }}
    />
  );
}

export default App;
