import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'universal-cookie'

const cookies = new Cookies()

const initialState = {
    goods: []
}

export const fetchGoods = createAsyncThunk('fetchGoods', 
    async () => {
        const {data} = await axios.get("http://localhost:8080/admin/products",
            {
                headers: {
                    "Authorization": "Bearer " + cookies.get("token")
                }
            }
        )
        return data
    }
)

export const fetchAddGoods = createAsyncThunk('fetchAddGoods',
    async (good) => {
        const {data} = await axios.post("http://localhost:8080/admin/products/add", good,
            {
                headers: {
                    "Authorization": "Bearer " + cookies.get("token")
                }
            }
        )
        return data
    }
)

export const fetchDelGoods = createAsyncThunk('fetchDelGoods',
    async (good) => {
        console.log(good)
        const {data} = await axios.post(`http://localhost:8080/admin/products/del/${good.id}`, good,
            {
                headers: {
                    "Authorization": "Bearer " + cookies.get("token")
                }
            }
        )
        return good
    }
)

const goodsSlice = createSlice({
    name: "goodsSlice",
    initialState,
    reducers: {},
    extraReducers: {
        //Отправка запроса на получение товаров
        [fetchGoods.fulfilled]: (state, action) => {
            state.goods = action.payload
            console.log(state.goods)
        },
        //Отправка запроса на добавление товаров
        [fetchAddGoods.fulfilled]: (state, action) => {
            state.goods = [...state.goods, action.payload]
            console.log(state.goods)
        },
        //Отправка запроса на удаление товара
        [fetchDelGoods.fulfilled]: (state, action) => {
            state.goods = state.goods.filter(good => good.id !== action.payload.id)
        },
    }
})

export const goodsReducer = goodsSlice.reducer
export const selectGoods = (state) => state.goods.goods