let data = {
    name: "Fernanda",
    avatar: "https://avatars.githubusercontent.com/u/45886482?v=4",
    "monthly-budget": 3000,
    "days-per-week": 5,
    "hours-per-day": 5,
    "vacation-per-year": 4,
    "value-hour": 80
};

module.exports = {
    get(){
        return data;
    },

    update(newData){
        data = newData;
    }
}