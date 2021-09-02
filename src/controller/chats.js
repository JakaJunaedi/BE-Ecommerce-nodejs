//exports.liveChats = (req, res) => {
//    return res.send('tes chat');
//}
const users = [];

const addUser = ({ id, email, room }) => {
    email = email.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existingUser = users.find((user) => user.room === room && user.email === email);

    if(existingUser){
        return { error: 'User is taken' }
    }

    const user = { id, email, room };
    users.push(user);
    return { user } 
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    users.find((user) => user.id === id);
}

const getUserInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUserInRoom };