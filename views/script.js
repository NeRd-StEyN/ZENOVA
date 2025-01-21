// JavaScript for toggling the sidebar
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");

    // Check if the sidebar is visible or not, then toggle the left position accordingly
    if (sidebar.style.left === "0px") {
        sidebar.style.left = "-400px"; // Hide sidebar
    } else {
        sidebar.style.left = "0px"; // Show sidebar
    }
}

let how = true;
let tit = ""
let aacha = true;

let bool = false;
let boo = true;
// Select relevant DOM elements
let imagebtn = document.querySelector("#image");
const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyC5j_dj6RHXtEHb-Uzoc5c6yxUfgoGrnSg";
let user = {
    message: null,
    file: {
        mime_type: null,
        data: null
    }
};




const addChatButton = document.getElementById('add-chat');
const clear = document.getElementById('clear-chats');
const inputField = document.querySelector('#text'); // Define your input field element
const chatContainer = document.querySelector('#chat-container'); // Define your chat container element


// Assuming 'clear' is the button element to clear history
clear.addEventListener("click", async () => {
    try {
        location.reload();

        // Send a DELETE request to the server to delete chat history
        const response = await fetch('/history', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // If the request was successful
        if (response.ok) {
            console.log('Chat history deleted successfully');
            // You can update the UI or remove the history list from the page here
            document.getElementById('chat-history').innerHTML = ''; // Clear the chat history on the frontend
        } else {
            console.error('Error deleting history:', await response.json());
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Event listener for the "+" button to start a new chat
addChatButton.addEventListener('click', () => {

    bool = true;
    // console.log(inputField);
    // Reset the input field and create a new chat
    inputField.value = '';
    chatContainer.innerHTML = '';


});



document.getElementById("scrollToBottom").addEventListener("click", function (event) {
    event.preventDefault();
    chat.scrollTo({ top: chat.scrollHeight, behavior: "smooth" })
});

let chat = document.querySelector(".chat-container");
let play = document.querySelector("#play");  // Ensure you're targeting the play icon correctly

// Initially hide pause icon
play.style.display = "block";


// Function to add a user message
function addUserMessage(message, i) {
    // Create chat message div for user
    const chatMessage = document.createElement("div");
    chatMessage.classList.add("chat-message", "user");

    // Create the user chat bubble
    const userBubble = document.createElement("div");
    userBubble.classList.add("chat-bubble", "user");
    if (user.file.data || i) {
        const userImage = document.createElement("img");
        userImage.src = i ? `data:image/jpeg;base64,${i}` : `data:${user.file.mime_type};base64,${user.file.data}`;
        userImage.classList.add("user-image");
        userImage.style = "height:100px;"
        userBubble.appendChild(userImage);
        const br = document.createElement("br");
        userBubble.appendChild(br);
        console.log(`data:${user.file.mime_type};base64,${user.file.data}`);
    }

    // Create a span to hold the message text
    const userText = document.createElement("span");
    userText.classList.add("message-text");
    userText.textContent = message; // Populate the span with the message text
    userBubble.appendChild(userText);


    // If there's an image, display it in the user bubble


    // Create the user icon
    const userIcon = document.createElement("img");
    userIcon.src = "user.png";
    userIcon.alt = "User Icon";
    userIcon.classList.add("chat-icon");
    userIcon.id = "chi";

    const copyButton = document.createElement("button");
    const ii = document.createElement("i");

    // Add Font Awesome classes to the <i> tag
    ii.classList.add("fa-solid", "fa-copy");
    ii.style.fontSize = "30px";


    // Make the button invisible while keeping the <i> tag visible
    copyButton.style.background = "none";
    copyButton.style.border = "none";
    copyButton.style.padding = "0";
    copyButton.style.margin = "0";
    copyButton.style.cursor = "pointer";

    // Append the <i> tag to the button
    copyButton.append(ii);

    // Add the class and functionality for copying
    copyButton.classList.add("copy-btn");
    copyButton.onclick = () => copyMessage(userText); // Bind the copy function to the span

    // Append the button to the user bubble
    userBubble.appendChild(copyButton);

    // Append the bubble and icon to the chat message
    chatMessage.appendChild(userBubble);
    chatMessage.appendChild(userIcon);


    // Append the entire chat message to the container
    document.getElementById("chat-container").appendChild(chatMessage);
    let w = user.file.data;
    console.log("at user message" + how);
    if (how) {
        sendusermsg(message, w);


    }
    how = true;





    // console.log(tit+message);


    // sendusermsg(chatMessage);
    // const loader=document.createElement("img");
    // loader.src="loading.webp";
    // loader.style.color="blue";
    // document.getElementById("chat-container").after(loader)
    chat.scrollTo({ top: chat.scrollHeight, behavior: "smooth" })

}

async function sendusermsg(message, w) {
    try {

        console.log("Sending request with:", tit, message);
        // Check if tit or message is undefined or empty


        const response = await fetch('/sendusermsg', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ historyid: tit, userMessage: w ? { text: message, image: w } : { text: message } }),
        });

        const responseData = await response.json(); // Await response

        console.log("Response Data:", responseData);
    } catch (err) {
        console.error("Error in sending message:", err);
    }
}

async function sendaimsg(message) {
    try {
        // console.log("Sending request with:", tit, message);
        // Check if tit or message is undefined or empty

        console.log(message);
        const response = await fetch('/sendaimsg', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ historyid: tit, aiResponse: message }),
        });

        const responseData = await response.json(); // Await response

        console.log("Response Data:", responseData);
    } catch (err) {
        console.error("Error in sending message:", err);
    }
}

// Function to add a bot message
function addBotMessage(message) {
    document.querySelector("#text").disabled = true;
    // Create chat message div for bot
    const chatMessage = document.createElement("div");
    chatMessage.classList.add("chat-message", "bot");

    // Create the bot chat bubble
    const botBubble = document.createElement("div");
    botBubble.classList.add("chat-bubble", "bot");

    // Create a span to hold the typing text
    const botText = document.createElement("span");
    botBubble.appendChild(botText);

    // Create the bot icon
    const botIcon = document.createElement("img");
    botIcon.src = "ai.png";
    botIcon.alt = "Bot Icon";
    botIcon.classList.add("chat-icon");
    botIcon.id = "chii";

    // Create the copy button
    const copyButton = document.createElement("button");
    const ii = document.createElement("i");

    // Add Font Awesome classes to the <i> tag
    ii.classList.add("fa-solid", "fa-copy", "fa");
    ii.style.fontSize = "30px";
    // ii.style.color="white"; // Adjust size for a better fit

    // Append the <i> tag to the button
    copyButton.appendChild(ii);

    // Style the button to make it functional but invisible
    copyButton.style.background = "none";
    copyButton.style.border = "none";
    copyButton.style.padding = "0";
    copyButton.style.margin = "0";
    copyButton.style.cursor = "pointer";
    copyButton.classList.add("copy-btn");
    // Add positioning for the copy button
    copyButton.style.position = "absolute";
    copyButton.style.top = "10px";
    copyButton.style.right = "10px";

    const button = document.createElement('button');
    button.id = 'sub';
    button.style.background = 'none';
    button.style.border = 'none';
    button.style.color = 'white';
    button.style.cursor = 'pointer';
    button.style.fontSize = '35px';
    button.style.position = 'absolute';
    button.style.top = '8px';
    button.style.right = '70px'; // Center horizontally using 50% of viewport width
    button.style.zIndex = '100';

    // Create the icon inside the button
    const icon = document.createElement('i');
    icon.classList.add('fa-solid', 'fa-pause', "pause");
    icon.id = 'pause';  // Icon ID if needed for further customization

    // Append the icon to the button
    button.appendChild(icon);

    botBubble.appendChild(button);

    // Bind the copy function to the button
    copyButton.onclick = () => copyMessage(botText);

    // Add the button to the bot bubble
    botBubble.appendChild(copyButton);

    // Append the bot icon and bubble to the chat message
    chatMessage.appendChild(botIcon);
    chatMessage.appendChild(botBubble);


    // Append the entire chat message to the container
    document.getElementById("chat-container").appendChild(chatMessage);

    // Function to simulate typing animation
    let index = 0;
    let stop = 0;

    button.addEventListener("click", () => {
        stop = 1
    });
    // console.log(stop);

    function typeCharacter() {

        if (!aacha) {
            botText.textContent = message;
            aacha = true;
            const inpFile = document.querySelector("#image");
            inpFile.style.display = "block";
            button.style.display = "none";
            // paus.style.display = "none"; // Hide pause icon
            play.style.display = "block";
            chat.scrollTo({ top: chat.scrollHeight, behavior: "smooth" })

            return;

        }
        if (index < message.length && stop == 0) {
            botText.textContent += message[index];
            chat.scrollTo({ top: chat.scrollHeight, behavior: "smooth" })

            index++;
            setTimeout(typeCharacter, 10);
        }
        else {
            const inpFile = document.querySelector("#image");
            inpFile.style.display = "block";
            button.style.display = "none";
            // paus.style.display = "none"; // Hide pause icon
            play.style.display = "block";
            if (how) {
                sendaimsg(botText.innerText);


            }
            how = true;



        }


    }
    // Start typing animation
    typeCharacter();
    if (!stop) {


        // After bot message is displayed, show play icon and hide pause icon
        setTimeout(() => {
            const inpFile = document.querySelector("#image");
            inpFile.style.display = "block";
            button.style.display = "none";
            // paus.style.display = "none"; // Hide pause icon
            play.style.display = "block"; // Show play icon
        }, message.length * 10 + 4000);

    }



    // Delay based on typing speed


}







function copyMessage(bubble) {
    const text = bubble.innerText || bubble.textContent;

    // Create a temporary input element to select the text
    const tempInput = document.createElement('input');
    document.body.appendChild(tempInput);
    tempInput.value = text;
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // For mobile devices

    try {
        navigator.clipboard.writeText(text);
        // alert('Message copied to clipboard!');
    } catch (err) {
        // alert('Unable to copy message.');
    }

    // Remove the temporary input element
    document.body.removeChild(tempInput);
}



// Initially show play icon

// Function to generate a response from the AI API
async function generateResponse() {
    const userMessage = document.querySelector("#text").value;

    // If no message, do nothing
    if (!userMessage && !user.file.data) {
        return;
    }

    if (bool || boo) {
        await sendMessage(userMessage);
        // console.log("tit is"+tit)

        bool = false;
        boo = false;
    }

    const textField = document.querySelector("#text");
    const submitButton = document.querySelector("#sub");
    textField.disabled = true;
    submitButton.disabled = true;

    const inputFile = document.querySelector("#image");
    inputFile.style.display = "none";

    play.style.display = "none";  // Hide play icon

    // Clear the text input
    textField.value = "";

    // Prepare image and message for request
    if (userMessage || user.file.data) {
        const img = document.querySelector("#image img");
        img.src = "";
        img.classList.remove("choose");
        img.style.display = "none";

        addUserMessage(userMessage);

        const requestBody = {
            contents: [
                {
                    "role": "user",
                    "parts": [
                        { text: userMessage },
                        ...(user.file.data ? [{ inline_data: user.file }] : []) // Include image data if present
                    ]
                }
            ]
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            const apiResponse = data?.candidates[0].content.parts[0].text
                .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold formatting if needed
                .replace(/\\boxed{(.*?)\\}/g, "$1") // Remove boxed notation from LaTeX if present
                .trim();

            if (apiResponse) {
                addBotMessage(apiResponse);
                user.file.mime_type = null;
                user.file.data = null;
            } else {
                console.error('No valid response text from API');
            }
        } catch (error) {
            alert("Error in generating response");
        }
    } else {
        console.error('No message or image data to send.');
    }

    // Re-enable input fields and button after response is received
    textField.disabled = false;
    submitButton.disabled = false;

}
// Get all Font Awesome icons
const icons = document.querySelectorAll("i");

// Loop through each icon and change the color to black


let input = document.querySelector("#input");
const body = document.querySelector('body');
const q = document.querySelector('#q');
let sun = document.querySelector("#sun");
let moon = document.querySelector("#moon");
let text = document.querySelector("#text");
let h3 = document.querySelector(".sidebar h3");
let sidebar = document.querySelector(".sidebar");
sun.addEventListener("click", (e) => {
    e.preventDefault();
    sun.style.display = "none";
    moon.style.display = "inline-block";
    body.style.color = "white";
    icons.forEach(icon => {
        icon.style.color = 'black';
        q.style.color = "black";
        q.style.fontWeight = "bold";
        text.style.color = " black";
        text.style.backgroundColor = " rgb(143, 145, 147)";
        h3.style.color = "black";
        text.style.border = " 5px solid rgba(0, 0, 0, 0.9)";
        sidebar.style.backgroundColor = "white";
        // text.ariaPlaceholder.style.color="rgb(0, 0, 0)";

    });


    const style = document.createElement('style');
    style.innerHTML = `
      .chat-bubble.bot {
        
        color: black;
          font-weight:bold;
}
        .chat-bubble.user{
    color:black;
    font-weight:bold;
    }
    .copy-btn i{
    color:black;}

    .pause{
    color:black}

       .lily{
    color:black}

 
    .dropdown h2{
    background: linear-gradient(to right,rgb(21, 255, 0),rgb(0, 89, 255), #ff0000);background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: bold;}


    `;
    document.head.appendChild(style);
    chat.style.backgroundColor = " rgb(196, 190, 190)";
    // alert("hello");
    body.style.backgroundColor = " rgb(196, 190, 190)";

    // chat.style.backgroundColor="black";

});
moon.addEventListener("click", (e) => {
    e.preventDefault();
    moon.style.display = "none";
    sun.style.display = "inline-block";
    icons.forEach(icon => {
        icon.style.color = 'white';
    });
    // alert("hello");
    text.style.color = " rgb(255, 255, 255)";
    text.style.backgroundColor = " rgb(14, 15, 16)";
    text.style.border = " 5px solid rgba(255, 255, 255, 0.9)";
    q.style.color = "white";
    q.style.fontSize = " 20px";
    h3.style.color = "white";
    sidebar.style.backgroundColor = "black";
    // text.ariaPlaceholder.style.color="  #ffffff";
    chat.style.backgroundColor = "rgb(45, 52, 59)";
    body.style.backgroundColor = "rgb(45, 52, 59)";
    body.style.color = "white";


    const style = document.createElement('style');
    style.innerHTML = `
  .chat-bubble.bot {
    
    color: white;
   
  }
    .chat-bubble.user{
    color:white;
   
    }
    .copy-btn i{
    color:white;
    }
        .pause{
    color:white;}

    .dropdown h2{
    background: linear-gradient(to right,rgb(195, 255, 0),rgb(255, 0, 200),rgb(0, 170, 255));background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: bold;}

    .lily{
    color:white};
`;
    document.head.appendChild(style);


});

// Event listener for the submit button to trigger response generation
document.querySelector("#sub").addEventListener("click", () => {
    const userMessage = document.querySelector("#text").value;
    how = true;
    if (userMessage) {
        generateResponse();
    }
    else {

    }

});

// Handle enter key for response submission
window.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        how = true;
        const userMessage = document.querySelector("#text").value;
        if (userMessage) {
            generateResponse();
        }
        else {

        }


    }
});


// Image file input handling
imagebtn.addEventListener("click", () => {
    const inputElement = imagebtn.querySelector("input");
    if (inputElement) {
        inputElement.click(); // Trigger the file input click event
    }
});

// Image file change event
document.querySelector("#image input").addEventListener("change", () => {
    const file = document.querySelector("#image input").files[0]; // Get the selected file
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const base64string = e.target.result.split(",")[1]; // Extract base64 string from the image file

        // Store the image data in the user object
        user.file = {
            mime_type: file.type,
            data: base64string
        };

        // Display the selected image in the image element
        const img = document.querySelector("#image img");
        if (img) {

            img.src = `data:${user.file.mime_type};base64,${user.file.data}`;
            img.classList.remove("i");
            img.style.display = "block";
            img.classList.add("choose");
            // Add a CSS class to style the selected image
        } else {
            console.log("Image element not found.");
        }
    };

    reader.readAsDataURL(file); // Read the image as Data URL
});





const button = document.getElementById('zenovaButton');
const dropdownContent = document.getElementById('dropdownContent');

button.addEventListener('click', () => {
    // Toggle the visibility of the dropdown menu
    dropdownContent.style.display =
        dropdownContent.style.display === 'block' ? 'none' : 'block';
});

// Close the dropdown if the user clicks outside of it
window.addEventListener('click', (e) => {
    if (!button.contains(e.target) && !dropdownContent.contains(e.target)) {
        dropdownContent.style.display = 'none';
    }
});


async function sendMessage(message) {
    try {
        // Send the message to the server via POST request
        const response = await fetch('/history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: message }),
        });

        const data = await response.json();  // Get the JSON data (saved history)
        if (response.ok) {
            // Dynamically update the chat history without refreshing the page
            const historyElement = document.createElement('li');
            historyElement.classList.add("lily");

            let div = document.createElement("div");
            div.classList.add("options");

            let b1 = document.createElement("button");
            b1.innerText = "View";

            let b2 = document.createElement("button");
            b2.innerText = "Delete";

            b1.classList.add("view-btn");
            b2.classList.add("delete-btn");

            div.append(b1);
            div.append(b2);
            tit = data._id;


            const historyId = data._id; // Assume `data._id` is the unique identifier for this history
            historyElement.dataset.id = historyId;
            b2.dataset.id = historyId;
            b1.dataset.id = historyId;

            // Truncate the title if it's longer than 15 characters
            let displayTitle = data.title;
            if (displayTitle.length > 15) {
                displayTitle = displayTitle.substring(0, 15) + '...'; // Add ellipsis to show truncation
            }

            historyElement.innerHTML = `${displayTitle}`;
            historyElement.append(div);
            b2.addEventListener("click", async (e) => {
                e.stopPropagation();
                chatContainer.innerHTML="";
                // location.reload();// Prevent bubbling up to other event listeners
                try {
                    const idd = b2.dataset.id;

                    // Send a DELETE request to the server to delete chat history
                    const deleteResponse = await fetch('/historydelete', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ id: idd }),
                    });

                    // If the request was successful
                    if (deleteResponse.ok) {
                        console.log('Chat history deleted successfully');
                        // Remove the deleted history from the frontend
                        historyElement.remove();
                    } else {
                        console.error('Error deleting history:', await deleteResponse.json());
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            });

            //tach the event listener to the newly created history element (historyElement)
            historyElement.addEventListener("click", (e) => {
                e.stopPropagation(); // Prevent click event from bubbling up to the document

                // Close the previous open options
                document.querySelectorAll('.options').forEach(option => {
                    if (option !== div) {
                        option.style.display = 'none';
                    }
                });

                b1.addEventListener("click", async (e) => {
                    
                    e.stopPropagation();

                    try {
                        const idd = b1.dataset.id;
                        console.log(idd); // Get the history ID
                        const response = await fetch(`/viewchat/${idd}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });

                        if (response.ok) {
                            const chatData = await response.json();

                            // Clear the current chat container
                            const chatContainer = document.getElementById("chat-container");
                            chatContainer.innerHTML = "";

                            // console.log("at send message b1"+how);
                            // Iterate over the retrieved chat history
                            const userMessages = chatData.userMessages; // User messages array
                            const aiResponses = chatData.aiResponses;  // AI responses array

                            // Get the maximum length of the two arrays
                            const maxLength = Math.max(userMessages.length, aiResponses.length);
                            tit = idd;
                            console.log(tit);
                            // Alternate between userMessages and aiResponses
                            for (let i = 0; i < maxLength; i++) {
                                if (i < userMessages.length) {
                                    tit = idd;
                                    aacha = false;
                                    how = false;
                                    addUserMessage(userMessages[i].text, userMessages[i].image || null); // Add user message
                                }
                                if (i < aiResponses.length) {
                                    tit = idd;
                                    aacha = false;
                                    how = false;
                                    addBotMessage(aiResponses[i]); // Add AI response
                                }
                            }
                            const inputField = document.getElementById("text");
                            const sendButton = document.getElementById("sub");

                            if (inputField) inputField.disabled = false;
                            if (sendButton) sendButton.disabled = false;


                            // Set the global `tit` variable to the selected history ID
                            tit = idd; // Set the global state when loading a new chat
                            // console.log("Current chat history ID:", tit);


                        } else {
                            console.error("Error fetching chat history:", await response.json());
                        }
                    } catch (error) {
                        console.error("Error:", error);
                    }
                });


                // Toggle the current options visibility
                div.style.display = div.style.display === 'flex' ? 'none' : 'flex';
            });

            // Prepend the new history element to the chat history list
            document.getElementById('chat-history').prepend(historyElement);
        } else {
            console.error('Error saving history:', data.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Close all options if clicked anywhere outside
document.addEventListener('click', () => {
    document.querySelectorAll('.options').forEach(option => {
        option.style.display = 'none';
    });
});

// Prevent closing the options when clicking inside a list item
// document.getElementById('chat-history').addEventListener('click', (e) => {
//     e.stopPropagation();
// });

async function loadHistory() {
    try {
        const response = await fetch('/history', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const history = await response.json(); // Get the history data (array)

        if (response.ok) {
            // Dynamically display the history
            history.forEach(item => {
                const historyElement = document.createElement('li');
                historyElement.classList.add("lily");

                let div = document.createElement("div");
                div.classList.add("options");

                let b1 = document.createElement("button");
                b1.innerText = "View";

                let b2 = document.createElement("button");
                b2.innerText = "Delete";
                b2.dataset.id = item._id; // Correctly associate the unique ID with the button
                b1.classList.add("view-btn");
                b2.classList.add("delete-btn");
                b1.dataset.id = item._id;
                div.append(b1, b2);

                historyElement.dataset.id = item._id; // Store the unique ID in the `li` element's dataset

                // Truncate the title if it's longer than 15 characters
                let displayTitle = item.title;
                if (displayTitle.length > 15) {
                    displayTitle = displayTitle.substring(0, 15) + '...'; // Add ellipsis to show truncation
                }

                historyElement.innerHTML = displayTitle;
                historyElement.append(div);

                // Attach click listener to delete button
                b2.addEventListener("click", async (e) => {
                    e.stopPropagation();
                    chatContainer.innerHTML="";
                    // location.reload(); // Prevent bubbling up to other event listeners
                    try {
                        const idToDelete = b2.dataset.id;

                        // Send a DELETE request to the server to delete chat history
                        const deleteResponse = await fetch('/historydelete', {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ id: idToDelete }),
                        });

                        // If the request was successful
                        if (deleteResponse.ok) {
                            console.log('Chat history deleted successfully');
                            // Remove the deleted history from the frontend
                            historyElement.remove();
                        } else {
                            console.error('Error deleting history:', await deleteResponse.json());
                        }
                    } catch (error) {
                        console.error('Error:', error);
                    }
                });

                // Attach the event listener to toggle options
                historyElement.addEventListener("click", (e) => {
                    e.stopPropagation(); // Prevent click event from bubbling up to the document

                    // Close the previous open options
                    document.querySelectorAll('.options').forEach(option => {
                        if (option !== div) {
                            option.style.display = 'none';
                        }
                    });

                    // Toggle the current options visibility
                    div.style.display = div.style.display === 'flex' ? 'none' : 'flex';
                });

                b1.addEventListener("click", async (e) => {
                    e.stopPropagation();

                    try {
                        const idd = b1.dataset.id; // Get the history ID
                        const response = await fetch(`/viewchat/${idd}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });

                        if (response.ok) {
                            const chatData = await response.json();

                            // Clear the current chat container
                            const chatContainer = document.getElementById("chat-container");
                            chatContainer.innerHTML = "";
                            // how=false;
                            // console.log("at load history b1"+how);
                            // Iterate over the retrieved chat history
                     

                            // Assuming chatData contains userMessages and aiResponses
                            const userMessages = chatData.userMessages; // User messages array
                            const aiResponses = chatData.aiResponses;  // AI responses array
                            tit = idd;
                            console.log(tit);
                            // Get the maximum length of the two arrays
                            const maxLength = Math.max(userMessages.length, aiResponses.length);

                            // Alternate between userMessages and aiResponses
                            for (let i = 0; i < maxLength; i++) {
                                if (i < userMessages.length) {
                                    tit = idd;
                                    aacha = false;
                                    how = false;
                                    addUserMessage(userMessages[i].text, userMessages[i].image || null); // Add user message
                                }
                                if (i < aiResponses.length) {
                                    tit = idd;
                                    aacha = false;
                                    how = false;
                                    addBotMessage(aiResponses[i]); // Add AI response
                                }
                            }

                            const inputField = document.getElementById("text");
                            const sendButton = document.getElementById("sub");

                            if (inputField) inputField.disabled = false;
                            if (sendButton) sendButton.disabled = false;
                            tit = idd;

                            // Set the global `tit` variable to the selected history ID
                            // Set the global state when loading a new chat

                        } else {
                            console.error("Error fetching chat history:", await response.json());
                        }
                    } catch (error) {
                        console.error("Error:", error);
                    }
                });


                // Append the new history element to the chat history list
                document.getElementById('chat-history').appendChild(historyElement);
            });
        } else {
            console.error('Error loading history:', history.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Close all options if clicked anywhere outside
document.addEventListener('click', () => {
    document.querySelectorAll('.options').forEach(option => {
        option.style.display = 'none';
    });
});

// Prevent closing the options when clicking inside a list item
// document.getElementById('chat-history').addEventListener('click', (e) => {
//     e.stopPropagation();
// });


// Load history when the page is loaded
window.addEventListener('DOMContentLoaded', loadHistory);




//     </style>
// </head>
// <body>

//     <h1>Chat History</h1>
//     <ul id="chat-history">
//         <li class="history-item">
//             <span class="history-title">Chat Title 1</span>
//             <div class="options">
//                 <button class="view-btn">View</button>
//                 <button class="delete-btn">Delete</button>
//             </div>
//         </li>
//         <li class="history-item">
//             <span class="history-title">Chat Title 2</span>
//             <div class="options">
//                 <button class="view-btn">View</button>
//                 <button class="delete-btn">Delete</button>
//             </div>
//         </li>
//         <li class="history-item">
//             <span class="history-title">Chat Title 3</span>
//             <div class="options">
//                 <button class="view-btn">View</button>
//                 <button class="delete-btn">Delete</button>
//             </div>
//         </li>
//     </ul>

//     <script>
//         // Function to handle view action
//         function handleView(item) {
//             alert('Viewing: ' + item);
//         }

//         // Function to handle delete action
//         function handleDelete(item) {
//             if (confirm('Are you sure you want to delete this chat?')) {
//                 alert('Deleted: ' + item);
//                 // You can also remove the item from the list
//                 item.remove();
//             }
//         }

//         // Add event listeners to each list item
//         document.querySelectorAll('.history-item').forEach(item => {
//             const viewButton = item.querySelector('.view-btn');
//             const deleteButton = item.querySelector('.delete-btn');
//             const title = item.querySelector('.history-title').textContent;

//             // Handle view action
//             viewButton.addEventListener('click', () => handleView(title));

//             // Handle delete action
//             deleteButton.addEventListener('click', () => handleDelete(item));
//         });

//     </script>

// </body>
// </html>
