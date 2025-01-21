

// server.js (signup route)
const express = require('express');
const bcrypt = require('bcryptjs');
const path=require("path");
// server.js (login route)
const jwt = require('jsonwebtoken'); // To generate token
// const User = require('./models/users');
// serverequire("r.js (saving chat message)
require('dotenv').config(); // Load environment variables from .env
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const User = require('./models/User'); // Adjust the path if needed

const cookieParser = require("cookie-parser");

// Use cookie-parser middleware
const feed=require("./models/feedback");

const session = require('express-session');
const Chat = require('./models/chat');
const History = require('./models/history');
const hbs=require("hbs");
require("./db/conn")
const app = express();
app.use(express.json({ limit: '10mb' }));  // Increase to 10MB (or as needed)
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname,"views")));
app.set("view engine","hbs");
// hbs.registerPartial(path.join(__dirname,"views","partials"));

const mongoose=require("mongoose");
const User = require("./models/users");
// const chat=require("./models/chat");

const auth=require("./middleware/auth");
app.use(session({
    secret: 'yourSecretKey', // Change this to a secure key in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Use true if you are using https
}));


app.get("/",(req,res)=>
{
  
  res.render("welcome",{email:"",password:""});
})
// Signup route
app.post('/signup', async (req, res) => {
    try {
        // console.log(req.body); // Debugging: Log received data
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new User({
            username: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });

        await newUser.save();
        // console.log("User saved successfully");
        res.status(200).redirect("/");
    } catch (err) {
        console.error("Signup error:", err);
        res.status(400).redirect("/");
    }
});

// Signup route
app.post('/feedback', async (req, res) => {
  try {
      // console.log(req.body); // Debugging: Log received data
     
      const fed= new feed({
          name: req.body.name,
          email: req.body.email,
          feedback: req.body.feedback,
      });

      await fed.save();
      // console.log("User saved successfully");
      res.status(200).render("about");
  } catch (err) {
      console.log(err);
  }
});


app.get('/index', auth, (req, res) => {
  res.render('index');
});



app.post("/login", async (req, res) => {
  try {
    const em = req.body.email;
    const pas = req.body.password;
    const TWO_DAYS_IN_MS = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds

    
    // Find user by email
    const user = await User.findOne({ email: em });

    if (user) {
      // Compare entered password with hashed password
      const match = await bcrypt.compare(pas, user.password);

      if (match) {
        // Generate a JWT token using the model's method
        const token = await user.generatetoken();

        // Set the token in a cookie
        res.cookie("jwt", token, {
          expires: new Date(Date.now() + TWO_DAYS_IN_MS), // Set token expiration in cookies
          httpOnly: true, // Prevent client-side access to the cookie
        });

        // Redirect to /index instead of rendering directly
        return res.redirect("/index");
      } else {
        // Invalid password
        res.status(400).redirect("/");}
    } else {
      // User not found
      res.status(400).redirect("/");
    }
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).send("Internal server error");
  }
});




// app.post('/api/chat', async (req, res) => {
//     const { userMessage, aiResponse } = req.body;
    
//     // Get userId from the token
//     const token = req.headers.authorization;
//     if (!token) {
//         return res.status(403).json({ status: 'error', message: 'Authorization required' });
//     }

//     try {
//         const decoded = jwt.verify(token, 'your_jwt_secret');
//         const userId = decoded.userId; // Extract userId from the token

//         const newChat = new Chat({ userMessage, aiResponse, userId });
//         await newChat.save();
        
//         res.status(201).json({ status: 'success', message: 'Chat saved!' });
//     } catch (err) {
//         res.status(500).json({ status: 'error', message: 'Failed to save chat' });
//     }
// });


// // server.js (retrieving chat history)
// app.get('/api/chat', async (req, res) => {
//     const token = req.headers.authorization;
//     if (!token) {
//         return res.status(403).json({ status: 'error', message: 'Authorization required' });
//     }

//     try {
//         const decoded = jwt.verify(token, 'your_jwt_secret');
//         const userId = decoded.userId;

//         const chats = await Chat.find({ userId }).sort({ timestamp: 1 });
//         res.json(chats);
//     } catch (err) {
//         res.status(500).json({ status: 'error', message: 'Failed to retrieve chats' });
//     }
// });

app.get("/logoutall", auth, async (req, res) => {
  try {
    // Ensure req.user and req.token are defined
    if (!req.user || !req.token) {
      return res.status(400).send("User not logged in or token missing.");
    }

    console.log("Logging out user:", req.user);
    console.log("Token to be removed:", req.token);

    // Remove the token from the user's tokens array
    req.user.tokens =[];
    // Clear the JWT cookie
    res.clearCookie("jwt");

    // Save the updated user document
    await req.user.save();

    console.log("Logout successful");
    res.redirect("/");
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).send("Internal server error");
  }
});



app.get("/logout", auth, async (req, res) => {
  try {
    // Ensure req.user and req.token are defined
    if (!req.user || !req.token) {
      return res.status(400).send("User not logged in or token missing.");
    }

    console.log("Logging out user:", req.user);
    console.log("Token to be removed:", req.token);

    // Remove the token from the user's tokens array
    req.user.tokens = req.user.tokens.filter((curr)=>
    {
      return curr.token!=req.token;
    })

    // Clear the JWT cookie
    res.clearCookie("jwt");

    // Save the updated user document
    await req.user.save();

    console.log("Logout successful");
    res.redirect("/");
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).send("Internal server error");
  }
});





app.post('/history', async (req, res) => {
    const { title } = req.body;

    try {
      console.log("hello"+title);
      const token = req.cookies.jwt;
      // console.log(token);
      const decoded = jwt.verify(token, process.env.secret_key);
      // console.log(decoded);
      const id = decoded._id;
      //  console.log(emaill);/

        // Create a new history entry
        const history = new History({ title,id });
        const savedHistory = await history.save();
        
        // Respond with the saved chat history
        res.status(201).json(savedHistory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/sendusermsg', async (req, res) => {
  const { historyid, userMessage } = req.body; // Get user message and AI response

  try {
    // Check for token in cookies
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "Authentication token is missing" });
    }

    // Decode the token to get user ID
    const decoded = jwt.verify(token, process.env.secret_key);
    const userId = decoded._id;

    // Check if a chat history already exists for the given historyid
    let chat = await Chat.findOne({ historyid });

    if (chat) {
      // If history exists, update the userMessage and aiResponse arrays
      chat.userMessage.push(userMessage); // Add new user message to the array
      
      await chat.save(); // Save the updated chat document
    } else {
      // If no history exists, create a new one
      chat = new Chat({
        userMessage: [userMessage],
      
       
        historyid,
        id: userId, // Store the user ID
      });
      await chat.save(); // Save the new chat document
    }

    // Respond with the updated or created chat document
    res.status(201).json(chat);

  } catch (error) {
    console.error('Error in /sendusermsg:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/about",auth,(req,res)=>
{
  res.render("about");
})

app.get('/viewchat/:historyId', async (req, res) => {
  try {
      const { historyId } = req.params;
      console.log(historyId);

      // Retrieve chat history from the database using historyId
      const chatHistory = await Chat.findOne({ historyid: historyId });

      if (!chatHistory) {
          return res.status(404).json({ error: "Chat history not found" });
      }
      console.log(chatHistory);

      res.json({
          userMessages: chatHistory.userMessage,
          aiResponses: chatHistory.aiResponse,
      });
  } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});


app.post('/sendaimsg', async (req, res) => {
  const { aiResponse, historyid } = req.body; // Get AI response and historyid

  try {
    // Check for token in cookies
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "Authentication token is missing" });
    }

    // Decode the token to get user ID
    const decoded = jwt.verify(token, process.env.secret_key);
    const userId = decoded._id;

    // Find the chat history by historyid and update it with the new aiResponse
    const chat = await Chat.findOneAndUpdate(
      { historyid },  // Find by historyid
      { $push: { aiResponse } }, // Push the new API response to the apiResponse array
      { new: true } // Return the updated document
    );

    if (!chat) {
      return res.status(404).json({ error: "Chat history not found" });
    }

    // Respond with the updated chat document
    res.status(201).json(chat);

  } catch (error) {
    console.error('Error in /sendaimsg:', error);
    res.status(500).json({ error: error.message });
  }
});




app.get('/history', async (req, res) => {
  try {
      const token = req.cookies.jwt;  // Get JWT token from cookies
      const decoded = jwt.verify(token, process.env.secret_key);  // Decode the token
      const userId = decoded._id;  // Get the user ID from the decoded token
      // console.log(userId);
      // Retrieve the chat history for the logged-in user
      const history = await History.find({ id:userId }).sort({timestamp:-1}).exec();
      // console.log("j"+history);
   
      // Send the history back as JSON
      res.json(history);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Assuming you're using Express
app.delete('/history', async (req, res) => {
  try {
      const token = req.cookies.jwt;
      const decoded = jwt.verify(token, process.env.secret_key);
      const userId = decoded._id;
      await Chat.deleteMany({id:userId});


      // Delete chat history for the user
      await History.deleteMany({ id: userId });

      // Respond with success
      res.status(200).json({ message: 'History deleted successfully' });
  } catch (error) {
      res.status(500).json({ error: 'Error deleting history' });
  }
});

app.delete('/historydelete', async (req, res) => {
  try {
    const {id}=req.body;
    // console.log("id is"+id);
      const token = req.cookies.jwt;
      const decoded = jwt.verify(token, process.env.secret_key);
      const userId = decoded._id;
      await History.deleteOne({ _id: id});
      await Chat.deleteOne({historyid:id});
      

      // Delete chat history for the user
  

      // Respond with success
      res.status(200).json({ message: 'History deleted successfully' });
  } catch (error) {
      res.status(500).json({ error: 'Error deleting history' });
  }
});

app.get("/index/*",(req,res)=>
{
  res.redirect("/index");
})
app.get("*",(req,res)=>
{
  res.redirect("/");
})
app.listen(5000); 