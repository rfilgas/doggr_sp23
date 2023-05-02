import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import { Match } from "./db/entities/Match.js";
import {User} from "./db/entities/User.js";
import {ICreateUsersBody, messageAllDelete, messageCreate, messageDelete, messageUpdate} from "./types.js";
import {Message} from "./db/entities/Message.js";

async function DoggrRoutes(app: FastifyInstance, _options = {}) {
	if (!app) {
		throw new Error("Fastify instance has no value during routes construction");
	}
	
	app.get('/hello', async (request: FastifyRequest, reply: FastifyReply) => {
		return 'hello';
	});
	
	app.get("/dbTest", async (request: FastifyRequest, reply: FastifyReply) => {
		return request.em.find(User, {});
	});
	

	
	// Core method for adding generic SEARCH http method
	// app.route<{Body: { email: string}}>({
	// 	method: "SEARCH",
	// 	url: "/users",
	//
	// 	handler: async(req, reply) => {
	// 		const { email } = req.body;
	//
	// 		try {
	// 			const theUser = await req.em.findOne(User, { email });
	// 			console.log(theUser);
	// 			reply.send(theUser);
	// 		} catch (err) {
	// 			console.error(err);
	// 			reply.status(500).send(err);
	// 		}
	// 	}
	// });
	
	// CRUD
	// C
	app.post<{Body: ICreateUsersBody}>("/users", async (req, reply) => {
		const { name, email, petType} = req.body;
		
		try {
			const newUser = await req.em.create(User, {
				name,
				email,
				petType
			});

			await req.em.flush();
			
			console.log("Created new user:", newUser);
			return reply.send(newUser);
		} catch (err) {
			console.log("Failed to create new user", err.message);
			return reply.status(500).send({message: err.message});
		}
	});
	
	//READ
	app.search("/users", async (req, reply) => {
		const { email } = req.body;
		
		try {
			const theUser = await req.em.findOne(User, { email });
			console.log(theUser);
			reply.send(theUser);
		} catch (err) {
			console.error(err);
			reply.status(500).send(err);
		}
	});
	
	// UPDATE
	app.put<{Body: ICreateUsersBody}>("/users", async(req, reply) => {
		const { name, email, petType} = req.body;
		
		const userToChange = await req.em.findOne(User, {email});
		userToChange.name = name;
		userToChange.petType = petType;
		
		// Reminder -- this is how we persist our JS object changes to the database itself
		await req.em.flush();
		console.log(userToChange);
		reply.send(userToChange);
		
	});


	
	// DELETE
	app.delete<{ Body: {email}}>("/users", async(req, reply) => {
		const { email } = req.body;
		
		try {
			const theUser = await req.em.findOne(User, { email });
			
			await req.em.remove(theUser).flush();
			console.log(theUser);
			reply.send(theUser);
		} catch (err) {
			console.error(err);
			reply.status(500).send(err);
		}
	});

	// CREATE MATCH ROUTE
	app.post<{Body: { email: string, matchee_email: string }}>("/match", async (req, reply) => {
		const { email, matchee_email } = req.body;

		try {
			// make sure that the matchee exists & get their user account
			const matchee = await req.em.findOne(User, { email: matchee_email });
			// do the same for the matcher/owner
			const owner = await req.em.findOne(User, { email });

			//create a new match between them
			const newMatch = await req.em.create(Match, {
				owner,
				matchee
			});

			//persist it to the database
			await req.em.flush();
			// send the match back to the user
			return reply.send(newMatch);
		} catch (err) {
			console.error(err);
			return reply.status(500).send(err);
		}

	});


	// READ ALL MESSAGES RECEIVED
	//
	// 	{
	// 		"receiver": "email@email.com"
	// 	}

	app.search<{ receiver: string }>("/messages", async (req, reply) => {
		const {receiver}  = await req.body;

		const theUser = await req.em.findOne(User, {email: receiver});
		const email = theUser.email;

		try {
			const messages = await req.em.find(Message, {receiver: { email }});
			console.log(messages);
			reply.send(messages);
		} catch (err) {
			console.error(err);
			reply.status(500).send(err);
		}
	});

	// READ ALL MESSAGES SENT
	// {
	// 	"sender": "email@email.com"
	// }

	app.search<{ sender: string }>("/messages/sent", async (req, reply) => {
		const {sender}  = await req.body;

		const theUser = await req.em.findOne(User, {email: sender});
		const email = theUser.email;

		try {
			const messages = await req.em.find(Message, {sender: { email }});
			console.log(messages);
			reply.send(messages);
		} catch (err) {
			console.error(err);
			reply.status(500).send(err);
		}
	});



	// CREATE A NEW MESSAGE
	// {
	// 	"sender": "email@email.com",
	// 	"receiver": "email2@email.com",
	// 	"message": "Hi"
	// }

	app.post<{Body: messageCreate}>("/messages", async (req, reply) => {
		const { sender, receiver, message} = req.body;

		try {
			const theSender = await req.em.find(User, { email: sender });
			const theReceiver = await req.em.find(User, { email: receiver });
			const newMessage = new Message();
			newMessage.sender = theSender[0];
			newMessage.receiver = theReceiver[0];
			newMessage.message = message;
			await req.em.persistAndFlush(newMessage);

			console.log("Created new message:", newMessage);
			return reply.send(newMessage);
		} catch (err) {
			console.log("Failed to create new user", err.message);
			return reply.status(500).send({message: err.message});
		}
	});


	// UPDATE A MESSAGE
	// {
	// 	"messageId": "1",
	// 	"message": "The new message text"
	// }

	app.put<{ Body: messageUpdate }>("/messages", async (req, reply) => {
		const {messageId, message}  = await req.body;

		try {
			const theMessage = await req.em.findOne(Message, {messageId});
			theMessage.message = message;
			await req.em.persistAndFlush(theMessage);

			console.log(theMessage);
			reply.send(theMessage);
		} catch (err) {
			console.log("Message Does Not Exist:", err.message);
			reply.status(500).send(err);
		}
	});


	// DELETE a message
	// {
	// 	"messageId": "1"
	// }

	app.delete<{ Body: messageDelete }>("/messages", async (req, reply) => {
		const {messageId}  = await req.body;

		try {
			const theMessage = await req.em.findOne(Message, {messageId});
			await req.em.remove(theMessage).flush();

			console.log("removed:");
			console.log(theMessage);
			reply.send(theMessage);
		} catch (err) {
			console.log("Message Does Not Exist:", err.message);
			reply.status(500).send(err);
		}
	});


	// DELETE ALL SENT MESSAGES
	// {
	// 	"sender": "email@email.com"
	// }

	app.delete<{ Body: { sender: string} }>("/messages/all", async (req, reply) => {
		const {sender}  = await req.body;
		const theUser = await req.em.findOne(User, {email: sender});
		const email = theUser.email;

		try {
			await req.em.nativeDelete(Message, {sender: { email }})
			await req.em.flush();

			const messagesRemaining = await req.em.find(Message, {sender: { email }});
			console.log(messagesRemaining);
			reply.send("Messages Deleted Successfully. This is what remains: " + messagesRemaining);
		} catch (err) {
			console.error(err);
			reply.status(500).send("No Messages Found" + err);
		}
	});


}

export default DoggrRoutes;
