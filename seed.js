const mongoose = require("mongoose")
const Event = require("./models/Event");

const events = [
    {
        name: "Machine Learning Encoded",
        img: "https://d3caycb064h6u1.cloudfront.net/wp-content/uploads/2021/06/Machine_Learning.jpg",
        date: new Date('2024-09-12'),  
        time : "09:30 AM",
        society: "LEAN IN IGDTUW",
        venue: "Main Auditorium",
        type: "ML",
        desc: "A Machine Learning event on the latest in technology.",
        // author: someUserId,  // Assuming you have the user ID
        registerLink: "https://forms.office.com/r/gKdajra0cF"
    },
    {
        name: "Web Developement Tips & Tricks",
        img: "https://d3caycb064h6u1.cloudfront.net/wp-content/uploads/2021/06/Machine_Learning.jpg",
        date: new Date('2024-07-12'),  
        time : "12:30 PM",
        society: "CODEBENDERS IGDTUW",
        venue: "Seminar Hall",
        type: "Web Development",
        desc: "A Machine Learning event on the latest in technology.",
        // author: someUserId,  // Assuming you have the user ID
        registerLink: "https://forms.office.com/r/gKdajra0cF"
    },

    {
        name: "Internship Drive encoded",
        img: "https://d3caycb064h6u1.cloudfront.net/wp-content/uploads/2021/06/Machine_Learning.jpg",
        date: new Date('2024-07-12'),  
        time : "12:30 PM",
        society: "CODEBENDERS IGDTUW",
        venue: "Seminar Hall",
        type: "Web Development",
        desc: "A Machine Learning event on the latest in technology.",
        // author: someUserId,  // Assuming you have the user ID
        registerLink: "https://forms.office.com/r/gKdajra0cF"
    },

]

async function seedDB() {
    await Event.insertMany(events);
    console.log("DB seeded")

}

module.exports=seedDB;