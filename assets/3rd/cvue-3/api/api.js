import axios from 'axios';

let base = '';

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

export const getOdoQuery = params =>{
    if (params.data) odl.DbMysql.fromM(params.odc, params.data);
    return axios.post(`${base}/odo/query`, params).then(res => {
        let rs = res.data;
        if (rs && rs.action === 'ls' && rs.data) {
            odl.DbMysql.toM(rs.odc, rs.data);
        }
        return rs;
    });
};

export const getSqlQuery = params => { return axios.post(`${base}/sql/query`, params).then(res => res.data); };

export const getSqlQueries = params => { return axios.post(`${base}/sql/queries`, params).then(res => res.data); };

export const getSqlTrans = params => { return axios.post(`${base}/sql/trans`, params).then(res => res.data); };
