
const { NjController } = require('../url/controller')

class NjMysqlController extends NjController {
    constructor(dt, objx) {
        super(dt, objx)
        
    }

    resolve(rows, fields) {
        // const sm = rows.serverStatus
        const resulst = rows
        console.dir(resulst)
        console.dir(JSON.stringify(resulst[0]))

        // console.log('Resolving...', rows, fields)
    }
    
    mysqlify(data) {
        let clonedata = data
        data = ''
        for (const i in clonedata) {
            if(clonedata[i].includes('{')) {
                
                clonedata[i] = clonedata[i].replace('{', "'{")
                clonedata[i] = clonedata[i].replace('}', "}'")

            }

            if (clonedata.length - 1 == i) {
                data = data + clonedata[i]
            } else {
                data = data + clonedata[i] + ', '
            }

        }

        return '('+data +')'
    }

    async add(data) {
        if (arguments.length > 1) {
            data = this.mysqlify(arguments)
        }
        
        this.sql.insert(this.name, data)
        this.query(this.sql.query)
    }

    async showByJson(show, by, l) {
        const options = {
            json: 'CAST',
            select: '*'
        }
        this.sql.selectJSON(this.name, 'info', by, show, options)
        console.log(this.sql.query)
        this.query(this.sql.query)
    }

    async getBy(where, value) {

    }

    async delete(id) {

    }

    async update(id) {

    }

    async query(sql) {
        if (!this.queries) {
            this.queries = [sql]
        } else {
            this.queries.push(sql)
        }
    }
    
    async exec() {
        if (this.sqlRequest) {
            if (this.queries) {
                for (const i in this.queries) {
                    this.sqlRequest(this.queries[i], this.resolve)
                    
                }
            }
            
        }
    }
    

}

module.exports = { NjMysqlController }