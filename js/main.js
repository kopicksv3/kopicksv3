$(document).ready(function () {
    //'use strict';
    $('[data-toggle="tooltip"]').tooltip();

    $('[data-countdown]').each(function () {
        var $this = $(this), finalDate = $(this).data('countdown');
        $this.countdown(finalDate, function (event) {
            $this.html(event.strftime(''
            + '<span class="days">%D days</span>'
            + '%H:%M:%S'));
        });
    });

});

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (pattern) {
        //'use strict';
        var d = this.length - pattern.length;
        return d >= 0 && this.lastIndexOf(pattern) === d;
    };
}