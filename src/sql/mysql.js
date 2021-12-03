const { NjSuper } = require('njsuper')


class NjMysql extends NjSuper {
    constructor(dt, objx) {
        super(dt, objx)


    }

    tablename(name) {
        this.table = name
    }

    copy(self) {
        return new NjMysql(self)
    }

    insert(value) {
        if(typeof value === 'object') {
            const clonevalue = value
            value = ''
            for (const vl in clonevalue) {
                value =+ "("+JSON.stringify(clonevalue[vl])+"),"
            }
            value = value.slice(0, -1)
        }

        this.query = 'INSERT INTO '+this.table+ ' VALUES '+value+';'
        this.complete = true
    }

    update(where, col, wherevalue, value) {
        this.query = 'UPDATE '+this.table+' SET '+col+'='+value+' WHERE \
        '+where+'='+wherevalue+';'
    }

    select(options) {
        this.options = options
        const select = '*'
        
        if(options.select) {
            this.query = 'SELECT '+options.select+' '
        } else {
            this.query = 'SELECT '+select+' '
            
        }

        if(options.table) {
            this.query = this.query + 'FROM '+options.table+' '
        } else {
            this.query = this.query + 'FROM '+this.table+' '
        }
    }
    

    awo(options) {
        this.select(options)

        if(options.as) {
            this.query = this.query+options.as
        }
        if(options.where) {
            this.query = this.query+options.where
        }
        if(options.order) {
            this.query = this.query+options.order
        }

    }

    selectJSON(row, where, value, options) {
        this.select(options)
        // if(this.options.json) {
        //     if(where && row && value) {
        //         this.query = this.query +"WHERE "+row+"-->'$."+where+"' = '"+value+"';"
        //         this.complete = true
        //     }
        // }

        if(this.options.json == 'CAST') {
            if(where && row && value) {
                this.query = this.query +"WHERE CAST("+row+"->>'$."+where+"'AS CHAR(30)) = '"+value+"';"
                this.complete = true
            }
        } else if(this.options.json == 'MEMBER') {
            this.query = this.query +"WHERE "+value+" MEMBER OF("+row+"->'$."+where+"');"
            this.complete = true
        } else if(this.options.json == 'CONTAINS') {
            this.query = this.query +"WHERE JSON_CONTAINS("+row+"->'$."+where+"', CAST('"+value+"' AS JSON));"
            this.complete = true
        } else if(this.options.json == 'OVER') {
            this.query = this.query +"WHERE JSON_OVERLAPS("+row+"->'$."+where+"', CAST('"+value+"' AS JSON));"
            this.complete = true
        }

        // if(options.explain) {
        //     this.queryExplain = 'EXPLAIN '+this.query
        // }

    }

}

module.exports = { NjMysql }