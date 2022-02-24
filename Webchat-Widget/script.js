const socket = io("http://localhost:5005");


const messages = document.getElementById('messages');
const form = document.getElementById('form');
const messageInput = document.getElementById('message-input');

function scrollToBottom() {
	window.scrollTo(0, document.body.scrollHeight);
}

function appendMessage(msg, type) {
	const item = document.createElement('div');
	item.textContent = msg;
	item.classList.add("message");
	item.classList.add(`message_${type}`);
	messages.appendChild(item);
	scrollToBottom();
}

function appendImage(src, type) {
	const item = document.createElement('div');
	item.classList.add("message");
	item.classList.add(`message_${type}`);
	const img = document.createElement('img');
	img.src = src;
	img.onload = scrollToBottom;
	item.appendChild(img);
	messages.appendChild(item);
}

function appendQuickReplies(quickReplies) {
	const quickRepliesNode = document.createElement('div');
	quickRepliesNode.classList.add("quick-replies");
	quickReplies.forEach(quickReply => {
		const quickReplyDiv = document.createElement('button');
		quickReplyDiv.innerHTML = quickReply.title;
		
		quickReplyDiv.classList.add("button");
		
		quickReplyDiv.addEventListener("click", () => {
			messages.removeChild(quickRepliesNode);
			appendMessage(quickReply.title, "sent");
			socket.emit('user_uttered', {
				"message": quickReply.payload,
			});
		})
		quickRepliesNode.appendChild(quickReplyDiv);
	})
	messages.appendChild(quickRepliesNode);
	scrollToBottom();
}

form.addEventListener('submit', function (e) {
	
	e.preventDefault();
	const msg = messageInput.value;
	if (msg) {
		socket.emit('user_uttered', {
			"message": msg,
		});
		messageInput.value = '';

		appendMessage(msg, "sent");
	}
});

socket.on('connect', function () {
	//connessione effettuata
	
	
	console.log('Connessione effettuata');

});

socket.on('connect_error', (error) => { 
	//scrive sulla console errore di connessione
	console.error(error);
});




socket.on('bot_uttered', function (response) {
	console.log("Bot uttered:", response);
	if (response.text) {
		appendMessage(response.text, "received");
	}
	if (response.attachment) {
		appendImage(response.attachment.payload.src, "received");
	}
	if (response.quick_replies) {
		appendQuickReplies(response.quick_replies);
	}
});


function openForm() {
	document.getElementById("myForm").style.display = "block";
  }
  
  function closeForm() {
	document.getElementById("myForm").style.display = "none";
  }