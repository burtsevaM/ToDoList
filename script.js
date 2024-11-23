const BASE_URL = 'http://127.0.0.1:5500'

const inputEl = (document.getElementsByClassName('app__controls-input'))[0]
const btnEl = (document.getElementsByClassName('app__controls-button'))[0]
const listEl = (document.getElementsByClassName('app__list'))[0]
let counter = 1
let data = []

//API

//асинхронная функция, которая отправляет GET-запрос на сервер для получения списка задач
//если запроос успешен - данные преобразуются из формата JSON и сохраняются в массив data, нет - вывод ошибки
async function getItemsApi() {
    const res = await fetch(`${BASE_URL}/tasks`, {
        method: 'GET'
    })
    if (!res.ok) {
        console.log('mistake');
        return
    }
    data = await res.json()
}

//асинхронная функция для создания новой задачи, отправляет POST-запрос на сервер с текстом задачи и её статусом выполнения
//если запрос успешен, возвращает созданный объект задачи; нет - вывод ошибки
async function createTaskApi(data) {
    const res = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        body: JSON.stringify({ //данные, которые отправляются на сервер
            text: data.text,
            isDone: data.isDone
        })
    })
    if (!res.ok) {
        console.log('mistake');
        return
    }
    return await res.json() //возврат данных ответа. 
    //тк метод json содержит промис, то используем await, что сначала данные преобразовались в JSON а потом вывелись
}

//изменение статуса задачи по её идентификатору
// асинхронная ф-ия отправляет PATCH-запрос на сервер с идентификатором задачи
//если запрос успешен, возвращает обновлённый объект задачи
async function changeStatusApi(id) {
    const res = await fetch(`${BASE_URL}/tasks/edit `, {
        method: 'PATCH',
        body: JSON.stringify({
            id
        })
    })
    if (!res.ok) {
        console.log('mistake');
        return
    }
    return await res.json()
}

async function deleteTaskApi(id) {
    const res = await fetch(`${BASE_URL}/tasks`, {
        method: 'DELETE',
        body: JSON.stringify({
            id
        })
    })
    if (!res.ok) {
        console.log('mistake')
        return
    }
    return
}

//APP (основные функции приложения)


//инициализация приложения
async function init() {
    //const tmp = localStorage.getItem('data')
    /*if (tmp !== null) {
        data = JSON.parse(tmp)
    }
    data.forEach((item) => {
        if (item.id > counter) {
            counter = item.id
        }
    })
    if (counter > 1) {
        counter++
    }
    */
    await getItemsApi() //вызов getItemsApi для загрузки данных с сервера и позже визуализация интерфейса
    render()
}

//удаление задач по id с помощью кнопки мусора
async function deleteById(id) {
    const idx = data.findIndex((i) => {
        return i.id === id
    })
    const item = await deleteTaskApi(id)

    data.splice(idx, 1)
    render()
}

/*
function syncData() {
    localStorage.setItem('data', JSON.stringify(data))
    render()
}
*/

//изменение цвета задач взависимости от их статуса
async function changeStatusById(id) {
    const item = await changeStatusApi(id) // изменения статуса на сервере и получение обновлённого объекта задачи
    const idx = data.findIndex((i) => {
        return i.id === id
    })
    data[idx] = item
    render() //обновление интерфейса
}

//создание элементов интерфейса для задачи 
function createTask(objectData) {
    const root = document.createElement('div')
    root.classList.add('app__list-item')

    if (objectData.isDone === true) {
        root.classList.add('app__list-item_done')
    }

    root.addEventListener('click', () => {
        data.isDone != data.isDone
    })

    const input = document.createElement('input')
    input.classList.add('app__list-checkbox')

    if (objectData.isDone === true) {
        input.checked = true
    }

    input.type = 'checkbox'

    const txt = document.createElement('p')
    txt.classList.add('app_list-item-text')
    txt.innerText = objectData.text

    const btn = document.createElement('button')
    btn.classList.add('app__list-btn')

    const img = document.createElement('img')
    img.src = '/Vector.png'
    img.alt = 'trash'

    btn.appendChild(img)
    root.appendChild(input)
    root.appendChild(txt)
    root.appendChild(btn)

    // кнопка мусорки
    btn.addEventListener('click', async (event) => {
        event.stopPropagation(); // для разделения changeStatus и delete
        await deleteById(objectData.id)
        render()
    })

    root.addEventListener('click', () => {
        changeStatusById(objectData.id)
    })
    return root
}

// обработчик события добавления новой задачи
btnEl.addEventListener('click', async () => {
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

    inputEl.value = '' /*после добавления задачи поле ввода очищается*/
    render()
})

//функция обновления интерфейса
function render() {
    listEl.innerHTML = ''
    for (let item of data) {
        const tmpElement = createTask(item)
        listEl.appendChild(tmpElement)
    }
}

init()
