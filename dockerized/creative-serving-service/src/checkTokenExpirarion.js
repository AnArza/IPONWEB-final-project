import jwt_decode from 'jwt-decode';

export function checkTokenExpiration() {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  console.log("enteres check token exp")
  if (accessToken) {
    const decodedAccessToken = jwt_decode(accessToken);
    const currentTime = Date.now() / 1000;
    console.log(decodedAccessToken)
    console.log(currentTime+" CURRENT TIME")
    console.log(decodedAccessToken.exp+" EXPIRATION")
    console.log(decodedAccessToken.exp < currentTime)
    console.log(decodedAccessToken.exp-currentTime+"  DIFF")
    if (decodedAccessToken.exp < currentTime) {
      console.log("ENTERED REMOVEEE")
      localStorage.clear(); 
    }
  }

  if (refreshToken) {
    const decodedRefreshToken = jwt_decode(refreshToken);
    const currentTime = Date.now() / 1000;

    if (decodedRefreshToken.exp < currentTime) {  
      localStorage.clear();
    }
  }
}
