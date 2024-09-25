const inputEl = (document.getElementsByClassName('app__controls-input'))[0]
const btnEl = (document.getElementsByClassName('app__controls-button'))[0]
const listEl = (document.getElementsByClassName('app__list'))[0]
let counter = 1
let data = []


data.forEach((item) => {
    if (item.id > counter) {
        counter = item.id 
    }
})
if (counter > 1){
    counter++
}

//тоже сохранение данных
function init() {
    const tmp = localStorage.getItem('data')
    if (tmp !== null) {
        data = JSON.parse(tmp)
    }
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
function changeStatusById(id) {
    const item = data.find((i) => {
        return i.id === id
    })
    item.isDone = !item.isDone //заменяем объекты true на false и наоборот
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

    root.addEventListener('click', () => {
        changeStatusById(objectData.id)
    })
    return root
}

btnEl.addEventListener('click', ()=>{
    const textValue = inputEl.value
    data.push({
        id: counter++,
        text: textValue,
        isDone: false,
    })
    syncData()

    inputEl.value = ''
})

//функция render 
function render(){
    listEl.innerHTML = ''
    for(let item of data){
        const tmpElement = createTask(item) 
        listEl.appendChild(tmpElement)
    }
}
init()
