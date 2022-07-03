import jwtDecode from 'jwt-decode';
//convert the token to the source user data
export default function parseJwt (token:string) {
    const x = jwtDecode(token);
    const user = JSON.parse(JSON.stringify(x));
    return user;
}