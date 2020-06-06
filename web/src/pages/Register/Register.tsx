import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import styled from 'styled-components'
import { Link, useHistory } from 'react-router-dom'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import { FiArrowLeft } from 'react-icons/fi'
import { toast } from 'react-toastify'
import axios from 'axios'
import api from '../../services/api'
import logo from '../../assets/logo.svg'

interface RegisterProps {
  className?: string
}

interface Item {
  id: number
  title: string
  image_url: string
}

interface UF {
  nome:	string
  sigla: string
}

interface City {
  nome: string
}

const Register: React.FC<RegisterProps> = ({ className }) => {
  const history = useHistory()
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0])
  const [items, setItems] = useState<Item[]>([])
  const [ufs, setUfs] = useState<UF[]>([])
  const [uf, setUf] = useState<string>('0')
  const [cities, setCities] = useState<string[]>([])
  const [city, setCity] = useState<string>('')
  const [position, setPosition] = useState<[number, number]>([0,0])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [selectedItems, setSelectedItems] = useState<number[]>([])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { coords } = position
      setInitialPosition([coords.latitude, coords.longitude])
    })
  }, [])
  
  useEffect(() => {
    api.get('/items')
      .then(({ data }) => {
        setItems(data)
      })
  }, [])

  useEffect(() => {
    axios.get<UF[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(({ data }) => {
        const IBGEUFs = data.map(uf => ({
          nome: uf.nome,
          sigla: uf.sigla
        }))
        setUfs(IBGEUFs)
      })
  }, [])

  useEffect(() => {
    if(uf !== '0') {
      axios.get<City[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`)
      .then(({ data }) => {
        const IBGECities = data.map(city => city.nome)
        setCities(IBGECities)
      })
    }
  }, [ufs, uf])

  const handleMapClick = (event: LeafletMouseEvent) => {
    const { latlng } = event
    setPosition([latlng.lat, latlng.lng])
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    switch (name) {
      case 'name':
        setName(value)
        break;
      case 'email':
        setEmail(value)
        break
      case 'whatsapp':
        setWhatsapp(value)
        break
    }
  }

  const handleItemClick = (id: number) => {
    if(selectedItems.includes(id)) {
      let newItems = selectedItems 
      newItems.splice(selectedItems.indexOf(id), 1)
      setSelectedItems([...newItems])
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  const handleSubmit = (event: FormEvent ) => {
    event.preventDefault()

    const pointData = {
      name,
      email,
      whatsapp,
      latitude: position[0],
      longitude: position[1],
      city,
      uf,
      items: selectedItems,
    }

    api.post('points', pointData)
    .then(({ data }) => {
      toast('Ponto cadastrado com sucesso!')
      history.push('/')
    })
    .catch((error) => {
      toast('Ocorreu um erro. Por favor, tente novamente', { type: "error" })
    })
  }

  return (
    <div className={className}>
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para a home</Link>
      </header>
      <form onSubmit={handleSubmit}>
        <h1>
          Cadastro do <br />
          ponto de coleta
        </h1>
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="text"
                name="email"
                id="name"
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione um endereço no mapa</span>
          </legend>

          <Map
            onclick={handleMapClick}
            center={initialPosition}
            zoom={15}
          >
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            {/* <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup> */}
          </Marker>
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select name="uf" id="uf" onChange={(e: ChangeEvent<HTMLSelectElement>) => setUf(e.target.value) } defaultValue={0}>
                <option value="0">Selecione o estado</option>
                {ufs.map(uf => <option key={uf.nome} value={uf.sigla}>{`${uf.nome} - ${uf.sigla}`}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select name="city" id="city" onChange={(e: ChangeEvent<HTMLSelectElement>) => setCity(e.target.value)} defaultValue={0}>
                <option value="0">Selecione a cidade</option>
                {cities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Itens de coleta</h2>
            <span>Selecione um ou mais items abaixo</span>
          </legend>
          <ul className="items-grid">
            {items.map(item => (
              <li
                className={(selectedItems.includes(item.id) ? 'selected' : '')}
                key={item.id}
                onClick={() => handleItemClick(item.id)}
              >
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>
        <button type="submit">
          Cadastrar ponto de coleta
        </button>
      </form>
    </div>
  )
}

export default styled(Register)`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;

  header {
    margin-top: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  header a {
    color: var(--title-color);
    font-weight: bold;
    text-decoration: none;
    display: flex;
    align-items: center;
  }

  header a svg {
    margin-right: 16px;
    color: var(--primary-color);
  }

  form {
    margin: 80px auto;
    padding: 64px;
    max-width: 730px;
    background: #FFF;
    border-radius: 8px;

    display: flex;
    flex-direction: column;
  }

  form h1 {
    font-size: 36px;
  }

  form fieldset {
    margin-top: 64px;
    min-inline-size: auto;
    border: 0;
  }

  form legend {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
  }

  form legend h2 {
    font-size: 24px;
  }

  form legend span {
    font-size: 14px;
    font-weight: normal;
    color: var(--text-color);
  }

  form .field-group {
    flex: 1;
    display: flex;
  }

  form .field {
    flex: 1;

    display: flex;
    flex-direction: column;
    margin-bottom: 24px;
  }

  form .field input[type=text],
  form .field input[type=email],
  form .field input[type=number] {
    flex: 1;
    background: #F0F0F5;
    border-radius: 8px;
    border: 0;
    padding: 16px 24px;
    font-size: 16px;
    color: #6C6C80;
  }

  form .field select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    flex: 1;
    background: #F0F0F5;
    border-radius: 8px;
    border: 0;
    padding: 16px 24px;
    font-size: 16px;
    color: #6C6C80;
  }

  form .field input::placeholder {
    color: #A0A0B2;
  }

  form .field label {
    font-size: 14px;
    margin-bottom: 8px;
  }

  form .field :disabled {
    cursor: not-allowed;
  }

  form .field-group .field + .field {
    margin-left: 24px;
  }

  form .field-group input + input {
    margin-left: 24px;
  }

  form .field-check {
    flex-direction: row;
    align-items: center;
  }

  form .field-check input[type=checkbox] {
    background: #F0F0F5;
  }

  form .field-check label {
    margin: 0 0 0 8px;
  }

  form .leaflet-container {
    width: 100%;
    height: 350px;
    border-radius: 8px;
    margin-bottom: 24px;
  }

  form button {
    width: 260px;
    height: 56px;
    background: var(--primary-color);
    border-radius: 8px;
    color: #FFF;
    font-weight: bold;
    font-size: 16px;
    border: 0;
    align-self: flex-end;
    margin-top: 40px;
    transition: background-color 0.2s;
    cursor: pointer;
  }

  form button:hover {
    background: #2FB86E;
  }

  .items-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    list-style: none;
  }

  .items-grid li {
    background: #f5f5f5;
    border: 2px solid #f5f5f5;
    height: 180px;
    border-radius: 8px;
    padding: 32px 24px 16px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    text-align: center;

    cursor: pointer;
  }

  .items-grid li span {
    flex: 1;
    margin-top: 12px;

    display: flex;
    align-items: center;
    color: var(--title-color)
  }

  .items-grid li.selected {
    background: #E1FAEC;
    border: 2px solid #34CB79;
  }
`;
