import axios from "axios";
import { useEffect, useState } from "react";

export default function useCategory() {
  const [categories,setCategories] = useState([])
  useEffect(()=>{
    axios.get('http://localhost:5000/categories')
    .then(res=>{
        setCategories(res.data)
    })
  },[])
  return categories
}
