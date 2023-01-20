const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, getUserByEmail){
    const authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email);

        if (user == null){
            /** 
             * done() WAS PASSED WITH 'null', BECAUSE THERE IS NO ERROR OCCURRED 
             * done() WAS ALSO PASSED WITH 'false', BECAUSE WE FOUND NO USER
             * done() WAS ALSO PASSED WITH AN OBJECT WITH AN ATTRIBUTE OF MESSAGE, THIS WILL ACT AS ERROR MESSAGE
             */
            return done(null, false, { message: "No user with that email" });
        }

        try{
            if(await bcrypt.compare(password, user.password)){
                return done(null, user);
            }
            else{
                return done(null, false, { message: "Incorrect password" });
            }
        }
        catch (err){
            return done(err);
        }
    };

    /** 
     * 'email' WAS FED TO usernameField BECAUSE IN THE LOGIN EXAMPLE, EMAIL WAS USED AND NOT USERNAME
     * NOTE, THE OBJECT PASSED TO LocalStrategy WAS CALLED 'OPTIONS', PASSWORD WASN'T FED BECAUSE IT WAS ALREADY THE DEFAULT
     */
    passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
    passport.serializeUser((user, done) => {
        
    });

    passport.deserializeUser((id, done) => {
        
    });
}

module.exports = initialize;