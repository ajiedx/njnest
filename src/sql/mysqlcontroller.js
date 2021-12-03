
const { NjMysqlField } = require('./mysqlfield')
const { NjJson } = require('../parse/json')
const { NjValidate } = require('../nest/validate')

class NjMysqlController extends NjValidate {
    constructor(dt, objx) {
        super(dt, objx)
        this.sql.tablename(this.name)
        if (this.fields) {
            
            for (const i in this.fields) {
                let count = 0
                if (i.includes('__')) {
                    const name = i.split('__')

                    let typeContents = {type__: name[1], field__: name[0]}
                    if (this.typeof(this.fields[i]) === 'string') {
                        Object.assign(typeContents, {[name[1]]: this.fields[i]})
                    } else {
                        Object.assign(typeContents, this.fields[i])
                    }

                    if (this.typeof(this.fields[i]) !== 'string') {
                        for (const c in this.fields[i]) {
                            count = count + 1
                        }
                    } 
                    

                    if (name[1] === 'JSON') {
                        delete typeContents.type__
                        this[name[0]] = new NjJson('', typeContents)
                        this[name[0]].count = count
                        delete this[name[0]].dt
                    } else {
                        this[name[0]] = new NjMysqlField('', typeContents)
                        this[name[0]].count = count
                        delete this[name[0]].dt
                    }
                    
                    

                } else {
                    console.log('Provide type for "' + i + '" Through "field__TYPENAME"')
                }

            }

            if (this.info) {
                
            }


        }
    }

    resolve(results, fields) {
        // const sm = rows.serverStatus
        const res = results

        // console.log(res);

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
        return
    }

    async add(data) {
        if (arguments.length > 1) {
            data = this.mysqlify(arguments)
        }

        this.sql.insert(data)
        this.rest = true
        this.querify(this.sql.query)
    }

    async showByJson(show, by, options) {
        let params = {
            json: 'CAST'
        }

        if (options) {
            Object.assign(options, params)
        }


        if (this.field) {
            this.sql.selectJSON(this.field, by, show, options)
        } else if (options.field) {
            this.sql.selectJSON(options.field, by, show, options)
        }

        this.querify(this.sql.query, '3')
    }

    async getBy(where, value) {

    }

    async delete(id) {

    }

    async update(id) {

    }

    async querify(sql, the) {
        console.log(the)
        if (!this.queries) {
            console.log(1)
            this.queries = [sql]
        } else {
            console.log(2)
            this.queries.push(sql)
        }
    }

    

  

    async exec(req) {
        
        if (!this.rest) {
            this.validate(req)
        }
        if (this.sqlRequest) {
            if (this.queries) {
                for (const i in this.queries) {
                    this.sqlRequest(this.queries[i], this.resolve)
                    console.log(this.queries[i]);
                }
            }
            this.queries = []

        }
    }


}

module.exports = { NjMysqlController }
