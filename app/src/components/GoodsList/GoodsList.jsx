import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAddGoods, fetchDelGoods, fetchGoods, selectGoods } from '../../redux/slices/goods'
import classes from './GoodsList.module.css'
import { selectCats } from '../../redux/slices/categoryList'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'universal-cookie'
import GoodCard from '../GoodCard/GoodCard'

const GoodsList = () => {
  const dispatch= useDispatch()

  const [props, setProps] = useSearchParams()
  const cat = props.get('cat')

  const cats = useSelector(selectCats)

  useEffect(() => {
    dispatch(fetchGoods())
  },[])

  const [goodToAdd, setGoodToAdd] = useState({
    name: "",
    description: "",
    category: cat,
    price: null
  })
  
  const goods = useSelector(selectGoods)

  return (
    <div>
      <div className={classes.adder}>
        <label>Название товара:</label>
        <input type="text"
          onChange={(event) => {setGoodToAdd({...goodToAdd, name: event.target.value})}}/>
        <label>Описание товара:</label>
        <textarea name="desc" id="desc"
          onChange={(event) => {setGoodToAdd({...goodToAdd, description: event.target.value})}}></textarea>
        <label>Категория товара:</label>
        <select value={goodToAdd.category} onChange={(event) => {setGoodToAdd({...goodToAdd, category: event.target.value})}}
          name="cats" id="cats" placeholder='Категория'>
          {cats.map((opt, index) =>
            <option key={index} value={opt}>{opt}</option>
          )}
        </select>
        <label>Цена:</label>
        <input type="number" onChange={(event) => {setGoodToAdd({...goodToAdd, price: Number(event.target.value)})}}/>
        
        <button onClick={() => {
          dispatch(fetchAddGoods(goodToAdd))
        }}>Добавить</button>
      </div>
      <div className={classes.list}>
        <h1>{cat}</h1>
        {goods.filter((item) => item.category === cat).map((item, index) =>
         <GoodCard item={item} index={index}/>)}
      </div>
    </div>
  )
}

export default GoodsList