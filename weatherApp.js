const url='https://api.foursquare.com/v2/venues/search?near='
const client='&client_id=UI1Z3ATRHMHBSZRXZI124THQBAJREMZCAPWO5YKSIDAEDHWH&client_secret=AFDVHL0OQEYC3SXG2KE0VQB51MNQ3A3WO21F3AZTOPMUOWE3&v=20180928'
//const fetch=require("node-fetch")
let locationJson=[]
const loc=async(place="bangalore")=>{
    try{
        const response=await fetch(url+place+client)
        if(response.ok){
            const jsonResult=await response.json()
            
            return jsonResult
        }
        throw new Error(`failed in foursq: ${response.status}`)
    }catch(error){
        console.log(error)
    }
}

const locweather=async(lat,lon)=>{
    try{
        
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=4222f136b1589f0eadff743418445c42&units=metric`)
        if(response.ok){
            const jsonResult=await response.json()
            console.log(`The weather outside in ${jsonResult.name} is ${jsonResult.weather[0].main}`)
            console.log(`The temp in ${jsonResult.name} is ${jsonResult.main.temp}*C`)
            return jsonResult
        }
        throw new Error(`failed code: ${response.status}`)
    }catch(error){
        console.log(error)
    }
}

let temp=document.getElementById('temp')
temp.innerHTML=`Search for weather and venue data`
let button= document.getElementById('submit')
const search=()=>{
    const enter=document.getElementById('place').value
    let result=loc(enter)
    let venues=[]
    let main=document.getElementById("content")
    if(document.getElementById("venuesCont")){
        let rem=document.getElementById("venuesCont")
        main.removeChild(rem)
        
    }
    result.then(data=>{
        let ar1=data.response.venues[0].location.lat
        let ar2=data.response.venues[0].location.lng
        
        for(let i=0;i<10;i++){
            let div=document.createElement("div")
            div.className="venue"
            let iconCont=document.createElement("div")
            iconCont.className="iconCont"
            let icon=document.createElement("img")
            icon.src=`${data.response.venues[i].categories[0].icon.prefix}bg_64${data.response.venues[i].categories[0].icon.suffix}`
            iconCont.appendChild(icon)
            div.appendChild(iconCont)
            let innerDiv=document.createElement("div")
            innerDiv.className="venueText"
            let head=document.createElement("h1")
            head.innerHTML=data.response.venues[i].name
            innerDiv.appendChild(head)
            let address=document.createElement("p")
            address.innerHTML=`Address: ${data.response.venues[i].location.address}`
            innerDiv.appendChild(address)
            let category=document.createElement("p")
            category.innerHTML=`Category: ${data.response.venues[i].categories[0].name}`
            innerDiv.appendChild(category)
            console.log(data.response.venues[i].url)
            if(data.response.venues[i]['url']){
                let link=document.createElement("a")
                link.href=data.response.venues[i].url
                link.innerHTML="Visit Site"
                innerDiv.appendChild(link)
            }
            div.appendChild(innerDiv)
            venues.push(div)

        }
        
        let a=document.createElement("div")
        a.id="venuesCont"
        let contHead=document.createElement('h1')
        contHead.innerHTML="You could visit these places"
        a.appendChild(contHead)
        venues.forEach(ele=>{
            
            
            a.appendChild(ele)
        })

        
        main.appendChild(a)
        let wdata=locweather(ar1,ar2)
        wdata.then(data1=>{
            console.log(data1.main.temp)
            temp.innerHTML=`The temperature outside is ${data1.main.temp} C`
            let time= Math.floor( Date.now()/1000)
            console.log(time)
            time=time+data1.timezone
            console.log(data1.timezone)
            console.log(time)
            let newtime= new Date(time*1000)
            let hour=newtime.getHours()
            let min=newtime.getMinutes()
            time=`${hour}:${min}`
            console.log(newTime)
        })
    })
}
button.onclick=search
search()