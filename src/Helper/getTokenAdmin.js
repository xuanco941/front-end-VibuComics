const getTokenAdmin = () => {
    if(localStorage.getItem('accessTokenAdmin') && localStorage.getItem('refreshTokenAdmin')){
        return [localStorage.getItem('accessTokenAdmin'),localStorage.getItem('refreshTokenAdmin')]
    }
    else{
        return ['',''];
    }
}

export default getTokenAdmin