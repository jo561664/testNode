
const d = document

const list = async (url) => {
    const $list = d.querySelector(".list")

    const res = await fetch(url, {
        method: 'GET',
    }),
    data = await res.json();
    if(!res.ok){
        $list.innerHTML = '<tr><td colspan="8">Ocurrío un error al intentar cargar los pacientes</td></tr>'
    }

    if(data.length > 0){
        let html = ''
        data.forEach(element => {
            let imc = element.weight / (element.size * element.size),
            age = diferenciaAnios(new Date(), new Date(new Date(element.birthday).getFullYear(), new Date(element.birthday).getMonth(), new Date(element.birthday).getDay()))
            html += `
                    <tr>
                        <td>${element.name}</td>
                        <td>${element.id_type}</td>
                        <td>${element.identification_number}</td>
                        <td>${element.birthday}</td>
                        <td>${element.weight}</td>
                        <td>${element.size}</td>
                        <td>${imc}</td>
                        <td>${age}</td>
                        <td><button class="btn btn-warning btn-sm btn-edit" data-id="${element.id}"
                                data-name="${element.name}"
                                data-id_type="${element.id_type}"
                                data-identification_number="${element.identification_number}"
                                data-birthday="${element.birthday}"
                                data-weight="${element.weight}"
                                data-size="${element.size}">
                                Editar
                            </button>
                        </td>
                        <td>
                            <button class="btn btn-danger btn-sm btn-delete" data-id="${element.id}">
                                Eliminar
                            </button>
                        </td>
                    </tr>`
        });
        $list.innerHTML = html
    }
}

const save = async (form) => {
    try {
        const $msg = d.querySelector('.msg')
        const data = new FormData(form)
        const object = {}
        data.forEach((value, key) => {
            object[key] = value
            d.querySelector(`#${key}`).textContent=''
        })

        if(form.id.value == ''){
            // POST
            let res = await fetch('http://localhost:3001/api/v1/people/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(object)
            }),
            json = await res.json()
            if(res.status == 403){
                json.error.forEach((el) => {
                    let span = d.querySelector(`#${el.param}`)
                    span.textContent = el.msg
                    span.style.color = 'red'
                })
            }else if(res.ok){
                form.reset()
                $msg.innerHTML = `<div class="alert alert-success mt-1" role="alert">Paciente registrado exitosamente</div>`
                list('http://localhost:3001/api/v1/people')
                setTimeout(() => $msg.innerHTML = '', 3000)
            }else if(res.status == 500){
                $msg.innerHTML = `<div class="alert alert-danger mt-1" role="alert">${json.message}</div>`
                setTimeout(() => $msg.innerHTML = '', 3000)
            }
        }else{
             // PUT
            let res = await fetch(`http://localhost:3001/api/v1/people/${form.id.value}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(object)
            }),
            json = await res.json()
            if(res.status == 403){
                json.error.forEach((el) => {
                    let span = d.querySelector(`#${el.param}`)
                    span.textContent = el.msg
                    span.style.color = 'red'
                })
            }else if(res.ok){
                form.reset()
                $msg.innerHTML = `<div class="alert alert-success mt-1" role="alert">Paciente actualizado exitosamente.</div>`
                list('http://localhost:3001/api/v1/people')
                setTimeout(() => $msg.innerHTML = '', 3000)
            }else if(res.status == 500){
                $msg.innerHTML = `<div class="alert alert-danger mt-1" role="alert">${json.message}</div>`
                setTimeout(() => $msg.innerHTML = '', 3000)
            }
        }
    } catch (error) {
        console.log('Error', error);
    }
}

d.addEventListener("DOMContentLoaded", async () => {
    list('http://localhost:3001/api/v1/people')
    const $formPaciente = d.querySelector('.form-paciente')
    const $btnSave = d.querySelector('.btn-save')
    const $msg = d.querySelector('.msg')

    d.addEventListener("submit", (e) => {
        e.preventDefault();
        if(e.target==$formPaciente){
            save($formPaciente)
        }
    })

    d.addEventListener("click", async (e) => {
        if(e.target.matches('.btn-edit')){
            const data = e.target.dataset
            $formPaciente.id.value = data.id
            $formPaciente.name.value = data.name
            $formPaciente.id_type.value = data.id_type
            $formPaciente.identification_number.value = data.identification_number
            $formPaciente.birthday.value = data.birthday
            $formPaciente.weight.value = data.weight
            $formPaciente.size.value = data.size
        }else if(e.target.matches('.btn-clear')){
            $formPaciente.reset()
        }else if(e.target.matches('.btn-delete')){
            // DELETE
            let res = await fetch(`http://localhost:3001/api/v1/people/${e.target.dataset.id}`, {
                method: 'DELETE'
            }),
            json = await res.json()
            console.log(json, res);
            if(res.status === 200){
                list('http://localhost:3001/api/v1/people')
                $msg.innerHTML = `<div class="alert alert-success mt-1" role="alert">Paciente eliminado</div>`
                setTimeout(() => $msg.innerHTML = '', 3000)
            }else if(res.status == 500){
                $msg.innerHTML = `<div class="alert alert-danger mt-1" role="alert">${json.message}</div>`
                setTimeout(() => $msg.innerHTML = '', 3000)
            }
        }
    })

    d.addEventListener("keyup", (e) =>{
        if(e.target.matches('.input-search')){
            (e.target.value.length>0)
                ? list(`http://localhost:3001/api/v1/people/search/${e.target.value}`)
                : list(`http://localhost:3001/api/v1/people`);
        }
    })

})

function diferenciaAnios(f1, f2){
    if(!(f1 instanceof Date) || !(f1 instanceof Date)) {
        throw TypeError('Ambos argumentos debe ser de tipo fecha')
    }

    let diferencia = (f2.getTime() - f1.getTime()) / 1000;
    diferencia /= (60 * 60 * 24 * 365.25)

    return Math.abs(Math.round(diferencia))
}


