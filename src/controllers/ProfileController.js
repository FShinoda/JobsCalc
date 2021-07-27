const Profile = require('../model/Profile');

module.exports = {
    index(req, res){
        return res.render("profile", {profile: Profile.get()})
    },

    update(req, res){
        // req.body para pegar os dados
        const data = req.body;
        // definir quantas semanas tem um ano
        const weeksPerYear = 52;
        // remover as semanas de férias do ano, para pegar quantas semanas tem em 1 mes
        const weeksPerMonth = (weeksPerYear - data["vacation-per-year"])/ 12;
        // quantas horas por semana trabalho
        const weekTotalHours = data["hours-per-day"] * data["days-per-week"];

        // horas trabalhadas no mes
        const hoursPerMonth = weeksPerMonth * weekTotalHours;

        data["value-hour"] = data["monthly-budget"] / hoursPerMonth;

        Profile.update(data);

        return res.redirect('/profile');

    }
}