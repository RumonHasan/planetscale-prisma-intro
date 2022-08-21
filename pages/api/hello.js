import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// post request
const createInquiry = async (req, res)=>{
  const body = req.body;
  try{
    const newEntry = await prisma.bookSuggestion.create({
      data:{
        bookTitle: body.title,
        bookAuthor: body.author,
        bookGenre: body.genre
      }
    });
    return res.status(200).json(newEntry, {success:true});
  }catch(error){
    res.status(500).json({error:'Error creating the new entry', success:false})
  }
}
// reading the data
const readBooks = async (req, res)=>{
  try{
    const books = await prisma.bookSuggestion.findMany();
    return res.status(200).json(books, {success:true});
  }catch(error){
    console.log(error, 'unable to fetch books');
    return res.status(500).json({error: 'Error reading from database'})
  }
}

// deleting an entry
const deleteEntry = async (req, res)=>{
  const id = req.body;
  console.log(id);
  try{
    const deleteBook = await prisma.bookSuggestion.delete({
      where: {
        id
      },
    });
    return res.status(200).json(deleteBook, {success:true});
  }catch(error){
    return res.status(500).json({error:'Unable to delete'})
  }
}
// updating an entry 
const updateEntry = async (req, res)=>{
  const body = req.body;
  const {title, author, genre, id} = body;
  try{
    const updateResponse = await prisma.bookSuggestion.update({
      where:{
        id: id
      },
      data:{
        bookAuthor: author,
        bookTitle: title,
        bookGenre: genre,
      }
    });
    return res.status(200).json(updateResponse, {success:true});
  }catch(error){
    return res.status(500).json({error:'Unable to update the entry', success: false})
  }
  
}

const handler = async (req, res)=>{
  if(req.method === 'POST'){
    return await createInquiry(req, res);
  }else if(req.method === 'GET'){
    return await readBooks(req, res);
  }else if(req.method === 'DELETE'){
    return await deleteEntry(req, res);
  }else if(req.method === 'PUT'){
    return await updateEntry(req, res);
  }
  else{
    return res.status(405).json({message:'Method has not been found', success:false})
  }
}

export default handler