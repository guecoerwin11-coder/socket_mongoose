const socketAuth = require('../src/middleware/socketAuth')
const Message = require('../src/models/message')
const User = require('../src/models/users')
const { getUserOrCreate } = require('../src/controller/convoController')

const initSocket = (io) => {
    //use the middleware socket token
    io.use(socketAuth)  

    //says the this user is now online
    io.on('connection', async(socket) => {
        console.log(`connectd!, ${socket.user.name} is Online`)

        //it change now the isOnline to online since in the DB default as false
        await User.findByIdAndUpdate(socket.user.id, {
            isOnline: true,
            lastSeen: new Date()
        })

        //it says to whole system this user is now online
        socket.broadcast.emit('user online', {
            id: socket.user.id,
            name: socket.user.id
        })

        //create a priavte chat convo
        socket.on('start private chat', async({ recipientId }) => {
            try{

                //get or create conversation
                const conversation = await getUserOrCreate(
                    socket.user.id, recipientId
                )

                //join to conversation
                const roomId = conversation._id.toString()
                socket.join(roomId)

                console.log(`${socket.user.id} join to room ${roomId}`)

                //tell successfully join the room
                socket.emit('room joined', {
                    roomId,
                    conversationID: conversation._id
                })
            }catch(err){
                socket.emit('error', {message: err.message})
            }
        })

        //send a private message to user 
        socket.on('private message', async({ recipientId, text}) =>{
            try{

                //get conversation
                const conversation = await getUserOrCreate(
                    socket.user.id,
                    recipientId
                )

                //create a room id
                const roomId = conversation._id.toString()


                //save the private message to database
                const message = await Message.create({
                    conversation: conversation._id,
                    sender: socket.user.id,
                    text
                })
                
                await message.populate('sender', 'name')

                await conversation.updateOne({ lastMessage: message._id})

                const messageData = {
                    _id: message._id,
                    text: message.text,
                    sender: {
                        _id: socket.user.id,
                        name: socket.name.id
                    },
                    conversation: conversation._id,
                    createdAt: message.createdAt,
                    isRead: false
                }
            }catch(err){
                socket.emit('error', {message: err.message})
            }

            //typing indicator
            socket.on('typing', async ({recipientId}) => {
                try{
                    const conversation = await getUserOrCreate(
                        socket.user.id,
                        recipientId
                    )
                

                    const roomId = conversation._id.toString();
                }catch(err){}

            //the user is stop typing
             socket.io('stop typing', async({recipientId}) => {
                try{
                    const conversation = await getUserOrCreate(
                        socket.user.id,
                        recipientId
                    )

                    const roomId = conversation._id.toString()
                    socket.io(roomId).emit('stop typing')
                }catch(err){}
                
            })
            
            //disconnect user
            socket.on('disconnect', async () => {
                console.log(`X ${socket.user.name} is disconnect`)

                await User.findByAndUpdate(socket.user.id, {
                    isOnline: false,
                    lastSeen: new Date()
                })

                //tells everybody the user is disconnect
                socket.broadcast.emit('user offline', {
                    id: socket.user.id,
                    name: socket.user.name
                })
            })
            })
        })
    })
}

module.exports = initSocket