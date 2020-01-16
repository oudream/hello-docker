/*
 tab_name:ti_log_user
 tab_cfg:{
    f1:{
          name:"f_id",
          type:'number',
          def:'0'
     }
 }
 val:{
    f1 : 2,
 }
*/
export default {
    sql: {
        getInsert: function (tab_name,tab_cfg,vals) {
            // var k = val.keys().toString();
            let sFields = [];
            let sValues = [];
            let sDescs = [];
            let curr = Date.now();
            for (let key in tab_cfg){
                let m = tab_cfg[key];
                if(m.name  && m.name.length>0 )
                {
                    sFields.push(['`', m.name, '`'].join(''));

                    if(vals.hasOwnProperty(key))
                    {
                        let s = "";
                        let s1="";

                        if(m.type === 'number'){
                            s1= s = String(vals[key]);
                        }else if(m.type === 'now_ms'){
                            s1 = s = String(curr);
                        }else if(m.type === 'now_s'){
                            s1 = s = String(math.round(curr/1000));
                        }else{
                            s = "'" + vals[key] + "'";
                            s1 = vals[key];
                        }
                        sValues.push(s);

                        if (m.desc && m.desc.length>0)
                        {
                            let sDesc = [m.desc,':[',s1,']'].join('');
                            sDescs.push(sDesc);
                        }
                    }else{
                        let s = "";
                        if(m.type === 'number'){
                            s = String(m.def?m.def:"0");
                        }else if(m.type === 'now_ms'){
                            s = String(curr);
                        }else if(m.type === 'now_s'){
                            s = String(math.round(curr/1000));
                        }else{
                            if(m.def)s = "'" + m.def+ "'";
                            else s = String("NULL");
                        }
                        sValues.push(s);
                    }
                }
            }
            // Object.keys(tab_cfg).forEach(key=>{
            // });

            let r_err = true;
            let r_sql = null;
            if(tab_name && sFields.length>0 && sValues.length>0)
            {
                r_sql = [' INSERT INTO `', tab_name, '`('].join('');
                r_sql += sFields.join(',');
                r_sql += ') VALUES(';
                r_sql += sValues.join(',');
                r_sql += ');';
                r_err = false;
            }
            let r_desc = sDescs.join(',');

            return  {
                err:r_err,
                sql:r_sql,
                desc:r_desc
            };
        },

        getUpdate: function (tab_name,tab_cfg,vals,vals_o,conds) {
            // var k = val.keys().toString();
            let sUpdates = [];
            let sDescs = [];
            for (let key in vals){
                let v1 = vals[key];
                let v2 = vals_o[key];
                if (v1!== v2)
                {
                    if(tab_cfg.hasOwnProperty(key)){
                        let m = tab_cfg[key];
                        if(m.name && m.name.length>0){
                            if(m.type === 'number'){
                                sUpdates.push(m.name+' = '+v1);
                            }else{
                                sUpdates.push(m.name+" = '" + v1 + "'");
                            }
                            if (m.desc && m.desc.length>0)
                            {
                                let sDesc = [m.desc,':[',v2,']->[',v1,']'].join('');
                                sDescs.push(sDesc);
                            }
                        }else{
                            if (m.desc && m.desc.length>0)
                            {
                                let sDesc = [m.desc,':[',v2,']->[',v1,']'].join('');
                                sDescs.push(sDesc);
                            }
                        }
                    }
                }
            }
            // Object.keys(vals).forEach(key=>{
            // });

            let r_sql = null;
            let r_err = true;
            if(tab_name && sUpdates.length>0){
                r_sql = [' UPDATE `', tab_name, '` SET '].join('');
                r_sql += sUpdates.join(',');
                if( conds && conds.length >0 ){
                    r_sql += ' WHERE ';
                    r_sql += conds;
                }
                r_sql += ';';
                r_err = false;
            }

            let r_desc = sDescs.join(';');

            return  {
                err:r_err,
                sql:r_sql,
                desc:r_desc
            };
        },
    },
};
