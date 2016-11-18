'use strict';

(function(window, undefined) {

    /**
     * Request
     * @param {[Object]} options [object]
     */
    var Request = function(options) {
        var ops = options || {},
            _this = this,
            xhr;

        this.url = '';
        for (var key in ops) {
            this[key] = ops[key];
        }

        try {
            this.xhr = new XMLHttpRequest();
        } catch (ev) {
            this.xhr = new ActiveXObject('MSXML2.XMLHTTP.3.0');
        }

        xhr = this.xhr;
        xhr.open(this.method, this.url);

        try {
            //xml 2
            xhr.ontimeout = this.ontimeout;
            xhr.onprogress = this.updateProgress;
            xhr.upload.onprogress = this.updateProgress;
        } catch (ev) {

        }

        xhr.onreadystatechange = function() {

            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    _this.success.call(xhr, xhr.responseText || xhr.responseXML);
                } else if (xhr.status === 404) {
                    _this.error.call(xhr, xhr.statusText);
                }
                _this.complete.call(xhr, 'complete');
            }

        };
        /**
         * set request header;
         * @param  {[type]} var header        [description]
         * @return {[type]}     [description]
         */
        for (var header = 0; header < this.setRequestHeader.length; header++) {
            var obj = this.setRequestHeader[header] || {};
            for (var key in obj) {
                xhr.setRequestHeader(key, obj[key]);
            }

        }
        xhr.send(this.data);
    };

    var fn = Request.prototype;

    fn.data = null;
    fn.method = 'GET';
    fn.setRequestHeader = [];
    fn.success = fn.error = fn.complete = function(xhr, msg) {};
    fn.ontimeout = function() {};
    fn.updateProgress = function() {};
    fn.abort = function() {
        this.xhr.abort();
    };
    window.Request = Request;
})(this);


var request = function(options) {
    return new Request(options);
};


var files = document.querySelectorAll('input[type=file]');
document.getElementById('file').onchange = function() {
    var formData = new FormData();

    for (var i = 0; i < files.length; i++) {　　　　
        formData.append('files[]', files[i]);　　
    }

    var req = request({
        url: '../html5/',
        method: 'POST',
        data: formData,
        updateProgress: function(event) {
            if (event.lengthComputable) {
                console.log(event);
                var percentComplete = event.loaded / event.total;
                console.log(Math.ceil(percentComplete * 100) + '%');
            }
        },
        success: function(msg) {
            //console.log(this);
        },
        error: function() {

        },
        complete: function() {

        }
    });
};