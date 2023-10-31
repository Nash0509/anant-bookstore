const anant = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = anant();
app.use(anant.json());
app.use(cors());

const bookSchema = mongoose.Schema(
    {
        title : {
            type : "string",
            required : true,
        },
        author : {
            type : "string",
            required : true,
        },
        publishYear : {
            type : "string",
            required : true,
        },
    },
    {
        timestamps : true,
    }
);

const Book = mongoose.model('Book', bookSchema);

app.use(anant.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://nishantsinghworkshard:nishant@cluster0.5hpxdcq.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
        console.log("App connected to the database");
        app.listen(3000);
    })
    .catch((err) => {
        console.log(err);
    });

    app.post('/books', async(req, res) => {
        try {
            if(
                !req.body.title || 
                !req.body.author ||
                !req.body.publishYear
             ) {
                return res.status(400).send({
                    message: 'Send all the required parameters.'
                })
             }
             const newBook = {
                title : req.body.title,
                author : req.body.author,
                publishYear : req.body.publishYear
             }
             const book = await Book.create(newBook);
             return res.status(200).send(book);
        } catch (err) {
            console.log(err.message);
            res.status(500).send({message : err.message});
        }
    })

    app.get('/books', async (req, res) => {
        try {
       const books = await Book.find({})
       return res.status(200).json({
        count : books.length,
        data : books
       });
        } catch (err) {
            console.log(err.message);
            return res.status(500).send({message : err.message});
        }
    })

    app.get('/books/:id', async (req, res) => {
        try {
             const book = await Book.findById(req.params.id);
             return res.status(200).json(book);
        } catch (err) {
            console.log(err.message);
            return res.status(500).send({message : err.message});
        }
    })

    app.put('/books/:id', async (req, res) => {
        try {
            if(
                !req.body.title || 
                !req.body.author ||
                !req.body.publishYear
             ) {
                return res.status(400).send({
                    message: 'Send all the required parameters.'
                })
             }

             const result = await Book.findByIdAndUpdate(req.params.id, req.body)
             
            if(!result) {
                return res.status(404).send({message: 'Not found the book...'})
            }
            
            return res.status(200).send({message: 'Book updated '});
            

        } catch (err) {
            console.log(err.message);
            res.status(500).send({message : err.message});
        }
    })

    app.delete('/books/:id', async (req, res) => {
        try {
           const result = await Book.findByIdAndDelete(req.params.id);

           if(!result) {
            return res.status(404).send({message : "Book Deleted"});
           }
           return res.status(200).send({message : "Book Deleted"});
        } catch (err) {
            console.log(err.message);
            res.status(500).send({message : err.message});
        }
    })