
function kajimikvosumizbral(nomeraelementa){
    var otgovor = $('input[name=Q'+nomernaelementa+'Choice]').val();
    var actotgovor = $('input#'+otgovor).text();
    console.log('user-a e natisnal otg.'+otgovor);
    console.log('user-a e izbral otg.'+actotgovor);

}

function opcno(a, b) {
    document.getElementById ? obj = document.getElementById("example" + a + b) : document.all && (obj = document.all["example" + a + b])
}

function opc(a, b) {
    opcno(a, b), obj && (obj.style.display = "none" == obj.style.display ? "" : "none")
}

function opc1(questionNumber, answerPossibilities, correctAnswer) { // vika se vseki put kato izberesh otgovor
    var d = eval("document.Q1Form.Q" + questionNumber + "Choice"),
        v = 0;
    for (i = 0; i < 3; i++) opcno(questionNumber, v), "" == obj.style.display && (obj.style.display = "none"), v = i + 1;
    for (v = 0, i = 0; i < answerPossibilities; i++) 1 == d[i].checked && (v = i + 1);
    v == correctAnswer ? v = 2 : v > 0 && (v = 1), opc(questionNumber, v)
}
$(document).ready(function() {
    $('[data-toggle="offcanvas"]').click(function() {
        $(".row-offcanvas").toggleClass("active")
    })
});
var scrolltotop = {
    setting: {
        startline: 700,
        scrollto: 0,
        scrollduration: 500,
        fadeduration: [500, 100]
    },
    controlHTML: '<img src="image/totop.png" style="width:67px; height:68px">',
    controlattrs: {
        offsetx: 5,
        offsety: 5
    },
    anchorkeyword: "#top",
    state: {
        isvisible: !1,
        shouldvisible: !1
    },
    scrollup: function() {
        this.cssfixedsupport || this.$control.css({
            opacity: 100
        });
        var a = isNaN(this.setting.scrollto) ? this.setting.scrollto : parseInt(this.setting.scrollto);
        a = "string" == typeof a && 1 == jQuery("#" + a).length ? jQuery("#" + a).offset().top : 0, this.$body.animate({
            scrollTop: a
        }, this.setting.scrollduration)
    },
    keepfixed: function() {
        var a = jQuery(window),
            b = a.scrollLeft() + a.width() - this.$control.width() - this.controlattrs.offsetx,
            c = a.scrollTop() + a.height() - this.$control.height() - this.controlattrs.offsety;
        this.$control.css({
            left: b + "px",
            top: c + "px"
        })
    },
    togglecontrol: function() {
        var a = jQuery(window).scrollTop();
        this.cssfixedsupport || this.keepfixed(), this.state.shouldvisible = a >= this.setting.startline ? !0 : !1, this.state.shouldvisible && !this.state.isvisible ? (this.$control.stop().animate({
            opacity: 1
        }, this.setting.fadeduration[0]), this.state.isvisible = !0) : 0 == this.state.shouldvisible && this.state.isvisible && (this.$control.stop().animate({
            opacity: 0
        }, this.setting.fadeduration[1]), this.state.isvisible = !1)
    },
    init: function() {
        jQuery(document).ready(function(a) {
            var b = scrolltotop,
                c = document.all;
            b.cssfixedsupport = !c || c && "CSS1Compat" == document.compatMode && window.XMLHttpRequest, b.$body = a(window.opera ? "CSS1Compat" == document.compatMode ? "html" : "body" : "html,body"), b.$control = a('<div id="topcontrol">' + b.controlHTML + "</div>").css({
                position: b.cssfixedsupport ? "fixed" : "absolute",
                bottom: b.controlattrs.offsety,
                right: b.controlattrs.offsetx,
                opacity: 0,
                cursor: "pointer"
            }).attr({
                title: "Scroll Back to Top"
            }).click(function() {
                return b.scrollup(), !1
            }).appendTo("body"), document.all && !window.XMLHttpRequest && "" != b.$control.text() && b.$control.css({
                width: b.$control.width()
            }), b.togglecontrol(), a('a[href="' + b.anchorkeyword + '"]').click(function() {
                return b.scrollup(), !1
            }), a(window).bind("scroll resize", function() {
                b.togglecontrol()
            })
        })
    }
};
scrolltotop.init();
