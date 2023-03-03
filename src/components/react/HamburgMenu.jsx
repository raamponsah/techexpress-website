import { useState } from "react"

export default function HamburgMenu(){

    const [modal, setModal] = useState(false)

    const handleClick = (e)=>{
        e.prevenyDefault()
        console.log(modal)
        setModal(!modal)
    }

    return <>
    <svg onClick={()=>{handleClick()}} width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.25 12.25H36.75M5.25 21H36.75M5.25 29.75H36.75" stroke="#0EC0DD" stroke-width="1.5" stroke-linecap="round"/>
</svg>

    </>
}