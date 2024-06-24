const passport = require("passport");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL } =
  process.env;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_REDIRECT_URL,
    },
    async function (accessToken, refreshToken, profile, done) {
      // Memeriksa apakah emails ada dan memiliki nilai
      if (profile.emails && profile.emails.length > 0) {
        let user = await prisma.user.upsert({
          where: { email: profile.emails[0].value },
          update: { google_id: profile.id },
          create: {
            fullname: profile.name.givenName + ' ' + profile.name.familyName,
            family_name: profile.name.familyName,
            email: profile.emails[0].value,
            google_id: profile.id,
            isVerified: true
          },
        });

        done(null, user);
      } else {
        // Menangani jika tidak ada email yang tersedia di profil
        done(new Error("No email found in profile, unable to authenticate."), null);
      }
    }
  )
);

module.exports = passport;
