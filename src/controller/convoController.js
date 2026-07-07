const Message = require('../models/message');
const Conversation  = require('../models/conversation');

const getUserOrCreate = async (req, res) => {
    //find user online 
    let conversation = await Conversation.findOne({
        participants: { $all: [userId1, userId2]}
    })

    if(!conversation){
        conversation = await Conversation.create({
            participants: [userId1, userId2]
        })
    }

    return conversation;
}

//get the message history in the getUserOrCreate function
const getMessage = async (req, res) => {
    try{
        const {particiantsId} = req.params;

        const conversation = await getUserOrCreate(
            req.user.id,
            participants
        )

        const message = await Message.find({
            conversation: conversation._id
        })
            .populate('sender', 'name')
            .sort({createdAt: 1})
            .limit(50)
        
        //mark as read
        await Message.updateMany(
            {
                conversation: conversation._id,
                sender: {$ne: req.user.id},
                isRead: false
            },
            {isRead: true}
        )

        res.status(200).json({
            conversationId: conversation._id,
            messages
        })


    }catch(err){
        res.status(500).json({message: err.message})
    }
}

const getUnreadCounts = async (req, res) => {
    try{
        const conversation = await Conversation.find({
            participants: req.user.id
        })

        const counts = {}
        for(const conv of conversation){
            const otherUser = conv.participants.find(
                p => p.toString() !== req.user.id
            )

            const count = await Message.countDocuments({
            conversation: conv._id,
            sender: otherUser,
            isRead: false
        })

        if(count > 0) counts[otherUser.toSting()] = count

        }

        
    }catch(err){
         res.status(500).json({ message: err.message })
    }
}

module.exports ={getUserOrCreate, getMessage, getUnreadCounts}