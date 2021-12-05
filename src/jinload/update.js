const reqUpdate = (host, timer) => {

    setTimeout(function() {requestUpdate(host)}, timer)
}

function responseUpdate(res, host) {
    if (res) {
        if(self.update == undefined) {
            Object.defineProperty(self, 'update', {
                value: res,
                enumerable: true,
                writable: true,
                configurable: true
              })
            
              reqUpdate(host, 3000)
        } else if (self.update == res) {
            reqUpdate(host, 3000)
        } else {

            reqUpdate(host, 3000)

            self.postMessage(res)
            self.update = res
        }
    } else {
        console.log(res)
    }

    
    
}

function requestUpdate(host) {
    fetch(host + '/jinload/update', {
        method: 'PUT', 
        headers: {
        // 'Content-Type': 'text/javascript',
        },
        // body: JSON.stringify(data),
    })
    .then(response => {

        response.text().then(function(text) {
            responseUpdate(text, host)

        })
        
        
    })
    // .then(data => {
    //     console.log('Success:', data)
    // })
    .catch((error) => {
        console.error('Error:', error)
        self.postMessage('RELOAD')
    })

}

onmessage = function (event) {
    if (event) {
        try {

            requestUpdate(event.data)
        } catch (error) {

            requestUpdate(event.data)
        }

    }
}