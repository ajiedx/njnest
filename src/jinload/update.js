const reqUpdate = (host, req, timer) => {

    setTimeout(function() {requestUpdate(host, req)}, timer)
}

function responseUpdate(res, req, host) {

    if (!req) {
        xhr = new XMLHttpRequest()
        reqUpdate(host, xhr, 3000)
    } else {
        
        if (res) {
            if(self.update == undefined) {
                Object.defineProperty(self, 'update', {
                    value: res,
                    enumerable: true,
                    writable: true,
                    configurable: true
                  })
                
                  reqUpdate(host, req, 3000)
            } else if (self.update == res) {

                reqUpdate(host, req, 3000)
            } else {
                reqUpdate(host, req, 3000)
                
                self.postMessage(res)
                self.update = res
            }
        } else {
            console.log(res)
        }
    }
    
    
}

function requestUpdate(host, xhr) {
    xhr.open('GET', host + '/jinload', true)
    xhr.setRequestHeader('jinupdate', '')
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200) {
            responseUpdate(xhr.responseText, xhr, host)
        }
    }

    xhr.send()
}

onmessage = function (event) {
    if (event) {
        const xhr = new XMLHttpRequest()
        requestUpdate(event.data, xhr)
    }
}