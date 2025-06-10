import httpInstance from "./globalConfig";

export async function getPostLike(postid) {
    const res = await httpInstance.request({
        url: `/listLikeById/${postid}`,
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if(res.status === 200) {
        return res.data;
    } else {
        throw new Error(`Error fetching user info, status code: ${res.status}`);
    }
}

export async function likePost(data){
    const res =  await httpInstance.request({
        url: "/like",
        method: "post",
        data,
        headers:{
            'Content-Type': 'application/json',
        }
    });
    if(res.status === 200) return res.data;
    else throw new Error("star repo error");
}

export async function unlikePost(data) {
    const res =  await httpInstance.request({
        url: "/unlike",
        method: "delete",
        data,
        headers:{
            'Content-Type': 'application/json',
        }
    });
    if(res.status === 200) return res.data;
    else throw new Error("cancel star error");
}
