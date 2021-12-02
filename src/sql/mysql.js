const { NjSuper } = require('njsuper')


class NjMysql extends NjSuper {
    constructor(dt, objx) {
        super(dt, objx)

    }

    mysqlify(value) {
        
    }

    insert(tablename, value) {
        if(typeof value === 'object') {
            const clonevalue = value
            value = ''
            for (const vl in clonevalue) {
                value =+ "("+JSON.stringify(clonevalue[vl])+"),"
            }
            value = value.slice(0, -1)
        }

        this.query = 'INSERT INTO '+tablename+ ' VALUES '+value+';'
        this.complete = true
    }

    update(tablename, where, col, wherevalue, value) {
        this.query = 'UPDATE '+tablename+' SET '+col+'='+value+' WHERE \
        '+where+'='+wherevalue+';'
    }

    selecting(tablename, options) {
        this.select = '*'
        this.query = 'SELECT '+this.select+' '
        
        if(options) {
            this.options = options

            if (options.complete) {
                this.query = this.query + 'FROM '+tablename+' '
            } else {
                if(options.select) {
                    this.query = 'SELECT '+options.select+' FROM '+tablename+' '
                }
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
        } else {
            this.query = this.query + 'FROM '+tablename+' '
        }
    }

    selectJSON(tablename, row, where, value, options) {
        this.selecting(tablename, options)
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

    getSql() {
        if(this.complete) {
            return this.sql
        } else {
            console.log('Hey! Yo! Complete it')
        }
    }
}

module.exports = { NjMysql }