if (!process.env.ACCESS_TOKEN_SECRET) {
  throw Error(
    "process.env.ACCESS_TOKEN_SECRET is undefined. Check your env file configuration."
  );
}
if (!process.env.REFRESH_TOKEN_SECRET) {
  throw Error(
    "process.env.REFRESH_TOKEN_SECRET is undefined. Check your env file configuration."
  );
}

//jwt secret key
// export const secretKey = crypto.randomBytes(64).toString("hex");
export const jwtSecret = process.env.ACCESS_TOKEN_SECRET;
export const refreshJwtSecret = process.env.REFRESH_TOKEN_SECRET;
