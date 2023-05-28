import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import Cookies from 'universal-cookie'
import { fetchDelGoods, fetchGoods } from '../../redux/slices/goods'
import axios from 'axios'
import classes from './GoodCard.module.css'

const GoodCard = ({item, index}) => {
    
    const dispatch= useDispatch()

    const add_to_cart = async (item) => {

        const {data} = await axios.get(`http://localhost:8080/cart/in_cart/${item.id}`,
        {
            headers: {
                "Authorization": "Bearer " + cookies.get("token")
            }
        })
        if (data !== false) {
            const new_item = JSON.parse(localStorage['cart']).find(itm => itm.id === item.id)
            console.log(new_item)
            localStorage['cart'] = JSON.stringify([...JSON.parse(localStorage['cart']).filter(itm => itm.id !== new_item.id), 
            {
                ...new_item,
                quantity: new_item.quantity + 1
            }])
        } else {
            localStorage['cart'] = JSON.stringify([...JSON.parse(localStorage['cart']), {
                ...item,
                quantity: 1
            }])
            await axios.post(`http://localhost:8080/cart/add/${item.id}`, item,{
                headers: {
                    "Authorization": "Bearer " + cookies.get("token")
                }
            })
        }
    }

    const cookies = new Cookies()

    const attachImage = async (selectedImage) => {
        console.log(item)
        const fd = new FormData()
        fd.append("file", selectedImage)
        await axios.post(`http://localhost:8080/admin/load_image/${item.id}`, fd, {
        headers: {
            'Content-Type': 'multipart/form-data',
            "Authorization": "Bearer " + cookies.get("token")
        }
        })
        dispatch(fetchGoods())
    }

    const [img, setImg] = useState(null)

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await fetch(`http://localhost:8080/image/${item.images[0].url.split('/')[2]}`,
                    {
                    headers: {
                        Authorization: "Bearer " + cookies.get("token")
                    }
                });
                if (response.ok) {
                const blob = await response.blob();
                const objectUrl = URL.createObjectURL(blob);
                setImg(objectUrl);
                } else {
                console.log('Ошибка при получении файла', response);
                }
            } catch (error) {
                console.log('Ошибка при выполнении запроса:', error);
            }
        };
        console.log(item.images)
        fetchImage();
      }, [item.images])

  return (
    <div key={index} className={classes.itm}>
        <div>
            <img src={img} alt="Image" />
            <h3>{index + 1}. {item.name}</h3>
        </div>
        <p>Описание: {item.description}</p>
        <p>Цена: {item.price}</p>
        <label>Картинка:</label>
        <input type="file" accept="image/*" onChange={(event) => {attachImage(event.target.files[0])}}/>
        <button onClick={() => {add_to_cart(item)}}>В корзину</button>
        <button onClick={() => {dispatch(fetchDelGoods(item))}}>Удалить</button>
    </div>
  )
}

export default GoodCard