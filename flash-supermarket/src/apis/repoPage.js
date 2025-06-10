import httpInstance from "./globalConfig";

export async function collectRepo(data){
    const res =  await httpInstance.request({
        url: "/star",
        method: "post",
        data,
        headers:{
            'Content-Type': 'application/json',
        }
    });
    if(res.status === 200) return res.data;
    else throw new Error("collect repo error");

}

export async function cancelCollect(data) {
    const res =  await httpInstance.request({
        url: "/unstar",
        method: "delete",
        data,
        headers:{
            'Content-Type': 'application/json',
        }
    });
    if(res.status === 200) return res.data;
    else throw new Error("cancel collect error");
}

export async function starRepo(data){
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

export async function cancelStar(data) {
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

export async function getListLikeById(repoId){
    const res =  await httpInstance.request({
        url: `/listLikeById/${repoId}`,
        method: "get",
    });
    if(res.status === 200) return res.data;
    else throw new Error("get list like error");
}

export async function getListCollectById(repoId){
    const res = await httpInstance.request({
        url: `/listStarById/${repoId}`,
        method: "get",
    });
    if(res.status === 200) return res.data;
    else throw new Error("get list collect error");
}