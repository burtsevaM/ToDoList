const BASE_URL = 'http://127.0.0.1:5500'

const inputEl = (document.getElementsByClassName('app__controls-input'))[0]
const btnEl = (document.getElementsByClassName('app__controls-button'))[0]
const listEl = (document.getElementsByClassName('app__list'))[0]
let counter = 1
let data = []

//API
async function getItemsApi(){
    const res = await fetch( `${BASE_URL}/tasks`, {
        method: 'GET'
    })
    if (!res.ok){
        console.log('mistake');
        return 
    }
    data = await res.json()
}

async function createTaskApi(data){
    const res = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        body: JSON.stringify({
            text: data.text,
            isDone: data.isDone
        })
    })
    if (!res.ok){
        console.log('mistake');
        return 
    }
    return await res.json()
}

async function changeStatusApi (id) {
    const res = await fetch(`${BASE_URL}/tasks/edit `, {
        method: 'PATCH',
        body: JSON.stringify({
            id
        })
    })
    if (!res.ok){
        console.log('mistake');
        return 
    }
    return await res.json()
}



//APP


//тоже сохранение данных
async function init() {
    //const tmp = localStorage.getItem('data')
    /*if (tmp !== null) {
        data = JSON.parse(tmp)
    }*/
    data.forEach((item) => {
        if (item.id > counter) {
            counter = item.id 
        }
    })
    if (counter > 1){
        counter++
    }
    await getItemsApi()
    render()
}

//удаление задач с помощью кнопки мусора
function deleteById(id){
    const idx = data.findIndex((i) => {
        return i.id === id
    })
    data.splice(idx, 1)
    syncData()
}

//сохранение данных в приложении
function syncData() {
    localStorage.setItem('data', JSON.stringify(data)) 
    render()
}
//превращаем значение data в тип string с помощью stringify

//изменение цвета дел взависимости от их статуса
async function changeStatusById(id) {
    const item = await changeStatusApi (id)
    const idx = data.findIndex((i)=>{
        return i.id === id
    })
    data[idx] = item
    render()
}

function createTask(objectData){
    const root = document.createElement('div')
    root.classList.add('app__list-item')

    if (objectData.isDone === true){
        root.classList.add('app__list-item_done')
    }

    const input = document.createElement('input')
    input.classList.add('app__list-checkbox')

    if (objectData.isDone === true){
        input.checked = true
    }

    input.type= 'checkbox'

    const txt = document.createElement('p')
    txt.classList.add('app_list-item-text')
    txt.innerText = objectData.text 

    const btn = document.createElement('button')
    btn.classList.add('app__list-btn')

    const img = document.createElement('img')
    img.src = '/Vector.png'
    img.alt= 'trash'

    btn.appendChild(img)

    root.appendChild(input)
    root.appendChild(txt)
    root.appendChild(btn)

    btn.addEventListener('click', ()=> {
        deleteById(objectData.id)
    })

    root.addEventListener('click', async () => {
        await changeStatusById(objectData.id)
    })
    return root
}

btnEl.addEventListener('click', async ()=>{
    const textValue = inputEl.value
    const item = await createTaskApi({
        text: textValue, 
        isDone: false
    })
    data.push(item)
    /*data.push({
        id: counter++,
        text: textValue,
        isDone: false,
    })*/
    //syncData()

    inputEl.value = ''
    render()
})

function render(){
    listEl.innerHTML = ''
    for(let item of data){
        const tmpElement = createTask(item) 
        listEl.appendChild(tmpElement)
    }
}

init()
