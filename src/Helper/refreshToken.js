
const refreshTokenAdmin = async () => {
    await fetch(process.env.REACT_APP_API_ENDPOINT+'/admin/refresh-token',{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            refreshTokenAdmin: localStorage.getItem('refreshTokenAdmin')
        })
    })
    .then(res => res.json())
    .then(data => {
        if(data.status === 'success'){
            localStorage.setItem('accessTokenAdmin', data.data.accessTokenAdmin);
            console.log('true');
            return true;
        }
        else{
            console.log('false');
            return false;
        }
    });
}

const refreshTokenUser = () => {
    fetch(process.env.REACT_APP_API_ENDPOINT+'/user/refresh-token',{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            refreshToken: localStorage.getItem('refreshToken')
        })
    })
    .then(res => res.json())
    .then(data => {
        if(data.status === 'success'){
            localStorage.setItem('accessToken', data.data.accessToken);
            return true;
        }
        else{
            return false;
        }
    })
}


export {refreshTokenAdmin,refreshTokenUser}