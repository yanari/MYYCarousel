import React from 'react';
import YanariCarousel from './YanariCarousel';
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
  const itemRenderer = ({data}) => {
    return (
      <div className = "item" key = {data.content} style = {{backgroundColor: data.color, fontSize: '6rem', height: '100%'}}>
        {data.content}
      </div>
    );
  };
  return (
    <div>
      <YanariCarousel
        hasArrows = {true}
        itemRenderer = {itemRenderer}
        items = {lista}
        itemPreviewSize = {64}
      />
      <p>Lorem d;asjd;as askldh akls hd</p>
      <p>Lorem d;asjd;as askldh akls hd</p>
      <p>Lorem d;asjd;as askldh akls hd</p>
      <p>Lorem d;asjd;as askldh akls hd</p>
      <p>Lorem d;asjd;as askldh akls hd</p>
      <p>Lorem d;asjd;as askldh akls hd</p>
      <p>Lorem d;asjd;as askldh akls hd</p>
      <p>Lorem d;asjd;as askldh akls hd</p>
      <p>Lorem d;asjd;as askldh akls hd</p>
      <p>Lorem d;asjd;as askldh akls hd</p>
      <p>Lorem d;asjd;as askldh akls hd</p>
      <p>Lorem d;asjd;as askldh akls hd</p>
      <p>Lorem d;asjd;as askldh akls hd</p>
      <p>Lorem d;asjd;as askldh akls hd</p>
      <p>Lorem d;asjd;as askldh akls hd</p>
      <p>Lorem d;asjd;as askldh akls hd</p>
      <p>Lorem d;asjd;as askldh akls hd</p>
      <p>Lorem d;asjd;as askldh akls hd</p>
      <p>Lorem d;asjd;as askldh akls hd</p>
      <p>Lorem d;asjd;as askldh akls hd</p>
      <p>Lorem d;asjd;as askldh akls hd</p>
      <p>Lorem d;asjd;as askldh akls hd</p>
    </div>
  );
}

export default App;
