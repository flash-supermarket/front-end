import httpInstance from "./globalConfig";

export async function getUserRepos(data) {
    return httpInstance.request({
        url: '/personPage',
        method: 'get',
        data: data,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export async function getUserInfo(userName) {
    const res = await httpInstance.request({
        url: `/info/${userName}`,
        method: 'get',
    });
    if(res.status === 200) {
        return res.data;
    } else {
        throw new Error(`Error fetching user info, status code: ${res.status}`);
    }
}

export async function editUserInfo(data) {
    const res = await httpInstance.request({
        url: '/edit',
        method: 'post',
        data: data,
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if(res.status === 200) {
        return res.data;
    } else {
        throw new Error(`Error editing user info, status code: ${res.status}`);
    }
}

export async function unFollowUser(data){
    const res = await httpInstance.request({
        url: '/unfollow',
        method: 'delete',
        data: data,
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if(res.status === 200) {
        return res.data;
    } else {
        throw new Error(`Error unfollowing user, status code: ${res.status}`);
    }
}

export async function followUser(data){
    const res = await httpInstance.request({
        url: '/follow',
        method: 'post',
        data: data,
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if(res.status === 200) {
        return res.data;
    } else {
        throw new Error(`Error following user, status code: ${res.status}`);
    }
}

export async function getListCollect(userName) {
    console.log(userName)
    const res = await httpInstance.request({
        url: `/listStar/${userName}`,
        method: 'get',
       
    });
    if(res.status === 200) {
        return res.data;
    }else throw new Error(`Error fetching user info, status code: ${res.status}`);
}

export async function getListStar(userName) {
    const res = await httpInstance.request({
        url: `/listLike/${userName}`,
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if(res.status === 200) {
        return res.data;
    }else throw new Error(`Error fetching user info, status code: ${res.status}`);
}