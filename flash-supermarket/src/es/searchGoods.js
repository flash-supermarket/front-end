import axios from 'axios';

export async function searchNGoods(n) {
    const url = 'http://8.210.10.16:9200/goods/_search';

    const requestBody = {
        query: {
            "match_all": {}
        },
        size: n,
    };
    try {
        const response = await axios.post(url, requestBody, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        });
        return parseJson(response.data.hits.hits);
    } catch (error) {
        console.error('Error while searching users:', error);
        return null;
    }
}

export async function searchQueryGoods(query) {
    const url = 'http://8.210.10.16:9200/goods/_search';

    const requestBody = {
        query: {
            "match": {
                "title": query
            }
        }
    };
    try {
        const response = await axios.post(url, requestBody, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        });
        return parseJson(response.data.hits.hits);
    } catch (error) {
        console.error('Error while searching users:', error);
        return null;
    }
}

export async function searchAnyGoods(json_query) {
    const url = 'http://8.210.10.16:9200/goods/_search';

    const requestBody = json_query;
    try {
        const response = await axios.post(url, requestBody, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        });
        return parseJson(response.data.hits.hits);
    } catch (error) {
        console.error('Error while searching users:', error);
        return null;
    }
}

function parseJson(jsons) {
    for (let json_ of jsons) {
        let json = json_['_source'];
        for (const k in json) {
            try {
                json[k] = JSON.parse(json[k]);
            }
            catch {
                json[k] = json[k];
            }
        }
    }
    return jsons;
}