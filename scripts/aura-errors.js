
window.newrelic.addEventListener('xhrSend', function(args, xhr) {
  var data = args[0]

  // intercept XHR calls that collect errors from Salesforce Aura frameworkt
  if (this.query.indexOf('reportFailedAction') > -1) {
    var fields = data.split('&')
    for (var i = 0; i < fields.length; i++) {
      var field = fields[i]
      var parts = field.split('=')

      var key = parts[0]
      var val = parts[1]
      if (key === 'message') {
        try {
          var decoded = decodeURIComponent(val)
          var parsed = JSON.parse(decoded)

          // the format of the message is generated in this Aura function
          // https://github.com/forcedotcom/aura/blob/master/aura-impl/src/main/resources/aura/AuraClientService.js#L1186
          parsed.actions.forEach(function(action) {
            if (action.descriptor === 'aura://ComponentController/ACTION$reportFailedAction') {
              var errorMessage = action.params.clientError
              var stack = action.params.clientStack
              var failedId = action.params.failedId

              var err = new Error(errorMessage)
              err.stack = stack
              newrelic.noticeError(err, { failedId: failedId })
            }
          })
        } catch (e) {
          // TODO: notice or ignore?
          console.log(e)
        }
      }
    }
  }

  // listen for responses that might have server errors
  if (this.params.pathname.indexOf('/aura') === 0) {
    xhr.addEventListener('load', function() {
      try {
        var contentType = xhr.getResponseHeader('content-type')
        if (contentType.indexOf('json') > -1) {
          var text = xhr.responseText
          var parsed = JSON.parse(text)
          parsed.actions.forEach(function(action) {
            if (action.state === 'ERROR' && action.error && action.error.length) {
              action.error.forEach(function(err) {
                if (err.event && err.event.attributes &&
                  err.event.attributes.values && err.event.attributes.values.attributes) {
                  var messageText = err.event.attributes.values.attributes.messageText

                  var error = new Error(messageText)
                  // stack is from server-code, do not capture
                  // var stack = err.event.attributes.values.attributes.stack
                  // err.stack = stack
                  newrelic.noticeError(error)
                }
              })
            }
          })
        }
      } catch (e) {
        // TODO: notice or ignore?
        console.log(e)
      }
    })
  }
})
