const getTokenUser = () => {
    if(localStorage.getItem('accessToken') && localStorage.getItem('refreshToken')){
        return [localStorage.getItem('accessToken'),localStorage.getItem('refreshToken')]
    }
    else{
        return ['',''];
    }
}

export default getTokenUser