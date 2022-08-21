import React, {useEffect, useState} from 'react'
import styles from '../styles/Home.module.css';
import axios from 'axios';

const CONTENT_TYPE = {"Content-Type":"application/json"};
const METHODS = {
  get: 'GET',
  post: 'POST',
  delete: 'DELETE',
  put: 'PUT',
}
const Home = ()=>{
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [data, setData] = useState([]);

  // boolean state for updating an entry
  const [updateState, setUpdateState] = useState(false);
  const [editId, setEditId] = useState('');

  const formStyles = {
    display:'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  }
  const getTheDetails =  () =>{
    try{
      const response = axios.get('/api/hello',data,{
        headers:CONTENT_TYPE,
      }).then(({data})=>{
        setData(data);
      });
      if(response !== 200){
        console.log('grabbed your shit')
      }else{
        console.log('failed to grab your shit');
      }
    }catch(error){
      console.log(error);
    }
  }
  // updating the data
  const updateHandler =  async (id)=>{
    const newContent = {title, author, genre, id};
    try{
      if(title === '' || author === '' || genre === ''){
        return;
      }
      const response = await fetch('/api/hello',{
        method: METHODS.put,
        headers:CONTENT_TYPE,
        body: JSON.stringify(newContent)
      });
      if(response.status !== 200){
        console.log('failed');
      }else{
        console.log('updated')
      }
    }catch(error){
      console.log(error);
    }
  }

  // initial render plus post render of fetching data from database
  useEffect(()=>{
    getTheDetails();
  },[]);

  const handleSubmit = async (e)=>{
    e.preventDefault();
    const contentBody = {title, author, genre};
    try{
      const response = await fetch('/api/hello',{
        method:METHODS.post,
        headers:CONTENT_TYPE,
        body:JSON.stringify(contentBody)
      });
      if(response.status !== 200){
        alert('some shit went wrong')
      }else{
        resetForm();
        console.log('data was successfully submitted')
      }
    }catch{
      console.log(error);
    }
  }

  // update an entry
  const updateEntry = (id) =>{
    setUpdateState(true);
    setEditId(id);
  }
  console.log(editId);

  // delete handler 
  const deleteHandler = async (id)=>{
    try{
      const response = await fetch('/api/hello',{
        method: METHODS.delete,
        headers: CONTENT_TYPE,
        body: id
        
      });
      if(response.status !== 200){
        console.log('failed');
      }else{
        console.log('deleted')
      }
    }catch(error){
      console.log(error);
    }
  }

  const resetForm = ()=>{
    setTitle('');
    setAuthor('');
    setGenre('');
  }

  return (
    <React.Fragment>
      <div style={formStyles}>
          <input placeholder='title' value={title} onChange={(e)=> setTitle(e.target.value)}/>
          <input placeholder='author' value={author} onChange={(e)=> setAuthor(e.target.value)}/>
          <input placeholder='genre' value={genre} onChange={(e)=> setGenre(e.target.value)}/>
          <button onClick={handleSubmit}>{updateState ? 'Update': 'Submit'}</button>
      </div>
      <div>
        <ul>
          {data.map((singleData)=>{
            const {bookAuthor, bookGenre, bookTitle, id} = singleData;
            return (
              <li className={styles.listItem} key={id}>
                {bookAuthor}, {bookGenre}, {bookTitle}, {id}
                <button onClick={()=>deleteHandler(id)}>Delete</button>
                <button onClick={()=>updateHandler(id)}>Update</button>
              </li>
            )
          })}
        </ul>
      </div>
    </React.Fragment>
  )
};

export default Home;